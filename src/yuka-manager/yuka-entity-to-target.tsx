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

    const { path, rawPath, smoothPath, pointsToUse } = withEchoPathHelper(pathPoints, withEchoPath)

    const visualPoints = pointsToUse.map(p => new THREE.Vector3(p[0], p[1] + 0.1, p[2]))

    playerVehicle.steering.clear()
    if (obstacleAvoidance) {
        playerVehicle.steering.add(new YUKA.ObstacleAvoidanceBehavior(obstacles.map(x => x.entity)))
    }
    playerVehicle.steering.add(new YUKA.FollowPathBehavior(path, followPathSteetingBehavior))
    playerVehicle.steering.add(new YUKA.ArriveBehavior(end, 0.5))
    return { visualPoints, rawPath, smoothPath, pointsToUse }
}

export const withEchoPathHelper = (pathPoints: YUKA.Vector3[], withEchoPath: boolean) => {
    const path = new YUKA.Path()

    const rawPath: number[][] = pathPoints.map(p => [p.x, p.y, p.z])

    // Always compute smooth path
    const smoothPath: number[][] = EchoPath.smooth(rawPath)

    const pointsToUse = withEchoPath ? smoothPath : rawPath

    pointsToUse.forEach((p) => {
        path.add(new YUKA.Vector3(p[0], p[1], p[2]))
    })

    return {
        path,
        rawPath,
        smoothPath,
        pointsToUse
    }
}