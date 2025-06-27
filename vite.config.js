import { defineConfig } from 'vite'

export default defineConfig({
  base: '/jp-portfolio/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      input: {
        main: 'index.html',
        projects: 'projects.html',
        resume: 'resume.html',
        contact: 'contact.html'
      }
    }
  }
})