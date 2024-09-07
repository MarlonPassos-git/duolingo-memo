import { defineManifest } from '@crxjs/vite-plugin'
import packageJson from './package.json'
import type { ConfigEnv } from 'vite'

const { version } = packageJson

export default defineManifest(async (env) => {
  return {
    manifest_version: 3,
    description: 'Remembers and auto-fills your answers on Duolingo.',
    permissions: ['storage'],
    background: {
      service_worker: 'src/background.ts',
      type: 'module',
    },
    action: { default_popup: 'src/default_popup/index.html' },
    options_page: 'src/options/index.html',
    content_scripts: [
      {
        matches: ['https://www.duolingo.com/*'],
        js: ['src/content/duolingo/index.ts'],
      },
    ],
    icons: {
      16: 'src/static/logo/16x16.png',
      48: 'src/static/logo/48x48.png',
      128: 'src/static/logo/128x128.png',
      256: 'src/static/logo/256x256.png',
    },
    name: isDev(env)
      ? '[Dev] Duolingo expanded'
      : 'CRXJS Power Tools',
    // up to four numbers separated by dots
    version: getVersion(),
    // semver is OK in "version_name"
    version_name: version,
    key: isDev(env) ? 'MIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA0FAp+xWiJpGBmsKPhGcqF4/gQN9F5tmXgEVYEHUHc8HcBIUcT+9w+jo4q2OtXa2ThqgEXsx2zcNZIWJ/5yXcofVry5E2/HKBuLWHNtYOlI1rhwc/CLujo0RHhzF7rIiYcMPQdBhzr6L0u5u9N29VUWjLozltquKRcUbjXNe4LT7+q/akhn5tvfvWHkQ9qC6mRjvGwGTFlh1A6+vWKKSVYx/J+IBHW+I2X5NlAxwG734OMYVWRWK487jf1wsWZ2jHRTqg9TB3htT+84r7+E3kFYMycow9+2EhvoI2k5VGhZw1tAJcpie1Poozc5u8CTrZ4sZ5LK4h59OCOxmejC048QIDAQAB' : undefined,
  }
})

function isDev(env: ConfigEnv) {
  return env.mode === 'development'
}

function getVersion() {
  const [major, minor, patch, label = '0'] = version
    .replace(/[^\d.-]+/g, '')
    .split(/[.-]/)

  return `${major}.${minor}.${patch}.${label}`
}
