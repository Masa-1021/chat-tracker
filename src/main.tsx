import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import '@serendie/ui/styles.css'
import './index.css'
import { configureAmplify } from './lib/amplify'
import { initErrorReporter } from './shared/utils/errorReporter'
import { Root } from './app/Root'

async function bootstrap() {
  await initErrorReporter()
  await configureAmplify()
  createRoot(document.getElementById('root')!).render(
    <StrictMode>
      <Root />
    </StrictMode>,
  )
}

bootstrap()

