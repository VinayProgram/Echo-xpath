import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useNavmeshHelper } from './graph.helper'
import { useGame } from '../context/game-context'
import { useGameStore } from '../store/use-game-store'
import { Line, Ring } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import EchoPath from '../utils/echopath-smooth'
import PathMetrics from '../utils/path-metrics'
import './ground-material'

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
  const [hasTarget, setHasTarget] = React.useState(false)
  const [visualPath, setVisualPath] = React.useState<THREE.Vector3[]>([])

  const isTransforming = useGameStore((state) => state.isTransforming);
  const ref = useRef<THREE.Mesh>(null)
  const groundMatRef = useRef<any>(null)
  const targetRingRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, segments)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])

  const { navigationMesh: navMesh, debugPoints } = useNavmeshHelper(geometry)
  React.useMemo(() => setDebugPoints(debugPoints), [debugPoints])

  // Animate shader time uniform + target ring
  useFrame((_, delta) => {
    if (groundMatRef.current) {
      groundMatRef.current.uTime += delta
    }
    if (targetRingRef.current && hasTarget) {
      targetRingRef.current.rotation.z += delta * 1.5
    }
  })

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
      {/* Ground Plane with Shader */}
      <mesh
        ref={ref}
        geometry={geometry}
        onClick={(e) => {
          if (navMesh && !isTransforming) {
            setTarget(e.point)
            setHasTarget(true)
            gotoTargetPath(e.point)
          }
        }}
      >
        {/* eslint-disable-next-line @typescript-eslint/ban-ts-comment */}
        <groundShaderMaterial
          ref={groundMatRef}
          transparent
          side={THREE.DoubleSide}
          depthWrite={false}
        />
      </mesh>

      {/* Target Marker */}
      {hasTarget && (
        <group position={[targetp.x, targetp.y + 0.05, targetp.z]}>
          {/* Outer rotating ring */}
          <Ring
            ref={targetRingRef}
            args={[0.6, 0.75, 6]}
            rotation={[-Math.PI / 2, 0, 0]}
          >
            <meshBasicMaterial color="#ff3366" transparent opacity={0.6} side={THREE.DoubleSide} />
          </Ring>
          {/* Inner dot */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.15, 16]} />
            <meshBasicMaterial color="#ff3366" transparent opacity={0.9} />
          </mesh>
          {/* Glow disc */}
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[1.2, 32]} />
            <meshBasicMaterial color="#ff3366" transparent opacity={0.05} side={THREE.DoubleSide} />
          </mesh>
        </group>
      )}

      {/* {debugPoints && <primitive object={debugPoints} />} */}

      {/* Path Visualization */}
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
