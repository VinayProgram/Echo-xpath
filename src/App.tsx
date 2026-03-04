import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Navmesh from './demo/navmesh/navmesh'
import { GameProvider } from './demo/context/game-context'
import Actor from './demo/actor/actor'
import RockObstacle from './demo/obstacles/rock'
import TransformUI from './demo/ui/transform-ui'
import PathMetricsUI from './demo/ui/path-metrics-ui'
import Navbar from './components/Navbar'
import TransformController from './demo/transform-controller/transform-controller'

function App() {

  return (
    <GameProvider>
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
            <Actor />
            <RockObstacle />
            <OrbitControls
              makeDefault
              enableRotate={true}
            />
            <Navmesh />
            <TransformController />
          </Canvas>
        </main>
      </div>
    </GameProvider>
  )
}

export default App

