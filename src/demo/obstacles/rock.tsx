import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useGame } from '../context/game-context'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'

const RockObstacle = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    const { entityManager, obstacles } = useGame()
    const rock = useLoader(GLTFLoader, '/desert_rock.glb');

    useEffect(() => {
        const entity = new YUKA.GameEntity()
        entity.position.set(2, 0, 2)
        entity.setRenderComponent(meshRef.current!, (entity, renderComponent) => {
            entity.boundingRadius = 2
            renderComponent.position.copy(entity.position)
        })
        entityManager.add(entity)

        obstacles.push(entity)

        return () => {
            entityManager.remove(entity)
            const index = obstacles.indexOf(entity)
            if (index > -1) obstacles.splice(index, 1)
        }
    }, [entityManager, obstacles])

    return (
        <group ref={meshRef} scale={0.2}>
            <primitive object={rock.scene} position={[2, -0.5, 2]} />
        </group>
    )
}

export default RockObstacle