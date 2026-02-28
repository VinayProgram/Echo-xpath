import React, { useRef, useEffect } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useGame } from '../context/game-context'

const RockObstacle = () => {
    const meshRef = useRef<THREE.Mesh>(null)
    const { entityManager, obstacles } = useGame()

    useEffect(() => {
        // Create YUKA entity for the obstacle
        const entity = new YUKA.GameEntity()
        
        // Define bounding volume for collision avoidance if needed
        // For simplicity, we use the position provided in the mesh
        entity.position.set(2, 0, 2)
        
        // Sync the mesh with the entity
        entity.setRenderComponent(meshRef.current!, (entity, renderComponent) => {
            meshRef.current?.geometry.computeBoundingBox()
            entity.boundingRadius = 2
            renderComponent.position.copy(entity.position)
        })

        // Add to YUKA manager
        entityManager.add(entity)
        
        // Add to our context obstacles list
        obstacles.push(entity)

        return () => {
            entityManager.remove(entity)
            const index = obstacles.indexOf(entity)
            if (index > -1) obstacles.splice(index, 1)
        }
    }, [entityManager, obstacles])

    return (
        <mesh ref={meshRef} position={[2, 0, 2]}>
            <boxGeometry args={[1, 1, 1]} />
            <meshStandardMaterial color={'blue'} />
        </mesh>
    )
}

export default RockObstacle