const { defineConfig } = require("cypress");

module.exports = defineConfig({
  e2e: {
    baseUrl: "http://localhost:3000",
    defaultCommandTimeout: 10000, // wait 10s for elements
    pageLoadTimeout: 30000,       // wait 30s for page loads
    requestTimeout: 15000,        // wait 15s for XHR requests
    responseTimeout: 15000,       // wait 15s for API responses
  },
});
