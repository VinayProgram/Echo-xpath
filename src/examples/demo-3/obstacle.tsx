import EchoPath from '@/utils/echopath-smooth'
import { Line } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import React, { useMemo, useRef, useState } from 'react'
import * as THREE from 'three'

const MovingCone = ({ points }: { points: number[][] }) => {
    const meshRef = useRef<THREE.Mesh>(null)
    const [currentIndex, setCurrentIndex] = useState(0)

    const pathVectors = useMemo(() => points.map(p => new THREE.Vector3(...p)), [points])

    useFrame((state, delta) => {
        if (!meshRef.current || pathVectors.length < 2) return

        const speed = 10
        const targetPoint = pathVectors[currentIndex]
        const currentPos = meshRef.current.position

        // Move towards target
        const direction = new THREE.Vector3().subVectors(targetPoint, currentPos)
        const distance = direction.length()

        if (distance < 0.5) {
            // Move to next point
            setCurrentIndex((prev) => (prev + 1) % pathVectors.length)
        } else {
            direction.normalize()
            currentPos.add(direction.multiplyScalar(speed * delta))

            // Orient cone
            meshRef.current.lookAt(targetPoint)
            meshRef.current.rotateX(Math.PI / 2) // Orient cone tip forward
        }
    })

    return (
        <mesh ref={meshRef} position={[0, 0, 0]}>
            <coneGeometry args={[1, 4, 16]} />
            <meshStandardMaterial color="yellow" emissive="yellow" emissiveIntensity={0.5} />
        </mesh>
    )
}

const Obstacle = () => {
    const randomObstacles = useMemo(() => Array.from({ length: 100 }, () => {
        const x = (Math.random()) * 100
        const y = (Math.random()) * 100
        const z = (Math.random()) * 100
        return new THREE.Vector3(x, y, z)
    }), [])

    const farthestPoint = useMemo(() => randomObstacles.reduce((prev, current) => {
        return prev.lengthSq() > current.lengthSq() ? prev : current
    }), [randomObstacles])

    const echoPath = useMemo(() => {
        return EchoPath.smooth([[0, 0, 0], [farthestPoint.x, farthestPoint.y, farthestPoint.z]], {
            obstacles: randomObstacles.map((obstacle) => ({
                pos: [obstacle.x, obstacle.y, obstacle.z],
                radius: 200
            })),
            quality: 'high',
            smooth3d: true,
        })
    }, [farthestPoint, randomObstacles])

    return (
        <>
            {randomObstacles.map((obstacle, index) => (
                <mesh key={index} position={obstacle}>
                    <sphereGeometry args={[5, 16, 16]} />
                    <meshStandardMaterial
                        color={obstacle === farthestPoint ? "red" : "white"}


                    />
                </mesh>
            ))}
            <Line points={echoPath.map((point) => [point[0], point[1], point[2]])} color="blue" lineWidth={2} />
            <MovingCone points={echoPath} />
        </>
    )
}

export default Obstacle
