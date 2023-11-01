const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'microinvoice',
  video: true,
  e2e: {
    baseUrl: "http://localhost:3000",
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
  },
});
