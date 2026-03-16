export const getMediaUrl = (bucket: string, s3Key: string): string => {
  return `https://${bucket}.${process.env.DIGITALOCEAN_SPACE_HOST}/${s3Key}`;
};
