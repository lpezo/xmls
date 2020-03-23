module.exports = {
  apps : [{
    name: "server",
    script: "server.js",
    path: ".",
    watch: false,
    env: {
      NODE_ENV: "dev",
      PORT:3000
    },
    env_production: {
      NODE_ENV: "production",
      PORT:9000
    }
  },
  {
    name: "daemon",
    script: "daemon.js",
    path: ".",
    watch: false,
    enable: false,
    env: {
       NODE_ENV: "dev",
       PORT:3000
    },
    env_production: {
       NODE_ENV: "production",
       PORT:9000
    }
  }
]
}
