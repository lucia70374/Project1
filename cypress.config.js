const { defineConfig } = require("cypress");

module.exports = defineConfig({
 
  e2e: {
    baseUrl: 'https://demo.netbox.dev',
    fixturesFolder: 'cypress/fixtures',
    screenshotsFolder: 'cypress/screenshots',
    videosFolder: 'cypress/videos',
    video: false,
    downloadsFolder: 'cypress/downloads',
    defaultCommandTimeout: 5000,
    viewportWidth: 1000,
    viewportHeight: 660,
    setupNodeEvents(on, config) {
      // bind to the event we care about
      // on('<event>', (arg1, arg2) => {

        // plugin stuff here
      // })
    },
  },
});
