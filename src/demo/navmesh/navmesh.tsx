import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useNavmeshHelper } from './graph.helper'
import { useGame } from '../context/game-context'
import { useGameStore } from '../store/use-game-store'
import { useTexture } from '@react-three/drei'


const Navmesh = () => {
  const width = 50
  const height = 50
  const segments = 10
  const { playerVehicle, obstacles } = useGame()
  const setDebugPoints = useGameStore((state) => state.setDebugPoints)
  const setPathMetrics = useGameStore((state) => state.setPathMetrics)
  const [targetp, setTarget] = React.useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const texture = useTexture('/land.jpg')
  texture.wrapS = texture.wrapT = THREE.RepeatWrapping

  const isTransforming = useGameStore((state) => state.isTransforming);
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, segments)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])


  const { navigationMesh: navMesh, debugPoints } = useNavmeshHelper(geometry)
  React.useMemo(() => setDebugPoints(debugPoints), [debugPoints])

  const gotoTargetPath = (target: THREE.Vector3) => {
    if (!navMesh) return
    // Use playerVehicle's current position as the start of pathfinding
    const start = playerVehicle.position
    const end = new YUKA.Vector3(target.x, target.y, target.z)


    const pathPoints = navMesh.findPath(start, end)


    if (!pathPoints || pathPoints.length === 0) return


    const path = new YUKA.Path()


    for (const point of pathPoints) {
      path.add(new YUKA.Vector3(point.x, point.y, point.z))
    }

    // --- Compute path metrics ---
    const pts = pathPoints.map(p => new THREE.Vector3(p.x, p.y, p.z))

    // 1) Path Length
    let pathLength = 0
    const segLengths: number[] = []

    for (let i = 1; i < pts.length; i++) {
      pathLength += pts[i].distanceTo(pts[i - 1])
    }

    // 2) Mean Curvature — average turning angle at each interior waypoint
    let totalCurvature = 0
    for (let i = 1; i < pts.length; i++) {
    }

    const curvatures: number[] = []
    for (let i = 1; i < pts.length - 1; i++) {
      const v1 = new THREE.Vector3().subVectors(pts[i], pts[i - 1]).normalize()
      const v2 = new THREE.Vector3().subVectors(pts[i + 1], pts[i]).normalize()
      const dot = THREE.MathUtils.clamp(v1.dot(v2), -1, 1)
      const angle = Math.acos(dot) // radians
      const avgSegLen = (segLengths[i - 1] + segLengths[i]) / 2
      const kappa = avgSegLen > 0 ? angle / avgSegLen : 0
      curvatures.push(kappa)
      totalCurvature += kappa
    }
    const meanCurvature = curvatures.length > 0 ? totalCurvature / curvatures.length : 0

    // 3) Jerk Integral — proxy: sum of |Δcurvature| along the path
    let jerkIntegral = 0
    for (let i = 1; i < curvatures.length; i++) {
      jerkIntegral += Math.abs(curvatures[i] - curvatures[i - 1])
    }

    setPathMetrics({
      pathLength: parseFloat(pathLength.toFixed(2)),
      meanCurvature: parseFloat(meanCurvature.toFixed(4)),
      jerkIntegral: parseFloat(jerkIntegral.toFixed(4)),
    })

    // Clear existing steering behaviors and add new follow path behavior
    playerVehicle.steering.clear()
    playerVehicle.steering.add(new YUKA.ObstacleAvoidanceBehavior(obstacles.map(x => x.entity)))
    playerVehicle.steering.add(new YUKA.FollowPathBehavior(path, 0.5))
    playerVehicle.steering.add(new YUKA.ArriveBehavior(end, 0.5))


  }
  return (
    <>
      <mesh
        ref={ref}
        geometry={geometry}
        onClick={(e) => {
          if (navMesh && !isTransforming) {
            setTarget(e.point)
            gotoTargetPath(e.point)
          }
        }}
      >
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={targetp}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>

      {/* {debugPoints && <primitive object={debugPoints} />} */}


    </>
  )
}


export default Navmesh
