import AWS from 'aws-sdk';

export const DEFAULT_ADMIN = {
  email: 'admin@example.com',
  password: 'password',
};

export const spacesProvider = {
  aws: {
    bucket: process.env.DIGITALOCEAN_SPACE_BUCKET!,
    region: process.env.DIGITALOCEAN_SPACE_REGION!,
    endpoint: new AWS.Endpoint(process.env.DIGITALOCEAN_SPACE_ENDPOINT!),
  },
};