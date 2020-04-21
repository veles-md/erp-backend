module.exports = {
  apps: [
    {
      name: 'erp-backend',
      script: 'npm',
      cwd: '/root/erp-backend/dist',
      args: 'start:prod',
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: '1G',
      env: {
        NODE_ENV: 'development',
      },
      env_production: {
        NODE_ENV: 'production',
      },
    },
  ],
};
