import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import * as YUKA from 'yuka'

interface UseRaycasterCollisionProps {
    characterRef: React.RefObject<THREE.Group | null>;
    playerVehicle: YUKA.Vehicle;
    enableCollision: boolean;
    obstacles: THREE.Object3D[];
    distance?: number;
}

export const useRaycasterCollision = ({
    characterRef,
    playerVehicle,
    enableCollision,
    obstacles,
    distance = 1
}: UseRaycasterCollisionProps) => {
    const lastSafePosition = useRef(new YUKA.Vector3());
    const raycaster = useMemo(() => new THREE.Raycaster(), []);

    const directions = useMemo(() => [
        new THREE.Vector3(0, 0, 1),  // Forward
        // new THREE.Vector3(0, 0, -1), // Backward
        new THREE.Vector3(1, 0, 0),  // Right
        new THREE.Vector3(-1, 0, 0), // Left
        // new THREE.Vector3(0, 1, 0),  // Up
        // new THREE.Vector3(0, -1, 0)  // Down
    ], []);

    useFrame(() => {
        if (!enableCollision || !characterRef.current || obstacles.length === 0) {
            lastSafePosition.current.copy(playerVehicle.position);
            return;
        }

        characterRef.current.updateMatrixWorld(true);
        // Compute Bounding Box from the mesh
        const bbox = new THREE.Box3().setFromObject(characterRef.current);
        const center = new THREE.Vector3();
        bbox.getCenter(center);

        let hasCollision = false;

        for (const dir of directions) {
            // Option 1: Directions in world space
            raycaster.set(center, dir);
            raycaster.far = distance;

            const intersects = raycaster.intersectObjects(obstacles, true);

            if (intersects.length > 0) {
                hasCollision = true;
                break;
            }
        }

        if (hasCollision) {
            // Throw him back to safe position
            playerVehicle.position.copy(lastSafePosition.current);
            // Optionally zero out velocity?
            playerVehicle.velocity.set(0, 0, 0);
        } else {
            // Update last safe position
            lastSafePosition.current.copy(playerVehicle.position);
        }
    });

    return { lastSafePosition };
};
