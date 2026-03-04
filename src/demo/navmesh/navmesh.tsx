import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useNavmeshHelper } from './graph.helper'
import { useGame } from '../context/game-context'
import { useGameStore } from '../store/use-game-store'
import { useTexture, Line } from '@react-three/drei'
import EchoPath from '../utils/echopath-smooth'
import PathMetrics from '../utils/path-metrics'
const Navmesh = () => {
  const width = 50
  const height = 50
  const segments = 100
  const { playerVehicle, obstacles } = useGame()
  const setDebugPoints = useGameStore((state) => state.setDebugPoints)
  const setPathMetrics = useGameStore((state) => state.setPathMetrics)
  const followPathSteetingBehavior = useGameStore((state) => state.followPathSteetingBehavior)
  const { obstacleAvoidance, withEchoPath } = useGameStore()
  const [targetp, setTarget] = React.useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const [visualPath, setVisualPath] = React.useState<THREE.Vector3[]>([])
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
    const start = playerVehicle.position
    const end = new YUKA.Vector3(target.x, target.y, target.z)

    const pathPoints = navMesh.findPath(start, end)
    if (!pathPoints || pathPoints.length === 0) return

    const { path, pointsArray } = withEchoPathHelper(pathPoints, withEchoPath)

    const visualPoints = pointsArray.map(p => new THREE.Vector3(p[0], p[1] + 0.1, p[2]))
    setVisualPath(visualPoints)

    const rawPathPointsArray = pathPoints.map(p => [p.x, p.y, p.z])
    setPathMetrics(PathMetrics.compare(rawPathPointsArray, pointsArray))

    playerVehicle.steering.clear()
    if (obstacleAvoidance) {
      playerVehicle.steering.add(new YUKA.ObstacleAvoidanceBehavior(obstacles.map(x => x.entity)))
    }
    playerVehicle.steering.add(new YUKA.FollowPathBehavior(path, followPathSteetingBehavior))
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
          // color={"black"}
          map={texture}
          opacity={1}
          transparent
          side={THREE.DoubleSide}
        />
      </mesh>

      <mesh position={targetp}>
        <sphereGeometry args={[0.5, 16, 16]} />
        <meshBasicMaterial color="red" />
      </mesh>

      {/* {debugPoints && <primitive object={debugPoints} />} */}
      {visualPath.length > 0 && (
        <Line
          points={visualPath}
          color="#00f3ff"
          lineWidth={3}
          transparent
          opacity={0.7}
          //@ts-ignore
          attenuation={true}
        />
      )}


    </>
  )
}


const withEchoPathHelper = (pathPoints: YUKA.Vector3[], withEchoPath: boolean) => {
  const path = new YUKA.Path()
  let pointsArray: number[][] = []

  if (withEchoPath) {
    pointsArray = EchoPath.smooth(pathPoints.map(p => [p.x, p.y, p.z]))
    pointsArray.forEach((p) => {
      path.add(new YUKA.Vector3(p[0], p[1], p[2]))
    })
  } else {
    pointsArray = pathPoints.map(p => [p.x, p.y, p.z])
    pathPoints.forEach(p => {
      path.add(p)
    })
  }

  return { path, pointsArray }
}
export default Navmesh
