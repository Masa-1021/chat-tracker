import { AppRoutes } from './app/routes'
import { AppLayout } from './shared/components/Layout/AppLayout'
import { ErrorBoundary } from './shared/components/ErrorBoundary'

function App() {
  return (
    <ErrorBoundary>
      <AppLayout>
        <AppRoutes />
      </AppLayout>
    </ErrorBoundary>
  )
}

export default App
