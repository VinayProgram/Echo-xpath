import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Navmesh from './navmesh/navmesh'
import Actor from '../../common/3d-components/actor/actor'
import RockObstacle from './obstacles/rock'
import TransformUI from '../../common/ui/transform-ui'
import PathMetricsUI from '../../common/ui/path-metrics-ui'
import Navbar from '../../components/Navbar'
import TransformController from './transform-controller/transform-controller'
import { Loader } from '../../common/ui/loader'
import { Suspense } from 'react'

function Demo() {

  return (
    <div className="dark relative w-screen h-screen overflow-hidden text-foreground bg-background">
      <Navbar />
      <TransformUI />
      <PathMetricsUI />
      <main className="w-full h-full pt-16">
        <Canvas
          style={{ backgroundColor: 'black' }}
          className="w-full h-full"
          camera={{ position: [0, 40, 0], fov: 60, near: 0.1, far: 200 }}
        >
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />
          {/* <directionalLight position={[1, 1, 1]} /> */}
          <Suspense fallback={<Loader label="loading game" />}>
            <Actor />
            <RockObstacle />
          </Suspense>
          <OrbitControls
            makeDefault
            enableRotate={true}
          />
          <Navmesh />
          <TransformController />
        </Canvas>
      </main>
    </div>
  )
}

export default Demo

