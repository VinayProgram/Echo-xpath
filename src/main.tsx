import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import Demo2 from './demo-2/App.tsx'
import { StoreProviderComponent } from './demo-2/store.tsx'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    {/* <App /> */}
    <StoreProviderComponent>
      <Demo2 />
    </StoreProviderComponent>
  </StrictMode>,
)
