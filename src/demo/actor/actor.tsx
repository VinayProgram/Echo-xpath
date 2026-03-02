import { useEffect, useMemo, useRef } from 'react'
import { useGame } from '../context/game-context'
import { useFrame, useLoader } from '@react-three/fiber'
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
    const cameraMode = useGameStore((state) => state.cameraMode)

    const cameraOffset = useMemo(() => new THREE.Vector3(0, 1.5, -3), []) // Behind and above
    const lookAtOffset = useMemo(() => new THREE.Vector3(0, 1, 5), [])   // Looking forward

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


    const currentLookAt = useRef(new THREE.Vector3())
    const firstPersonStarted = useRef(true)

    // Reset snap flag when leaving first-person mode
    useEffect(() => {
        if (cameraMode !== 'firstPerson') {
            firstPersonStarted.current = true
        }
    }, [cameraMode])

    // Update YUKA's management and sync animations in the frame loop
    useFrame(({ camera }, delta) => {
        if (obstacles.length != 0 && isTransforming) {
            obstacles.forEach(({ entity, mesh }) => {
                const clonedPos = mesh.position.clone();
                entity.position.copy(new YUKA.Vector3(clonedPos.x, clonedPos.y, clonedPos.z))
            });
        }
        entityManager.update(delta);

        // First person camera logic
        if (cameraMode === 'firstPerson' && characterRef.current) {
            const vehiclePos = new THREE.Vector3();
            const vehicleQuat = new THREE.Quaternion();

            // Get current vehicle world position and orientation from matrix
            characterRef.current.updateMatrixWorld();
            characterRef.current.matrixWorld.decompose(vehiclePos, vehicleQuat, new THREE.Vector3());

            // Calculate ideal camera position (offset from vehicle)
            const idealPos = cameraOffset.clone().applyQuaternion(vehicleQuat).add(vehiclePos);
            // Calculate ideal point to look at (forward from vehicle)
            const idealLookAt = lookAtOffset.clone().applyQuaternion(vehicleQuat).add(vehiclePos);

            if (firstPersonStarted.current) {
                // Initial snap on mode switch
                camera.position.copy(idealPos);
                currentLookAt.current.copy(idealLookAt);
                firstPersonStarted.current = false;
            } else {
                // Smooth position lerp
                camera.position.lerp(idealPos, 0.1);
                // Smooth rotation by lerping the target lookAt point
                currentLookAt.current.lerp(idealLookAt, 0.1);
            }

            camera.lookAt(currentLookAt.current);
        }

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



