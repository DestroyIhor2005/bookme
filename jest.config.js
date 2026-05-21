export default {
  transform: {},
  projects: [
    {
      displayName: "unit",
      testMatch: ["**/bookme.unit.test.js"],
      testEnvironment: "node"
    },
    {
      displayName: "e2e",
      testMatch: ["**/bookme.e2e.test.js"],
      testEnvironment: "jsdom"
    }
  ]
};