module.exports = {
  apps : [{
    name: "server",
    script: "/opt/projects/xmls/server/server.js",
    path: "/opt/projects/xmls/server",
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
    script: "/opt/projects/xmls/server/daemon.js",
    path: "/opt/projects/xmls/server",
    watch: false,
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
