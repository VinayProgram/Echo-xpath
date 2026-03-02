import React, { useEffect, useMemo, useRef } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useGame } from '../context/game-context'
import { useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import { useGameStore } from '../store/use-game-store'

const RockObstacles = ({ count = 2 }) => {
    const { entityManager, obstacles, setObstacles, obstacleMeshRef } = useGame()
    const isTransforming = useGameStore((state) => state.isTransforming)
    const scene = useThree((state) => state.scene)
    const gltf = useLoader(GLTFLoader, '/desert_rock.glb')
    gltf.scene.scale.set(1, 1, 1)

    // Track previous isTransforming to detect toggle-off
    const prevIsTransforming = useRef(isTransforming)

    // Stable initial positions (generated once)
    const positions = useMemo(() => {
        const arr: THREE.Vector3[] = []
        for (let i = 0; i < count; i++) {
            arr.push(
                new THREE.Vector3(
                    THREE.MathUtils.randFloatSpread(30),
                    0,
                    THREE.MathUtils.randFloatSpread(30)
                )
            )
        }
        return arr
    }, [count])

    // Keep refs to created entities and meshes for cleanup and syncing
    const entitiesRef = useRef<YUKA.GameEntity[]>([])
    const meshesRef = useRef<THREE.Object3D[]>([])

    // 1. Create meshes + entities ONCE on mount
    useEffect(() => {
        const createdEntities: YUKA.GameEntity[] = []
        const createdMeshes: THREE.Object3D[] = []

        positions.forEach((pos) => {
            // Clone & place mesh
            const model = gltf.scene.clone(true)
            model.position.copy(pos)
            scene.add(model)
            createdMeshes.push(model)

            // Create YUKA entity
            const entity = new YUKA.GameEntity()
            entity.position.set(pos.x, pos.y, pos.z)
            entity.boundingRadius = 2

            entity.setRenderComponent(model, (_entity, renderComponent) => {
                renderComponent.position.copy(_entity.position)
            })

            entityManager.add(entity)
            createdEntities.push(entity)
        })

        // Store refs
        entitiesRef.current = createdEntities
        meshesRef.current = createdMeshes
        obstacleMeshRef.current = createdMeshes as THREE.Group[]

        // Update obstacles state
        setObstacles((prev) => [...prev, ...createdEntities])

        // Cleanup on unmount
        return () => {
            createdEntities.forEach((entity) => {
                entity.setRenderComponent(null, () => { })
                entityManager.remove(entity)
            })
            createdMeshes.forEach((mesh) => {
                scene.remove(mesh)
            })
            setObstacles((prev) => prev.filter((o) => !createdEntities.includes(o)))
            obstacleMeshRef.current = []
            entitiesRef.current = []
            meshesRef.current = []
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    // 2. When transform mode is turned OFF, sync YUKA entity positions from mesh positions
    useEffect(() => {
        const wasTransforming = prevIsTransforming.current
        prevIsTransforming.current = isTransforming

        // Only sync when toggling OFF (was true, now false)
        if (wasTransforming && !isTransforming) {
            meshesRef.current.forEach((mesh, i) => {
                const entity = entitiesRef.current[i]
                if (entity && mesh) {
                    // Bake the mesh's world position into the YUKA entity
                    entity.position.set(mesh.position.x, mesh.position.y, mesh.position.z)
                }
            })
        }
    }, [isTransforming])

    return null
}

export default RockObstacles