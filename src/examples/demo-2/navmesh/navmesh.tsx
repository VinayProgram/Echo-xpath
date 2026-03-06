import { useGameStore } from '@/store/use-game-store'
import { useYuka } from '@/yuka-manager/yuka-context'
import { gotoTargetPath } from '@/yuka-manager/yuka-entity-to-target'
import { useNavmeshHelper } from '@/yuka-manager/yuka-navmesh-helper-hook'
import { Line } from '@react-three/drei'
import { useLoader } from '@react-three/fiber'
import { GLTFLoader } from 'three-stdlib'
import * as THREE from 'three'
import React from 'react'
import PathMetrics from '@/utils/path-metrics'
const Navmesh2 = (props: any) => {
    const { scene } = useLoader(GLTFLoader, props.url) as any
    const { playerVehicle, obstacles } = useYuka()
    const { withEchoPath, obstacleAvoidance, followPathSteetingBehavior, setPathMetrics } = useGameStore()
    const { navigationMesh: navMesh } = useNavmeshHelper({ geo: null, path: "/navmesh.glb" })
    const [visualPath, setVisualPath] = React.useState<THREE.Vector3[]>([])

    return (
        <>
            <mesh {...props} visible={!props.hidden}
                onClick={(e) => {
                    if (navMesh) {
                        const { visualPoints, rawPath, smoothPath } = gotoTargetPath(e.point, playerVehicle, navMesh, obstacles, withEchoPath, obstacleAvoidance, followPathSteetingBehavior)!
                        setVisualPath(visualPoints)
                        setPathMetrics(PathMetrics.compare(rawPath, smoothPath))
                    }
                }}>
                <primitive object={scene} />
            </mesh>

            {visualPath.length > 0 && (
                <Line
                    points={visualPath}
                    color="#00f3ff"
                    lineWidth={3}
                    transparent
                    opacity={0.8}
                />
            )}
        </>
    )
}

export default Navmesh2