import { useMemo, useRef } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useNavmeshHelper } from './graph.helper'
import { useGame } from '../context/game-context'
import { useGameStore } from '../store/use-game-store'


const Navmesh = () => {
  const width = 30
  const height = 30
  const segments = 100
  const { playerVehicle, obstacles } = useGame()
  const isTransforming = useGameStore((state) => state.isTransforming);
  const ref = useRef<THREE.Mesh>(null)
  const geometry = useMemo(() => {
    const geo = new THREE.PlaneGeometry(width, height, segments, segments)
    geo.rotateX(-Math.PI / 2)
    return geo
  }, [])


  const { navigationMesh: navMesh } = useNavmeshHelper(geometry)


  const gotoTargetPath = (target: THREE.Vector3) => {
    if (!navMesh) return
    console.log(obstacles)
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
    // playerVehicle.steering.add(new YUKA.ArriveBehavior(end, 0.5))


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
          color="Grey"
          side={THREE.DoubleSide}
        />
      </mesh>
      {/* {debugPoints && <primitive object={debugPoints} />} */}


    </>
  )
}


export default Navmesh

