import { defineConfig } from 'cypress'

export default defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    viewportWidth: 1280,
    viewportHeight: 720,
    video: false,
    screenshotOnRunFailure: true,
    defaultCommandTimeout: 10000,
    setupNodeEvents(on, config) {
      // Implement any custom plugins or configurations here
      on('task', {
        log(message) {
          console.log(message);
          return null;
        }
      });
      return config
    },
  },
  component: {
    devServer: {
      framework: 'next',
      bundler: 'webpack',
    },
  },
  retries: {
    runMode: 2,
    openMode: 0,
  },
  env: {
    // Accessibility testing configuration
    a11yFailOnError: true,
    a11yLogViolations: true,
  }
})
