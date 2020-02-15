module.exports = {
  apps : [{
    name: "server",
    script: "/home/pezo/xmls/server/server.js",
    path: "/home/pezo/xmls/server",
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
    script: "/home/pezo/xmls/server/daemon.js",
    path: "/home/pezo/xmls/server",
    watch: false,
    env: {
    },
    env_production: {
    }
  }
]
}
