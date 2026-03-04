import EchoPath from "@/utils/echopath-smooth"
import * as YUKA from "yuka"
import * as THREE from 'three'


export const gotoTargetPath = (target: THREE.Vector3,
    playerVehicle: YUKA.Vehicle,
    navMesh: YUKA.NavMesh, obstacles: {
        entity: YUKA.GameEntity;
        mesh: THREE.Object3D;
    }[], withEchoPath: boolean, obstacleAvoidance: boolean, followPathSteetingBehavior: number) => {
    if (!navMesh) return console.log('no neavm')
    const start = playerVehicle.position
    const end = new YUKA.Vector3(target.x, target.y, target.z)

    const pathPoints = navMesh.findPath(start, end)
    if (!pathPoints || pathPoints.length === 0) return console.log('no path')

    const { path, pointsArray } = withEchoPathHelper(pathPoints, withEchoPath)

    const visualPoints = pointsArray.map(p => new THREE.Vector3(p[0], p[1] + 0.1, p[2]))

    const rawPathPointsArray = pathPoints.map(p => [p.x, p.y, p.z])

    playerVehicle.steering.clear()
    if (obstacleAvoidance) {
        playerVehicle.steering.add(new YUKA.ObstacleAvoidanceBehavior(obstacles.map(x => x.entity)))
    }
    playerVehicle.steering.add(new YUKA.FollowPathBehavior(path, followPathSteetingBehavior))
    playerVehicle.steering.add(new YUKA.ArriveBehavior(end, 0.5))
    return { visualPoints, rawPathPointsArray }
}

export const withEchoPathHelper = (pathPoints: YUKA.Vector3[], withEchoPath: boolean) => {
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