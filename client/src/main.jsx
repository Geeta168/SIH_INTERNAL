
import { createRoot } from 'react-dom/client'
import './index.css'
import './i18n' // Initialize i18n
import App from './App.jsx'
import {BrowserRouter} from 'react-router-dom' 
import { AppContextProvider } from './context/AppContext.jsx'
import { A11yProvider } from './context/A11yContext.jsx'
import ErrorBoundary from './components/ErrorBoundary.jsx'

createRoot(document.getElementById('root')).render(
    <ErrorBoundary>
        <BrowserRouter>
            <AppContextProvider>
                <A11yProvider>
                    <App />
                </A11yProvider>
            </AppContextProvider>
        </BrowserRouter>
    </ErrorBoundary>
)
