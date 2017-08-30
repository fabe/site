const dev = process.env.NODE_ENV !== 'production';

const config = {
  app: {
    name: 'Fabian Schultz',
    publicUrl: 'https://fabianschultz.com',
  },
  server: dev ? 'http://localhost:1337' : 'https://fabianschultz.com',
};

export default config;
