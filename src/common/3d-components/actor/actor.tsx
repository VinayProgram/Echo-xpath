import { useEffect, useRef } from 'react'
import { useFrame, useLoader } from '@react-three/fiber'
import * as THREE from 'three'
import { GLTFLoader } from 'three-stdlib'
import { useAnimations, useKeyboardControls } from '@react-three/drei'
import * as YUKA from 'yuka'
import { useGameStore } from '../../../store/use-game-store'
import { useYuka } from '@/yuka-manager/yuka-context'
interface ActorProps {
    modelPath?: string;
    scale?: number;
    rotation?: [number, number, number];
    cameraOffset?: THREE.Vector3;
    lookAtOffset?: THREE.Vector3;
    animationSpeedMultiplier?: number;
    isPlayer?: boolean; // New prop
}

const Actor = ({
    modelPath = '/cartoon_car.glb',
    scale = 0.5,
    rotation = [0, -Math.PI / 2, 0],
    cameraOffset = new THREE.Vector3(0, 1.5, -3),
    lookAtOffset = new THREE.Vector3(0, 1, 5),
    animationSpeedMultiplier = 2,
    isPlayer = false // Default to false
}: ActorProps) => {
    const { characterRef, entityManager, playerVehicle, obstacles } = useYuka();
    const player = useLoader(GLTFLoader, modelPath);
    const { actions, names } = useAnimations(player.animations, characterRef);
    const isTransforming = useGameStore((state) => state.isTransforming)
    const cameraMode = useGameStore((state) => state.cameraMode)
    const [, getControls] = useKeyboardControls()

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
        if (isPlayer) {
            const { forward, back, left, right } = getControls();

            const euler = new THREE.Euler().setFromQuaternion(
                new THREE.Quaternion(
                    playerVehicle.rotation.x,
                    playerVehicle.rotation.y,
                    playerVehicle.rotation.z,
                    playerVehicle.rotation.w,
                ),
                'YXZ'
            );

            const turnSpeed = 2 * delta;
            if (left) euler.y += turnSpeed;
            if (right) euler.y -= turnSpeed;

            const q = new THREE.Quaternion().setFromEuler(euler);

            // Compute forward from updated quaternion
            const forwardVec = new THREE.Vector3(0, 0, 1).applyQuaternion(q);

            if (forward) playerVehicle.velocity.set(
                forwardVec.x * playerVehicle.maxSpeed,
                forwardVec.y * playerVehicle.maxSpeed,
                forwardVec.z * playerVehicle.maxSpeed
            );
            if (back) playerVehicle.velocity.set(
                -forwardVec.x * playerVehicle.maxSpeed * 0.5,
                -forwardVec.y * playerVehicle.maxSpeed * 0.5,
                -forwardVec.z * playerVehicle.maxSpeed * 0.5
            );
            if (!forward && !back) playerVehicle.velocity.multiplyScalar(0.95);

            // ✅ Build final matrix from position + new quaternion, apply once to playerVehicle
            const finalMatrix = new THREE.Matrix4().compose(
                new THREE.Vector3(playerVehicle.position.x, playerVehicle.position.y, playerVehicle.position.z),
                q,
                new THREE.Vector3(1, 1, 1)
            );

            // ✅ Apply all at once — rotation, position, everything in one matrix write
            playerVehicle.rotation.set(q.x, q.y, q.z, q.w);
            playerVehicle.worldMatrix.set(...finalMatrix.toArray() as Parameters<YUKA.Matrix4['set']>);
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
                currentAction.timeScale = speed * animationSpeedMultiplier; // Use prop
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
            <primitive object={player.scene} scale={scale} rotation={rotation} />
        </group>
    )
}


export default Actor



