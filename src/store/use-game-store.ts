import { create } from 'zustand'
import * as THREE from 'three'

export interface PathMetrics {
    raw: Raw
    smooth: Smooth
    improvement: Improvement
}

export interface Raw {
    points: number
    length: number
    curvature: number
    jerk: number
}

export interface Smooth {
    points: number
    length: number
    curvature: number
    jerk: number
}

export interface Improvement {
    curvatureReduction: string
    jerkReduction: string
    densityIncrease: string
}

export interface VehicleConfig {
    maxSpeed: number
    maxForce: number
    mass: number
}

interface GameState {
    isTransforming: boolean
    setIsTransforming: (value: boolean) => void
    cameraMode: 'orbit' | 'firstPerson'
    setCameraMode: (mode: 'orbit' | 'firstPerson') => void
    debugPoints: THREE.Points | null
    setDebugPoints: (value: THREE.Points | null) => void
    pathMetrics: PathMetrics | null
    setPathMetrics: (value: PathMetrics | null) => void
    followPathSteetingBehavior: number
    setFollowPathSteetingBehavior: (value: number) => void
    withEchoPath: boolean
    setWithEchoPath: (value: boolean) => void
    obstacleAvoidance: boolean
    setObstacleAvoidance: (value: boolean) => void
    vehicleConfig: VehicleConfig
    setVehicleConfig: (value: VehicleConfig) => void
    showTransformUI: boolean
    setShowTransformUI: (value: boolean) => void
    showPathMetricsUI: boolean
    setShowPathMetricsUI: (value: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
    obstacleAvoidance: false,
    setObstacleAvoidance: (value) => set({ obstacleAvoidance: value }),
    isTransforming: false,
    setIsTransforming: (value) => set({ isTransforming: value }),
    cameraMode: 'orbit',
    setCameraMode: (mode) => set({ cameraMode: mode }),
    debugPoints: null,
    setDebugPoints: (value) => set({ debugPoints: value }),
    pathMetrics: null,
    setPathMetrics: (value) => set({ pathMetrics: value }),
    withEchoPath: false,
    setWithEchoPath: (value) => set({ withEchoPath: value }),
    followPathSteetingBehavior: 1,
    setFollowPathSteetingBehavior: (value) => set({ followPathSteetingBehavior: value }),
    vehicleConfig: {
        maxSpeed: 10,
        maxForce: 1,
        mass: 1
    },
    setVehicleConfig: (value) => set({ vehicleConfig: value }),
    showTransformUI: true,
    setShowTransformUI: (value) => set({ showTransformUI: value }),
    showPathMetricsUI: true,
    setShowPathMetricsUI: (value) => set({ showPathMetricsUI: value }),
}))
