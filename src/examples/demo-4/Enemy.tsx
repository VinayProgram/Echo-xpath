import { useYuka } from '@/yuka-manager/yuka-context'
import { gotoTargetPath } from '@/yuka-manager/yuka-entity-to-target'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import { useMemo, useEffect, useRef, useState } from 'react'
import * as YUKA from 'yuka'
import * as THREE from 'three'

const Enemy = () => {
    const { entityManager, playerVehicle, navMeshRef, obstacles } = useYuka();
    const meshRef = useRef<THREE.Mesh>(null);
    const [pathPoints, setPathPoints] = useState<THREE.Vector3[]>([]);

    // 1. Create the enemy vehicle once
    const enemy = useMemo(() => {
        const vehicle = new YUKA.Vehicle();
        vehicle.maxSpeed = 2; // Increased for clarity
        vehicle.maxForce = 5;
        vehicle.mass = 1;
        // Set initial position
        vehicle.position.set(5, 0, 5);
        return vehicle;
    }, []);

    // 2. Lifecycle: Add to entity manager and sync render component
    useEffect(() => {
        entityManager.add(enemy);

        enemy.setRenderComponent(meshRef.current, (entity, renderComponent) => {
            // Matrix sync
            //@ts-ignore
            (renderComponent as THREE.Mesh).matrix.copy(entity.worldMatrix);
        });

        return () => {
            entityManager.remove(enemy);
            enemy.setRenderComponent(null, () => { });
        };
    }, [entityManager, enemy]);

    // 3. Update Loop
    const lastUpdateTime = useRef(0);
    useFrame((state, _delta) => {
        // Pathfinding is expensive, let's only recalculate every 0.1s
        const currentTime = state.clock.getElapsedTime();
        if (currentTime - lastUpdateTime.current > 0.1 && navMeshRef.current) {
            lastUpdateTime.current = currentTime;

            const targetPos = new THREE.Vector3(
                playerVehicle.position.x,
                playerVehicle.position.y,
                playerVehicle.position.z
            );

            // Calculate path and set steering behaviors for the enemy
            const result = gotoTargetPath(
                targetPos,
                enemy, // We want the ENEMY to go to the target
                navMeshRef.current,
                obstacles,
                true, // withEchoPath
                true, // obstacleAvoidance
                2     // followPathSteetingBehavior speed
            );

            if (result) {
                setPathPoints(result.actualVisualPath);
            }
        }
    });

    return (
        <>
            {/* Visualizing the path the enemy is following */}
            {pathPoints.length > 1 && (
                <Line
                    points={pathPoints}
                    color="red"
                    lineWidth={2}
                    transparent
                    opacity={0.5}
                />
            )}

            {/* The Enemy Model */}
            <mesh ref={meshRef} matrixAutoUpdate={false}>
                <boxGeometry args={[0.6, 0.6, 0.6]} />
                <meshBasicMaterial color="white" />
            </mesh>
        </>
    );
}

export default Enemy