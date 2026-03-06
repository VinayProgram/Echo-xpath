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
    const { withEchoPath, obstacleAvoidance, followPathSteetingBehavior, setPathMetrics, showBothPaths } = useGameStore()
    const { navigationMesh: navMesh } = useNavmeshHelper({ geo: null, path: "/navmesh.glb" })
    const [visualPath, setVisualPath] = React.useState<{
        smoothVP: THREE.Vector3[],
        rawVP: THREE.Vector3[],
        actualVP: THREE.Vector3[]
    }>({ smoothVP: [], rawVP: [], actualVP: [] })


    return (
        <>
            <mesh {...props} visible={!props.hidden}
                onClick={(e) => {
                    if (navMesh) {
                        const { rawvisualPoints, smoothvisualPoints, rawPath, smoothPath, actualVisualPath } = gotoTargetPath(e.point, playerVehicle, navMesh, obstacles, withEchoPath, obstacleAvoidance, followPathSteetingBehavior)!
                        setVisualPath({ rawVP: rawvisualPoints, smoothVP: smoothvisualPoints, actualVP: actualVisualPath })
                        setPathMetrics(PathMetrics.compare(rawPath, smoothPath))
                    }
                }}>
                <primitive object={scene} />
            </mesh>

            {
                visualPath.actualVP.length > 0 && !showBothPaths && (
                    <Line
                        points={visualPath.actualVP}
                        color="#00f3ff"
                        lineWidth={3}
                        transparent
                        opacity={0.8}
                    />
                )
            }
            {visualPath.rawVP.length > 0 && showBothPaths && (
                <Line
                    points={visualPath.rawVP}
                    color="#00f3ff"
                    lineWidth={3}
                    transparent
                    opacity={0.8}
                />
            )}
            {visualPath.smoothVP.length > 0 && showBothPaths && (
                <Line
                    points={visualPath.smoothVP}
                    color="#ff0000ff"
                    lineWidth={3}
                    transparent
                    opacity={0.8}
                />
            )}

        </>
    )
}

export default Navmesh2