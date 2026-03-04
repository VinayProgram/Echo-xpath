import { KeyboardControls, OrbitControls } from '@react-three/drei'
import { Canvas, useLoader, type ThreeEvent } from '@react-three/fiber'
import { GLTFLoader } from 'three/examples/jsm/Addons.js'
import { Suspense } from 'react'
import * as THREE from 'three'
import Navmesh2 from './navmesh/navmesh'
import TransformUI from '@/common/ui/transform-ui'
import PathMetricsUI from '@/common/ui/path-metrics-ui'
import Navbar from '@/components/Navbar'
import { Loader } from '@/common/ui/loader'
import Actor from '../../common/3d-components/actor/actor'

const Demo2 = () => {
  return (
    <>
      <Navbar />
      <TransformUI />
      <PathMetricsUI />
      <KeyboardControls map={[
        { name: "forward", keys: ["w", "ArrowUp"] },
        { name: "backward", keys: ["s", "ArrowDown"] },
        { name: "left", keys: ["a", "ArrowLeft"] },
        { name: "right", keys: ["d", "ArrowRight"] },
        { name: "space", keys: ["space", " "] },
      ]}>
        <Canvas style={{ width: "100vw", height: "100vh" }} camera={{ position: [0, 40, 0], fov: 60, near: 0.1, far: 200 }}
        >
          <OrbitControls />
          <hemisphereLight intensity={1} color={"#f3e7d3"} />
          <ambientLight intensity={1} />
          <ambientLight intensity={1} color={"#f3e7d3"} />


          <Suspense fallback={<Loader label="Player" />}>
            <Actor modelPath='/robo_kawaii_last.glb' scale={2} rotation={[0, 0, 0]} />
          </Suspense>

          <Suspense fallback={<Loader label="Navmesh" />}>
            <Navmesh2 url="/navmesh.glb" position={new THREE.Vector3(-1.3, 0, 0)} />
          </Suspense>

          <Suspense fallback={<Loader label="Scene" />}>
            <ModelLoader url="/base_model.glb" position={new THREE.Vector3(-1.3, 0, 0)} />
          </Suspense>

        </Canvas>
      </KeyboardControls>
    </>
  )
}

const ModelLoader = (props: { url: string, position?: THREE.Vector3, hidden?: boolean, onClick?: (e: ThreeEvent<MouseEvent>) => void }) => {
  const { scene } = useLoader(GLTFLoader, props.url)
  return (
    <mesh {...props} visible={!props.hidden}>
      <primitive object={scene} />
    </mesh>
  )
}

export default Demo2


