import * as YUKA from 'yuka'
import React from 'react'
import * as THREE from 'three'
export const useNavmeshHelperGLB = ({ path }: { path: string }) => {
    const NavmeshLoader = new YUKA.NavMeshLoader()
    const [navigationMesh, setNavigationMesh] = React.useState<YUKA.NavMesh>()
    React.useEffect(() => {
        NavmeshLoader.load(path).then(navigationMesh => {
            setNavigationMesh(navigationMesh)
        })
    }, [])
    return navigationMesh
}


export const useNavmeshGeom = (geo: THREE.PlaneGeometry | null) => {

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

// path has NO default here — callers must pass undefined (use GLB) or null (skip GLB)
export const useNavmeshHelper = ({
    geo,
    path,
    positions,
}: {
    geo: THREE.PlaneGeometry | null
    path?: string | null
    positions?: number[][]
}) => {
    if (geo) {
        const { navigationMesh } = useNavmeshGeom(geo)
        const { debugPoints } = useNavmeshGeom(geo)
        return { navigationMesh, debugPoints }
    } else if (path) {
        const navigationMesh = useNavmeshHelperGLB({ path })
        return { navigationMesh, debugPoints: null }
    } else {
        const { navigationMesh, debugPoints } = useNavmeshHelperFromGrid({
            positions: positions ?? [],
        })
        return { navigationMesh, debugPoints }
    }
}

export const useNavmeshHelperFromGrid = ({ positions }: { positions: number[][] }) => {
    const [navigationMesh, setNavigationMesh] = React.useState<YUKA.NavMesh | null>(null)
    const [debugPoints, setDebugPoints] = React.useState<THREE.LineSegments | null>(null)

    React.useEffect(() => {
        if (!positions || positions.length === 0) return

        const { navMesh, debugMesh } = buildNavMeshFromGrid(positions)
        setNavigationMesh(navMesh)
        setDebugPoints(debugMesh)
    }, [positions])

    return { navigationMesh, debugPoints }
}

const buildNavMeshFromGrid = (positions: number[][]) => {
    const navMesh = new YUKA.NavMesh()
    const half = 0.5
    const snap = (v: number) => Math.round(v * 10000) / 10000

    // Deduplicate cells
    const seen = new Set<string>()
    const uniquePositions = positions.filter(([x, _y, z]) => {
        const key = `${snap(x)},${snap(z)}`
        if (seen.has(key)) return false
        seen.add(key)
        return true
    })

    const debugVertices: number[] = []

    const polygons = uniquePositions.map(([x, _y, z]) => {
        const polygon = new YUKA.Polygon()

        // Full 1×1 quad — MUST touch neighbours for findPath() to work
        const bl: [number, number, number] = [snap(x - half), 0, snap(z - half)]
        const tl: [number, number, number] = [snap(x - half), 0, snap(z + half)]
        const tr: [number, number, number] = [snap(x + half), 0, snap(z + half)]
        const br: [number, number, number] = [snap(x + half), 0, snap(z - half)]

        polygon.fromContour([
            new YUKA.Vector3(...bl),
            new YUKA.Vector3(...tl),
            new YUKA.Vector3(...tr),
            new YUKA.Vector3(...br),
        ])

        // Debug outline — raised slightly so it's visible above the floor
        const Y = 0.02
        debugVertices.push(
            bl[0], Y, bl[2], tl[0], Y, tl[2],
            tl[0], Y, tl[2], tr[0], Y, tr[2],
            tr[0], Y, tr[2], br[0], Y, br[2],
            br[0], Y, br[2], bl[0], Y, bl[2],
        )

        return polygon
    })

    console.log('[NavMesh] building with', polygons.length, 'polygons')
    navMesh.fromPolygons(polygons)
    navMesh.updateSpatialIndex()
    console.log('[NavMesh] graph nodes:', navMesh.graph.getNodeCount())

    // LineSegments renders pairs of vertices as line segments (pairs: bl-tl, tl-tr, etc.)
    const debugGeo = new THREE.BufferGeometry()
    debugGeo.setAttribute('position', new THREE.Float32BufferAttribute(debugVertices, 3))
    const debugMesh = new THREE.LineSegments(
        debugGeo,
        new THREE.LineBasicMaterial({ color: '#00ffcc', linewidth: 1 })
    )

    return { navMesh, debugMesh }
}