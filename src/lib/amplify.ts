import { Amplify } from 'aws-amplify'

export async function configureAmplify(): Promise<boolean> {
  // import.meta.glob returns empty object if file doesn't exist
  // (no build error, unlike static/dynamic import)
  const modules = import.meta.glob<Record<string, unknown>>(
    '/amplify_outputs.json',
    { eager: false },
  )
  const loader = modules['/amplify_outputs.json']

  if (!loader) {
    console.warn(
      'amplify_outputs.json not found.',
      'Run `npx ampx sandbox` to generate the backend configuration.',
    )
    return false
  }

  try {
    const outputs = await loader()
    Amplify.configure(outputs as Parameters<typeof Amplify.configure>[0])
    return true
  } catch (err) {
    console.warn('Failed to configure Amplify:', err)
    return false
  }
}
