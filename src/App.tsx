import './App.css'
import { Canvas } from '@react-three/fiber'
import { Environment, OrbitControls } from '@react-three/drei'
import Navmesh from './demo/navmesh/navmesh'
import { GameProvider } from './demo/context/game-context'
import Actor from './demo/actor/actor'
import RockObstacle from './demo/obstacles/rock'
import TransformController from './demo/transform-controller.tsx/transform-controller'
import { useGameStore } from './demo/store/use-game-store'
import TransformUI from './demo/ui/transform-ui'

function App() {
  const isTransforming = useGameStore((state) => state.isTransforming);

  return (
    <GameProvider>
      <div style={{ width: "100vw", height: "100vh", position: 'relative' }}>
        <TransformUI />
        <Canvas style={{ backgroundColor: 'black' }}>
          <ambientLight intensity={1} />
          <pointLight position={[10, 10, 10]} />
          {/* <Environment
            preset=''
            ground={{ height: 5, radius: 40, scale: 200 }}
          /> */}
          <directionalLight position={[1, 1, 1]} />
          <Actor />
          <RockObstacle />
          <OrbitControls enabled={!isTransforming} />
          <Navmesh />
          <TransformController />
        </Canvas>
      </div>
    </GameProvider>
  )
}

export default App
