const { defineConfig } = require('cypress')

const PROJECT_PORT = process.env.PORT || 4016;


module.exports = defineConfig({
  projectId: 'wtrs5p',
  video: true,
  videoCompression: true,
  
  

  env: {
    BASE_URL: `http://localhost:${PROJECT_PORT}`,
    PORT:PROJECT_PORT,
    AUTH_LOCAL_FILE:'auth.json',
    AUTH_URL:'http://localhost:1399/auth/v3.0/login',
    MORTAL_AUTH_USERNAME:'swaraj',
    MORTAL_AUTH_PASSWORD:'Vgibc7mO'
  },
  e2e: {
    baseUrl:'http://localhost:4016',
    specPattern: "cypress/tests/**/*.spec.{js,jsx}",
    supportFolder:"cypress/support",
    supportFile:"cypress/support/index.js",
    viewportWidth: 1536,
   
  },
})