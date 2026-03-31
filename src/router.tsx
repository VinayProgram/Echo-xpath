import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import LandingPage from './components/LandingPage'
import App from './examples/demo/Demo'
import Demo2 from './examples/demo-2/Demo2'
import { Suspense, useMemo } from 'react'
import Demo3 from './examples/demo-3/Demo-3'
import Demo4 from './examples/demo-4/Demo'
import { KeyboardControls, type KeyboardControlsEntry } from '@react-three/drei'

//@ts-ignore
export enum ControlsType {
    forward = 'forward',
    back = 'back',
    left = 'left',
    right = 'right',
    jump = 'jump',
}
// Root Route
const rootRoute = createRootRoute({
    component: () => {
        const map = useMemo<KeyboardControlsEntry<ControlsType>[]>(() => [
            { name: ControlsType.forward, keys: ['ArrowUp', 'KeyW'] },
            { name: ControlsType.back, keys: ['ArrowDown', 'KeyS'] },
            { name: ControlsType.left, keys: ['ArrowLeft', 'KeyA'] },
            { name: ControlsType.right, keys: ['ArrowRight', 'KeyD'] },
            { name: ControlsType.jump, keys: ['Space'] },
        ], [])

        return (
            <Suspense fallback={<div>Loading...</div>}>
                <KeyboardControls map={map}>
                    <Outlet />
                </KeyboardControls>
            </Suspense>
        )
    },
})

// Index Route (Landing Page)
const indexRoute = createRoute({
    getParentRoute: () => rootRoute,
    path: '/',
    component: LandingPage,
})

// Demo 1 Route
const demo1Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/demo-1',
    wrapInSuspense: true,
    component: App,
})

// Demo 2 Route
const demo2Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/demo-2',
    component: Demo2,
})

// Demo 3 Route
const demo3Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/demo-3',
    component: Demo3,
})

// Demo 4 Route
const demo4Route = createRoute({
    getParentRoute: () => rootRoute,
    path: '/hunt',
    component: Demo4,
})

// Create Route Tree
const routeTree = rootRoute.addChildren([indexRoute, demo1Route, demo2Route, demo3Route, demo4Route])

// Create Router
export const router = createRouter({ routeTree })

// Register for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}




