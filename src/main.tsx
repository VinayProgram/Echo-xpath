import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { YukaProvider } from './yuka-manager/yuka-context.tsx'
import { RouterProvider } from '@tanstack/react-router'
import { router } from './router.tsx'
import './App.css'
createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <YukaProvider>
      <RouterProvider router={router} />
    </YukaProvider>
  </StrictMode>,
)
