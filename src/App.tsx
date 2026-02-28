import './App.css'
import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import Navmesh from './demo/navmesh/navmesh'
import { GameProvider } from './demo/context/game-context'
import Actor from './demo/actor/actor'
import RockObstacle from './demo/obstacles/rock'

function App() {
  return (
    <GameProvider>
      <div style={{width:"100vw",height:"100vh"}}>
        <Canvas style={{backgroundColor:'black'}}>
          <ambientLight intensity={0.5} />
          <directionalLight position={[1, 1, 1]} />
          <Actor />
          <RockObstacle />
          <OrbitControls />
          <Navmesh />
        </Canvas>
      </div>
    </GameProvider>
  )
}

export default App
