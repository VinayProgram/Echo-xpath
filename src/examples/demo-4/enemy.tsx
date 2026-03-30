import { useYuka } from '@/yuka-manager/yuka-context'
import { Box } from '@react-three/drei'
import React from 'react'

const Enemy = () => {
    return (
        <Box position={[1, 1, 1]} scale={0.60}>
            <meshBasicMaterial color={"black"} />
        </Box>
    )
}

export default Enemy