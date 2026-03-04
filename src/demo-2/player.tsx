import { useFrame, useThree } from '@react-three/fiber'
import React, { useRef, useMemo } from 'react'
import * as THREE from 'three'
import * as YUKA from 'yuka'
import { useStoreContext } from './store'
import { useKeyboardControls, Line } from '@react-three/drei'
import EchoPath from '@/utils/echopath-smooth'

const FP = () => {
    const fpRef = useRef<THREE.Mesh>(null)
    const context = useStoreContext()
    const { target: targetPath, followCamera } = context!
    const navmesh = useNavmeshHelper()

    // Memoize YUKA instances so they persist across re-renders
    const { EntityManager, fp } = useMemo(() => {
        const em = new YUKA.EntityManager()
        const vehicle = new YUKA.Vehicle()
        em.add(vehicle)
        return { EntityManager: em, fp: vehicle }
    }, [])

    const [, get] = useKeyboardControls();

    // Link YUKA to Three.js mesh once
    React.useEffect(() => {
        if (fpRef.current) {
            fp.setRenderComponent(fpRef.current, (entity, renderComponent) => {
                //@ts-ignore
                renderComponent.matrix.copy(entity.worldMatrix)
            })
        }
    }, [fp])
    useFrame((state, delta) => {
        fpRef.current?.position.set(fp.position.x, fp.position.y, fp.position.z)
        if (followCamera) {
            const fpPosition = fpRef.current?.position.clone()
            if (fpPosition) {
                const cameraPos = fpPosition.clone().add(
                    new THREE.Vector3(0, 1.3, 0).applyEuler(fpRef.current!.rotation)
                )
                const forward = new THREE.Vector3(0, 0, -1)
                    .applyEuler(fpRef.current!.rotation)
                const target = cameraPos.clone().add(forward)
                state.camera.position.lerp(cameraPos, 0.1)
                state.camera.lookAt(target)
            }
        }
        const direction = new THREE.Vector3()
        state.camera.getWorldDirection(direction)
        direction.normalize()
        const { forward, backward, left, right, space } = get();
        const speed = 0.4
        if (forward) {
            fp.velocity.copy(new YUKA.Vector3(direction.x, direction.y, direction.z).multiplyScalar(speed))
        } else if (backward) {
            fp.velocity.copy(new YUKA.Vector3(direction.x, direction.y, direction.z).multiplyScalar(-speed))
        }
        if (space) fp.velocity.set(0, 0, 0)
        if (left) fpRef.current?.rotateY(0.05);
        if (right) fpRef.current?.rotateY(-0.05);
        EntityManager.update(delta)
    })

    React.useEffect(() => {
        gotoTargetPath()
    }, [targetPath])
    const [pathLine, setPathLine] = React.useState<THREE.Vector3[]>([])

    const gotoTargetPath = () => {
        if (!fpRef.current) return
        fp.position.copy(new YUKA.Vector3(fpRef.current.position.x, fpRef.current.position.y, fpRef.current.position.z))
        const targetPosition = targetPath
        const c = navmesh?.findPath(
            new YUKA.Vector3(fp.position.x, fp.position.y, fp.position.z),
            new YUKA.Vector3(targetPosition.x, targetPosition.y, targetPosition.z)
        )

        if (!c) return
        const smoothPath = EchoPath.smooth(c?.map(x => [x.x, x.y, x.z]))

        const path = new YUKA.Path()
        const pathsLines = []
        for (let i = 0; i < c.length; i++) {
            // const point = new YUKA.Vector3(smoothPath[i][0], smoothPath[i][1], smoothPath[i][2])
            const pointData = new YUKA.Vector3(c[i].x, c[i].y, c[i].z)
            path.add(pointData)
            // Offset Y slightly to avoid floor clipping
            pathsLines.push(new THREE.Vector3(c[i].x, c[i].y + 0.1, c[i].z))
        }

        // Clear previous behaviors before adding new one
        fp.steering.clear()
        fp.steering.add(new YUKA.FollowPathBehavior(path, 0.5))
        setPathLine(pathsLines)

    }

    return (
        <group>
            <mesh visible={true} ref={fpRef} name="fp" onClick={(e) => { console.log(e) }}>
                <boxGeometry args={[0.5, 0.5, 0.5]} />
                <meshStandardMaterial color="red" />
            </mesh>
            {/* <PointerLockControls /> */}

            {pathLine.length > 0 && (
                <Line
                    points={pathLine}
                    color="#00ffff"
                    lineWidth={3}
                    transparent
                    opacity={0.6}
                />
            )}
        </group>
    )
}

export default FP


const useNavmeshHelper = () => {
    const NavmeshLoader = new YUKA.NavMeshLoader()
    const { scene } = useThree()
    const [navigationMesh, setNavigationMesh] = React.useState<YUKA.NavMesh>()
    React.useEffect(() => {
        NavmeshLoader.load('../public/navmesh.glb').then(navigationMesh => {
            setNavigationMesh(navigationMesh)
        })
    }, [])
    return navigationMesh
}

