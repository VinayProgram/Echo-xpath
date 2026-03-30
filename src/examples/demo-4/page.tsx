import { Canvas } from '@react-three/fiber'
import { KeyboardControls, OrbitControls, type KeyboardControlsEntry } from '@react-three/drei'
import TransformUI from '../../common/ui/transform-ui'
import PathMetricsUI from '../../common/ui/path-metrics-ui'
import Navbar from '../../components/Navbar'
import { Maze } from './navmesh'
import Actor from '@/common/3d-components/actor/actor'
import Enemy from './enemy'
import { useMemo } from 'react'
import Player from './player'
import { ControlsType } from './maze'


function Demo4() {

    const map = useMemo<KeyboardControlsEntry<ControlsType>[]>(() => [
        { name: ControlsType.forward, keys: ['ArrowUp', 'KeyW'] },
        { name: ControlsType.back, keys: ['ArrowDown', 'KeyS'] },
        { name: ControlsType.left, keys: ['ArrowLeft', 'KeyA'] },
        { name: ControlsType.right, keys: ['ArrowRight', 'KeyD'] },
        { name: ControlsType.jump, keys: ['Space'] },
    ], [])
    return (
        <div >
            <KeyboardControls map={map}>
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
                        <OrbitControls />
                        <Maze />
                        <Player />
                        <Enemy />
                    </Canvas>
                </main>
            </KeyboardControls>
        </div>
    )
}

export default Demo4

