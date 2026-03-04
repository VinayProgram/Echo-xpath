import { createRootRoute, createRoute, createRouter, Outlet } from '@tanstack/react-router'
import LandingPage from './components/LandingPage'
import App from './examples/demo/Demo'
import Demo2 from './examples/demo-2/Demo2'
import { Suspense } from 'react'

// Root Route
const rootRoute = createRootRoute({
    component: () => (
        <Suspense fallback={<div>Loading...</div>}>
            <Outlet />
        </Suspense>
    ),
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

// Create Route Tree
const routeTree = rootRoute.addChildren([indexRoute, demo1Route, demo2Route])

// Create Router
export const router = createRouter({ routeTree })

// Register for type safety
declare module '@tanstack/react-router' {
    interface Register {
        router: typeof router
    }
}




