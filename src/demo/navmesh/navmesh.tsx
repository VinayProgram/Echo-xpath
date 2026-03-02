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
            gotoTargetPath(e.point)
          }
        }}
      >
        <meshStandardMaterial
          map={texture}
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* {debugPoints && <primitive object={debugPoints} />} */}


    </>
  )
}


export default Navmesh
