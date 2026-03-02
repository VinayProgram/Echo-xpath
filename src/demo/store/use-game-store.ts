import { create } from 'zustand'
import * as THREE from 'three'

interface GameState {
    isTransforming: boolean
    setIsTransforming: (value: boolean) => void
    cameraMode: 'orbit' | 'firstPerson'
    setCameraMode: (mode: 'orbit' | 'firstPerson') => void
    debugPoints: THREE.Points | null
    setDebugPoints: (value: THREE.Points | null) => void
}

export const useGameStore = create<GameState>((set) => ({
    isTransforming: false,
    setIsTransforming: (value) => set({ isTransforming: value }),
    cameraMode: 'orbit',
    setCameraMode: (mode) => set({ cameraMode: mode }),
    debugPoints: null,
    setDebugPoints: (value) => set({ debugPoints: value }),
}))
