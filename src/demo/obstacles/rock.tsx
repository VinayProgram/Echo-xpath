import React, { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useGame } from '../context/game-context'
import { useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'

const RockObstacles = ({ count = 2 }) => {
    const { entityManager, obstacles } = useGame()
    const scene = useThree((state) => state.scene)

    // ✅ Load model ONCE
    const gltf = useLoader(GLTFLoader, '/desert_rock.glb')
    gltf.scene.scale.set(1, 1, 1)
    // ✅ Generate stable random positions
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

    useEffect(() => {
        const createdEntities: YUKA.GameEntity[] = []

        positions.forEach((pos) => {
            const entity = new YUKA.GameEntity()
            entity.position.set(pos.x, pos.y, pos.z)
            entity.boundingRadius = 2

            // Clone model
            const model = gltf.scene.clone(true)
            model.position.copy(pos)

            scene.add(model)

            entity.setRenderComponent(model, (entity, renderComponent) => {
                renderComponent.position.copy(entity.position)
            })

            entityManager.add(entity)
            obstacles.push(entity)

            createdEntities.push(entity)
        })

        return () => {
            createdEntities.forEach((entity) => {
                // scene.remove(entity.renderComponent)
                entityManager.remove(entity)

                const index = obstacles.indexOf(entity)
                if (index > -1) obstacles.splice(index, 1)
            })
        }
    }, [])

    return null
}

export default RockObstacles