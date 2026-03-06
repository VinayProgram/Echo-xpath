import React from 'react'

const FlightLauncher = () => {
    return (
        <>
            <mesh position={[0, 0, 0]} rotation={[0, Math.PI / 2, 0]}>
                <boxGeometry args={[5, 0.5, 15]} />
                <meshBasicMaterial color="red" />
            </mesh>
        </>
    )
}

export default FlightLauncher