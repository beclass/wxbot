module.exports = {
  apps: [{
    name: "wx-robot",
    script: "./server/index.js",
    env: {
      NODE_ENV: "development",
    },
    env_production: {
      NODE_ENV: "production",
    }
  }]
}