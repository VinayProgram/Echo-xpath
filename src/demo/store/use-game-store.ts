import { create } from 'zustand'

interface GameState {
    isTransforming: boolean
    setIsTransforming: (value: boolean) => void
}

export const useGameStore = create<GameState>((set) => ({
    isTransforming: false,
    setIsTransforming: (value) => set({ isTransforming: value }),
}))
