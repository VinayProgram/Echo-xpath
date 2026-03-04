import { useEffect, useMemo } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useLoader, useThree } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import { useGameStore } from '../../../store/use-game-store'
import { useYuka } from '@/yuka-manager/yuka-context'


const RockObstacles = ({ count = 40 }) => {
    const { entityManager, obstacles, setObstacles } = useYuka()
    const scene = useThree((state) => state.scene)
    const gltf = useLoader(GLTFLoader, '/desert_rock.glb')
    const { isTransforming } = useGameStore()
    gltf.scene.scale.set(1, 1, 1)




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


    useEffect(() => {
        if (obstacles.length == 0) {
            positions.forEach((pos) => {
                const model = gltf.scene.clone()
                model.position.copy(pos)
                const entity = new YUKA.GameEntity()
                entity.position.set(pos.x, pos.y, pos.z)
                entity.boundingRadius = 1.5

                setObstacles((e) => [...e, {
                    entity: entity,
                    mesh: model
                }])
            })
        }
        return () => {
            obstacles.forEach((x) => {
                scene.remove(x.mesh)
                entityManager.remove(x.entity)
            })
            setObstacles([])
        }
    }, [])


    useEffect(() => {
        obstacles.forEach((x) => {
            console.log(x.mesh)
            scene.add(x.mesh)
            entityManager.add(x.entity)
        })

    }, [obstacles, isTransforming])






    return null
}


export default RockObstacles

