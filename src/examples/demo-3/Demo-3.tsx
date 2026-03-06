import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import TransformUI from '../../common/ui/transform-ui'
import PathMetricsUI from '../../common/ui/path-metrics-ui'
import Navbar from '../../components/Navbar'
import FlightLauncher from './flight-launcher'
import Obstacle from './obstacle'

function Demo3() {
    return (
        <div >
            <Navbar />
            <TransformUI />
            <PathMetricsUI />
            <main className=" w-screen h-screen pt-16 bg-black">
                <Canvas
                    className="w-full h-full"
                    style={{ backgroundColor: 'black' }}
                    camera={{ position: [0, 60, 80], fov: 60, near: 0.1, far: 2000 }}
                >
                    <ambientLight intensity={1} />
                    <pointLight position={[10, 10, 10]} />
                    <FlightLauncher />
                    <OrbitControls />
                    <Obstacle />

                </Canvas>
            </main>
        </div>
    )
}

export default Demo3

