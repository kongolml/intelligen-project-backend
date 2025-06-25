import { AdminJSOptions } from 'adminjs';
import uploadFeature from '@adminjs/upload';
import AWS from 'aws-sdk';

import componentLoader from './component-loader.js';

// models
import { PortfolioItem } from '../models/portfolio-item.model.js';
import { PortfolioCategory } from '../models/portfolio-category.model.js';
import { MediaFile } from '../models/file.model.js';

// helpers
import { generateDateBasedPath } from '../helpers/media-files.js';

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
          title: {
            position: 1,
          },
          description: {
            type: 'richtext',
            position: 2,
          },
          categories: {
            reference: 'PortfolioCategorie', // exact model name
            isArray: true,
            isVisible: { list: true, show: true, edit: true, filter: true },
            position: 3,
          },
          uploadMainImage: {
            position: 4,
          },
          uploadImages: {
            position: 5,
          },
          mainImage: {
            isVisible: false,
          },
          images: {
            isVisible: false,
          },
        },
      },
      features: [
        // Upload for images (multiple)
        uploadFeature({
          provider: spacesProvider,
          multiple: true,
          properties: {
            key: 'mediaFile', // Field in schema
            file: 'uploadImages', // Virtual field in AdminJS form,
            // filePath: 'imagesPath',
            // filesToDelete: 'imagesToDelete',
          },
          uploadPath: (record, filename) => {
            const recordId = record.id() || 'temp';

            // Date-organized path with portfolio item ID
            return generateDateBasedPath('portfolio', recordId, filename);

            // This will generate paths like:
            // portfolio/2024/06/24/667a1234567890abcdef1234/1719234567-hero-image.jpg
          },
          componentLoader,
        }),
      ],
    },
    {
      resource: MediaFile,
      options: {
        // ✅ Hide from navigation but keep as resource for references
        navigation: false, // This hides it from sidebar
        actions: {
          // Optionally disable direct access
          list: { isAccessible: false },
          new: { isAccessible: false },
          edit: { isAccessible: false },
          delete: { isAccessible: false },
          show: { isAccessible: false }
        }
      }
    }
  ],
  databases: [],
};

export default options;
