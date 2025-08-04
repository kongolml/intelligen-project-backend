import uploadFeature from '@adminjs/upload';

// models
import { PortfolioItem } from '../../models/portfolio-item.model.js';

// helpers
import { generateDateBasedPath, handleMediaFileCreation } from '../../helpers/media-files.js';

import { componentLoader } from '../component-loader.js';

// constants
import { spacesProvider } from '../constants.js';

export const portfolioItemResource = {
  resource: PortfolioItem,
  options: {
    parent: {
      name: 'Portfolio',
      icon: 'Briefcase',
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
          filter: false,
        },
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
      createdAt: {
        isVisible: false,
      },
    },
    actions: {
      new: {
        after: handleMediaFileCreation,
      },
      edit: {
        after: handleMediaFileCreation,
      },
    },
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
        mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      },
      componentLoader,
    }),
  ],
};
