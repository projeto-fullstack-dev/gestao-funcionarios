import { defineConfig } from 'cypress'
export default defineConfig({ e2e: { baseUrl: 'http://localhost:5173', viewportWidth: 1280, viewportHeight: 720, video: false, retries: { runMode: 1, openMode: 0 } }, env: { login: 'login', senha: 'pass', apiUrl: 'http://localhost:8080/api' } })
