import React, { useMemo, useRef } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useNavmeshHelper } from './graph.helper'
import { useGame } from '../context/game-context'

const Navmesh = () => {
  const width = 10
  const height = 10
  const segments = 30
    const { playerVehicle ,obstacles} = useGame()
    const ref = useRef<THREE.Mesh>(null)

    const geometry = useMemo(() => {
        const geo = new THREE.PlaneGeometry(width, height, segments, segments)
        geo.rotateX(-Math.PI / 2)
        
        return geo
    }, [])

    const { navigationMesh: navMesh, debugPoints } = useNavmeshHelper(geometry)

    const gotoTargetPath = (target: THREE.Vector3) => {
        if (!navMesh) return
        console.log(obstacles)
        // Use playerVehicle's current position as the start of pathfinding
        const start = playerVehicle.position
        const end = new YUKA.Vector3(target.x, target.y, target.z)

        const pathPoints = navMesh.findPath(start, end)
        
        if (!pathPoints || pathPoints.length === 0) return
        
        console.log('Path found:', pathPoints)
        console.log(obstacles[0].boundingRadius)
        
        const path = new YUKA.Path()
        for (const point of pathPoints) {
            path.add(new YUKA.Vector3(point.x, point.y, point.z))
        }

        // Clear existing steering behaviors and add new follow path behavior
        playerVehicle.steering.clear()
        playerVehicle.steering.add(new YUKA.ObstacleAvoidanceBehavior(obstacles))
        playerVehicle.steering.add(new YUKA.FollowPathBehavior(path, 0.5))
        // playerVehicle.steering.add(new YUKA.ArriveBehavior(end, 0.5))
    }
  return (
    <>
    <mesh
      ref={ref}
      geometry={geometry}
      onClick={(e) => {
        if (navMesh) {
            gotoTargetPath(e.point)
          const region = navMesh.getRegionForPoint(
            new YUKA.Vector3(e.point.x, e.point.y, e.point.z)
          )
          console.log('NavMesh Region:', region)
        }
      }}
    >
      <meshStandardMaterial
        color="green"
        wireframe
        side={THREE.DoubleSide}
        transparent
        opacity={0.3}
      />
    </mesh>
    {debugPoints && <primitive object={debugPoints} />}
    </>
  )
}

export default Navmesh