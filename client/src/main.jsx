import React from 'react'
import ReactDOM from 'react-dom/client'
import { ChakraProvider } from '@chakra-ui/react'
import { BrowserRouter } from 'react-router-dom'
import { AppProvider } from './context/AppContext'
import ErrorBoundary from './components/ErrorBoundary'
import App from './App.jsx'
import theme from './theme.js'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <ChakraProvider theme={theme}>
        <BrowserRouter
          future={{
            v7_startTransition: true,
            v7_relativeSplatPath: true
          }}
        >
          <AppProvider>
            <App />
          </AppProvider>
        </BrowserRouter>
      </ChakraProvider>
    </ErrorBoundary>
  </React.StrictMode>,
)