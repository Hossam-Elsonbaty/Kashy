import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { ThemeProvider } from "./components/theme-provider.tsx"
import { BrowserRouter } from "react-router-dom";
import { Provider } from 'react-redux'
import { Store } from './store/Store.ts'

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <BrowserRouter>
      <ThemeProvider>
        <Provider store= {Store}>
          <App />
        </Provider>
      </ThemeProvider>    
    </BrowserRouter>
  </StrictMode>
)
