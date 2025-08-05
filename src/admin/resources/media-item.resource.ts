import uploadFeature from '@adminjs/upload';

// models
import { MediaFile } from '../../models/file.model.js';

// helpers
import { generateDateBasedPath } from '../../helpers/media-files.js';

import { componentLoader, Components } from '../component-loader.js';

// constants
import { spacesProvider } from '../constants.js';

export const mediaFileResource = {
  resource: MediaFile,
  options: {
    parent: {
      name: 'Portfolio',
      icon: 'Briefcase',
    },
    properties: {
      _id: { isVisible: { list: false, show: true, edit: false, filter: false } },
      s3Key: {
        position: 1,
        isVisible: { list: false, show: false, edit: false, filter: false, new: false }
      },
      bucket: {
        position: 2,
        isVisible: { list: false, show: true, edit: false, filter: false },
      },
      mime: {
        position: 3,
        isVisible: { list: true, show: true, edit: false, filter: true },
      },
      // Virtual field for file upload - this is automatically handled by uploadFeature
      uploadFile: {
        type: 'mixed',
        isVisible: { list: false, show: false, edit: true, filter: false, new: true },
      },
    },
    sort: {
      sortBy: 'createdAt',
      direction: 'desc',
    },
    actions: {
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
          const { resource, currentAdmin } = context;
          const records = await resource.find({}, { limit: 10000 }); // or any large number you want
          const mediaFiles = records.map((r) => r.toJSON(currentAdmin));
          return {
            mediaFiles,
            someOtherValue: 123,
          };
        },
      },
      new: {
        isAccessible: true
      },
      edit: { isAccessible: true }, // Can edit relationships
      delete: { isAccessible: true },
      show: { isAccessible: true },
    },
  },
  features: [
    uploadFeature({
      provider: spacesProvider,
      multiple: false, // Single file upload for MediaFile
      properties: {
        key: 's3Key',
        bucket: 'bucket',
        mimeType: 'mime',
        file: 'uploadFile', // Virtual field for upload
      },
      uploadPath: (record, filename) => {
        const recordId = record.id() || 'temp';
        const path = generateDateBasedPath(recordId, filename);
        return path;
      },
      validation: {
        mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      },
      componentLoader,
    }),
  ],
};
