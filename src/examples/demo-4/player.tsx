import { Box, useKeyboardControls } from '@react-three/drei'
import React from 'react'
import * as THREE from 'three'
import { useFrame } from '@react-three/fiber'
import { ControlsType } from './maze'

const Player = () => {
    const playerRef = React.useRef<THREE.Mesh>(null!)
    const [sub, get] = useKeyboardControls<ControlsType>()

    useFrame(() => {
        if (playerRef.current) {
            const controls = get()
            if (controls.forward) {
                playerRef.current.position.x += 0.01
            }
            if (controls.back) {
                playerRef.current.position.x -= 0.01
            }
            if (controls.left) {
                playerRef.current.position.z += 0.01
            }
            if (controls.right) {
                playerRef.current.position.z -= 0.01
            }
            if (controls.jump) {
                playerRef.current.position.y += 0.01
            }
        }
    })
    return (
        <Box position={[1, 1, 1]} scale={0.60} ref={playerRef}>
            <meshBasicMaterial color={"green"} />
        </Box>
    )
}

export default Player