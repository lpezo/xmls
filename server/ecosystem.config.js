module.exports = {
  apps : [{
    name: "server",
    script: "/home/pezo/xmls/server/server.js",
    path: "/home/pezo/xmls/server",
    watch: true,
    env: {
      NODE_ENV: "dev",
      PORT:3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT:9000
    }
  }]
}
