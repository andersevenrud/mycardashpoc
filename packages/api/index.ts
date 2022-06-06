import { createApp } from './src/app'
import createConfiguration from './src/config'

async function main() {
  try {
    const config = createConfiguration()
    await createApp(config)
  } catch (error) {
    console.error(error)
    process.exit(1)
  }
}

main()
