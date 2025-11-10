const { defineConfig } = require('cypress');

module.exports = defineConfig({
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      on('after:run', (results) => {
        if (results && results.video) {
          // Remove video if all tests passed
          if (results.stats.failures === 0) {
            const fs = require('fs');
            fs.unlinkSync(results.video);
          }
        }
      });

      return config;
    },
  },
});
