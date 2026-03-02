import React, { useEffect } from 'react'
import { useGame } from '../context/game-context'
import { useFrame, useLoader, useThree } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { useAnimations } from '@react-three/drei'
import * as YUKA from 'yuka'
import { useGameStore } from '../store/use-game-store'
const Actor = () => {
    const { characterRef, entityManager, playerVehicle, obstacles } = useGame();
    const player = useLoader(GLTFLoader, '/cartoon_car.glb');
    const { actions, names } = useAnimations(player.animations, characterRef);
    const isTransforming = useGameStore((state) => state.isTransforming)
    useEffect(() => {
        if (!characterRef.current) return;
        playerVehicle.setRenderComponent(characterRef.current, (entity, renderComponent) => {
            // @ts-expect-error - matrix copy needed for sync
            (renderComponent as THREE.Group).matrix.copy(entity.worldMatrix);
        });
        playerVehicle.position.set(0, 0, 0);


        if (names.length > 0) {
            actions[names[0]]?.reset().fadeIn(0.5).play();
        }


        return () => {
            playerVehicle.setRenderComponent(null, () => { });
        }
    }, [characterRef, playerVehicle, actions, names]);


    // Update YUKA's management and sync animations in the frame loop
    useFrame((_, delta) => {
        if (obstacles.length != 0 && isTransforming) {
            console.log('works')
            obstacles.forEach(({ entity, mesh }) => {
                const clonedPos = mesh.position.clone();
                entity.position.copy(new YUKA.Vector3(clonedPos.x, clonedPos.y, clonedPos.z))
            });
        }
        entityManager.update(delta);


        const speed = playerVehicle.getSpeed();
        if (names.length > 0) {
            const currentAction = actions[names[0]];
            if (currentAction) {
                // Adjust animation playback speed relative to movement
                currentAction.timeScale = speed * 2; // Adjust multiplier as needed
                if (speed < 0.05) {
                    currentAction.paused = true;
                } else {
                    currentAction.paused = false;
                }
            }
        }
    });


    return (
        <group ref={characterRef} matrixAutoUpdate={false} position={[0, 0, 0]} >
            <primitive object={player.scene} scale={0.5} rotation={[0, -Math.PI / 2, 0]} />
        </group>
    )
}


export default Actor



