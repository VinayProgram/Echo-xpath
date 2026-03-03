import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Navmesh from './demo/navmesh/navmesh'
import { GameProvider } from './demo/context/game-context'
import Actor from './demo/actor/actor'
import RockObstacle from './demo/obstacles/rock'
import TransformController from './demo/transform-controller.tsx/transform-controller'
import { useGameStore } from './demo/store/use-game-store'
import TransformUI from './demo/ui/transform-ui'
import PathMetricsUI from './demo/ui/path-metrics-ui'

function App() {
  const isTransforming = useGameStore((state) => state.isTransforming);
  const cameraMode = useGameStore((state) => state.cameraMode);

  return (
    <GameProvider>
      <div style={{ width: "100vw", height: "100vh", position: 'relative' }}>
        <TransformUI />
        <PathMetricsUI />
        <Canvas style={{ backgroundColor: 'black' }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />
          {/* <Environment
            files="/sky.hdr"
            background
            ground={{ height: 5000, radius: 4000, scale: 20000 }}
          /> */}
          {/* <directionalLight position={[1, 1, 1]} /> */}
          <Actor />
          <RockObstacle />
          <OrbitControls enabled={!isTransforming && cameraMode === 'orbit'} />
          <Navmesh />
          <TransformController />
        </Canvas>

      </div>
    </GameProvider>
  )
}

export default App
