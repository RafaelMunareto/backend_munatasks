module.exports = {
  apps : [{
    name   : "server",
    script : "./src/server.js",
    instances: 4,
    watch: ['src']

  }]
}
