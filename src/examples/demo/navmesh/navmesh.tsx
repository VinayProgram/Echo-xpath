import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import { useGameStore } from '../../../store/use-game-store'
import { Line, Ring } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import PathMetrics from '../../../utils/path-metrics'
import './ground-material'
import { useYuka } from '@/yuka-manager/yuka-context'
import { gotoTargetPath } from '@/yuka-manager/yuka-entity-to-target'
import { useNavmeshHelper } from '@/yuka-manager/yuka-navmesh-helper-hook'

const Navmesh = () => {
  const width = 50
  const height = 50
  const segments = 100
  const { playerVehicle, obstacles } = useYuka()
  const setDebugPoints = useGameStore((state) => state.setDebugPoints)
  const setPathMetrics = useGameStore((state) => state.setPathMetrics)
  const followPathSteetingBehavior = useGameStore((state) => state.followPathSteetingBehavior)
  const { obstacleAvoidance, withEchoPath, showBothPaths } = useGameStore()
  const [targetp, setTarget] = React.useState<THREE.Vector3>(new THREE.Vector3(0, 0, 0))
  const [hasTarget, setHasTarget] = React.useState(false)
  const [visualPath, setVisualPath] = React.useState<{
    smoothVP: THREE.Vector3[],
    rawVP: THREE.Vector3[],
    actualVP: THREE.Vector3[]
  }>({ smoothVP: [], rawVP: [], actualVP: [] })

  const isTransforming = useGameStore((state) => state.isTransforming);
  const ref = useRef<THREE.Mesh>(null)
  const groundMatRef = useRef<any>(null)
  const targetRingRef = useRef<THREE.Mesh>(null)

  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, segments)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])

  const { navigationMesh: navMesh, debugPoints } = useNavmeshHelper({ geo: geometry })
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
            const { rawvisualPoints, smoothvisualPoints, rawPath, smoothPath, actualVisualPath } = gotoTargetPath(e.point, playerVehicle, navMesh, obstacles, withEchoPath, obstacleAvoidance, followPathSteetingBehavior)!
            setVisualPath({
              rawVP: rawvisualPoints,
              smoothVP: smoothvisualPoints,
              actualVP: actualVisualPath
            })
            setPathMetrics(PathMetrics.compare(rawPath, smoothPath))
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
      {/* Path Visualization Compare Mode */}
      {visualPath.rawVP.length > 0 && showBothPaths && (
        <Line
          points={visualPath.rawVP}
          color="#ffffff"
          lineWidth={2}
          transparent
          opacity={0.3}
          dashed
          dashSize={0.5}
          gapSize={0.5}
        />
      )}

      {visualPath.smoothVP.length > 0 && showBothPaths && (
        <Line
          points={visualPath.smoothVP}
          color="#00f3ff"
          lineWidth={3}
          transparent
          opacity={0.9}
        />
      )}
    </>
  )
}



export default Navmesh
