import config from './config';

const swaggerDefinition = {
  openapi: '3.0.0',
  info: {
    title: 'zumrafood Voucher microservice task API documentation',
    version: '0.0.1',
    description: 'Voucher microservice',
  },
  servers: [
    {
      url: `http://localhost:${config.port}/v1`,
      description: 'Development Server',
    },
  ],
};

export default swaggerDefinition;
