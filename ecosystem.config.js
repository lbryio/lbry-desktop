module.exports = {
  apps : [{
    name: 'server',
    script: '/home/niko/work/repositories/odysee-frontend/web/index.js',

    // Options reference: https://pm2.io/doc/en/runtime/reference/ecosystem-file/
    instances: 1,
    autorestart: true,
    watch: false,
    max_memory_restart: '1G',
    env: {
      NODE_ENV: 'dev',
      CHAINQUERY_MYSQL_PASSWORD: '52BGpjWrDU3wy9rY5aa66b7NherlTWIv!',
      SDK_API_URL: 'https://api.lbry.tv',
      SENTRY_AUTH_TOKEN: '260966e12253414492c436108fbb58c9a2beef40c20b4f0c9200c98c4c194667'
    }
  }]
};
