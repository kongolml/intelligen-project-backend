import { AdminJSOptions } from 'adminjs';
import uploadFeature from '@adminjs/upload';
import AWS from 'aws-sdk';

import {componentLoader, Components} from './component-loader.js';

// models
import { PortfolioItem } from '../models/portfolio-item.model.js';
import { PortfolioCategory } from '../models/portfolio-category.model.js';
import { MediaFile } from '../models/file.model.js';

// helpers
import { generateDateBasedPath, handleMediaFileCreation } from '../helpers/media-files.js';

const spacesProvider = {
  aws: {
    bucket: process.env.DIGITALOCEAN_SPACE_BUCKET!,
    region: process.env.DIGITALOCEAN_SPACE_REGION!,
    endpoint: new AWS.Endpoint(process.env.DIGITALOCEAN_SPACE_ENDPOINT!),
  },
};

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  // resources: [PortfolioItem],
  resources: [
    {
      resource: PortfolioCategory,
      options: {
        parent: {
          name: 'Portfolio',
          icon: 'Briefcase'
        },
        properties: {
          _id: { isVisible: false },
          name: { isRequired: true },
          slug: { isRequired: true },
          description: {
            // type: 'richtext',
            isRequired: true,
            isVisible: { list: false, show: true, edit: true, filter: false },
          },
        }
      },
    },
    {
      resource: PortfolioItem,
      options: {
        parent: {
          name: 'Portfolio',
          icon: 'Briefcase'
        },
        properties: {
          _id: { isVisible: { list: false, show: true, edit: false, filter: false } },
          description: {
            type: 'richtext',
            position: 2,
            isVisible: {
              list: false,
              show: true,
              edit: true,
              filter: false
            }
          },
          categories: {
            reference: 'PortfolioCategory', // exact model name
            // isArray: true,
            position: 3,
            isVisible: { list: true, show: true, edit: true, filter: true },
          },
          // Show existing media files (many-to-many relationship)
          mediaFiles: {
            reference: 'MediaFile',
            isArray: true,
            position: 4,
            isVisible: { list: false, show: true, edit: true, filter: false },
          },
          // Virtual field for uploading new files
          uploadFiles: {
            position: 5,
            isVisible: { list: false, show: false, edit: true, filter: false },
          },
          createdAt:{
            isVisible: false
          }
        },
        actions: {
          new: {
            after: handleMediaFileCreation
          },
          edit: {
            after: handleMediaFileCreation
          }
        }
      },
      features: [
        // Upload for images (multiple)
        uploadFeature({
          provider: spacesProvider,
          multiple: true,
          properties: {
            // key: 'mediaFile', // Field in schema
            // file: 'uploadImages', // Virtual field in AdminJS form,
            // filePath: 'imagesPath',
            // filesToDelete: 'imagesToDelete',

            // This 'key' property in MediaFile schema will store the S3 key
            key: 's3Key',
            // This 'bucket' property in MediaFile schema will store the bucket name
            bucket: 'bucket',
            // This 'mimeType' property in MediaFile schema will store the mime type
            mimeType: 'mime',
            // The virtual field in the PortfolioItem form for the file upload
            file: 'uploadFiles', // Virtual field for upload
          },
          uploadPath: (record, filename) => {
            const recordId = record.id() || 'temp';

            // Date-organized path with portfolio item ID
            return generateDateBasedPath('portfolio', recordId, filename);

            // This will generate paths like:
            // portfolio/2024/06/24/667a1234567890abcdef1234/1719234567-hero-image.jpg
          },
          validation: {
            mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml']
          },
          componentLoader,
        }),
      ],
    },
    {
      resource: MediaFile,
      options: {
        parent: {
          name: 'Portfolio',
          icon: 'Briefcase'
        },
        properties: {
          _id: { isVisible: { list: false, show: true, edit: false, filter: false } },
          s3Key: {
            position: 1,
            isVisible: { list: true, show: true, edit: false, filter: true },
          },
          bucket: {
            position: 2,
            isVisible: { list: false, show: true, edit: false, filter: false },
          },
          mime: {
            position: 3,
            isVisible: { list: true, show: true, edit: false, filter: true },
          },
          // Many-to-many relationship - can edit which portfolios this file belongs to
          // portfolioItems: {
          //   reference: 'PortfolioItem',
          //   isArray: true,
          //   position: 4,
          //   isVisible: { list: true, show: true, edit: true, filter: true },
          // },
        },
        actions: {
          // list: { isAccessible: true, component: Components.MediaFileCustomPage,
          //   label: 'Media files library',
          //   handler: async (request, response, context) => {
          //     // For example, fetch all files (with mongoose):
          //     const { resource, currentAdmin } = context
          //     const records = await resource.find({}) // all records; add filters as needed
        
          //     // You can map/transform records as needed:
          //     const mediaFiles = records.map(r => r.toJSON(currentAdmin))
        
          //     // Return as props:
          //     return {
          //       mediaFiles,
          //       someOtherValue: 123,
          //     }
          //   }
          // },
          list: {
            isAccessible: true,
            label: 'Media Files Library',
            component: Components.MediaFileCustomPage,
            // No handler—fetch data in React using ApiClient
          },
          getMediaFiles: {
            actionType: 'resource',
            isVisible: false, // hidden from UI
            handler: async (request, response, context) => {
              const { resource, currentAdmin } = context
              const records = await resource.find({}, { limit: 10000 }); // or any large number you want
              const mediaFiles = records.map(r => r.toJSON(currentAdmin))
              return {
                mediaFiles,
                someOtherValue: 123,
              }
            }
          },
          new: { isAccessible: false }, // Files created through PortfolioItem upload
          edit: { isAccessible: true }, // Can edit relationships
          delete: { isAccessible: true },
          show: { isAccessible: true },
          // customPage: {
          //   actionType: 'resource',
          //   label: 'Custom Page',
          //   icon: 'Document',
          //   component: Components.MediaFileCustomPage,
          //   isVisible: true,
          //   handler: async (request, response, context) => {
          //     return {};
          //   }
          // }
        }
      }
    }
  ],
  databases: [],
};

export default options;
