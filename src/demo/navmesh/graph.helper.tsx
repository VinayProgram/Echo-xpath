import React from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'

export const useNavmeshHelper = (geo: THREE.PlaneGeometry | null) => {

    const [navigationMesh, setNavigationMesh] = React.useState<YUKA.NavMesh | null>(null)
    const [debugPoints, setDebugPoints] = React.useState<THREE.Points | null>(null)

    React.useEffect(() => {

        if (!geo) return
        const positions = geo.attributes.position
        const indices = geo.index
        const polygons: YUKA.Polygon[] = []

        const debugVertices: number[] = []

        if (indices) {
            for (let i = 0; i < indices.count; i += 3) {

                const vertices: YUKA.Vector3[] = []

                for (let j = 0; j < 3; j++) {

                    const vertexIndex = indices.getX(i + j)

                    const x = positions.getX(vertexIndex)
                    const y = positions.getY(vertexIndex)
                    const z = positions.getZ(vertexIndex)

                    vertices.push(new YUKA.Vector3(x, y, z))

                    // Collect for debug rendering
                    debugVertices.push(x, y, z)
                }

                const polygon = new YUKA.Polygon()
                polygon.fromContour(vertices)
                polygons.push(polygon)
            }
        }

        const navMesh = new YUKA.NavMesh()
        navMesh.mergeConvexRegions = false
        navMesh.fromPolygons(polygons)
        navMesh.updateSpatialIndex()
        // 🔥 Create THREE.Points helper
        const debugGeometry = new THREE.BufferGeometry()
        debugGeometry.setAttribute(
            'position',
            new THREE.Float32BufferAttribute(debugVertices, 3)
        )

        const debugMaterial = new THREE.PointsMaterial({
            color: 'red',
            size: 0.1
        })

        const points = new THREE.Points(debugGeometry, debugMaterial)

        setNavigationMesh(navMesh)
        setDebugPoints(points)

    }, [geo])

    return { navigationMesh, debugPoints }
}