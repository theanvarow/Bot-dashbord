module.exports = {
  apps: [
    {
      name: 'placement-dashboard',
      script: 'server.js',
      cwd: __dirname,
      env: {
        NODE_ENV: 'production',
        HOST: '0.0.0.0',
        PORT: 3000
      }
    }
  ]
};

