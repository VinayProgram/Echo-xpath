import React, { useEffect } from 'react'
import { useGame } from '../context/game-context'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const Actor = () => {
    const { characterRef, entityManager, playerVehicle } = useGame();

    useEffect(() => {
        if (!characterRef.current) return;

        // Sync visual with YUKA's world matrix
        playerVehicle.setRenderComponent(characterRef.current, (entity, renderComponent) => {
            // @ts-expect-error - matrix copy needed for sync
            (renderComponent as THREE.Group).matrix.copy(entity.worldMatrix);
        });

        // Initialize position
        playerVehicle.position.set(0, 0, 0);

        return () => {
            playerVehicle.setRenderComponent(null, () => {});
        }
    }, [characterRef, playerVehicle]);

    // Update YUKA's management in the frame loop
    useFrame((_, delta) => {
        entityManager.update(delta);
    });

    return (
        <group ref={characterRef} matrixAutoUpdate={false}>
            <mesh>
                <boxGeometry args={[1, 1, 1]} />
                <meshStandardMaterial color={'orange'} />
            </mesh>
        </group>
    )
}

export default Actor