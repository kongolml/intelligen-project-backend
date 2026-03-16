import AWS from 'aws-sdk';

export const DEFAULT_LOCALE = 'en';
export const SUPPORTED_LOCALES = ['en', 'uk'] as const;

export const DEFAULT_ADMIN = {
  email: process.env.ADMIN_EMAIL!,
  passwordHash: process.env.ADMIN_PASSWORD_HASH!,
};

export const spacesProvider = {
  aws: {
    bucket: process.env.DIGITALOCEAN_SPACE_BUCKET!,
    region: process.env.DIGITALOCEAN_SPACE_REGION!,
    endpoint: new AWS.Endpoint(process.env.DIGITALOCEAN_SPACE_ENDPOINT!),
    // uploadParams: {
    //   ACL: 'public-read', // 👈 this is essential
    // },
    expires: 0 // this is essential to make the file publicly accessible, only this way it works
  },
};