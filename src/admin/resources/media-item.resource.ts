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
        isVisible: { list: true, show: true, edit: true, filter: true, new: true },
        defaultValue: function () {
          return 'test';
        },
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
        isAccessible: true,
        before: async (request, context) => {
          console.log('✅ BEFORE payload:', request.payload);
          console.log('✅ BEFORE files:', (request as any).files);
          console.log('✅ BEFORE uploadFile:', request.payload?.uploadFile);
          console.log('✅ BEFORE file keys:', Object.keys((request as any).files || {}));

          // if (request?.files?.['uploadFile.0']) {
          //   console.log('✅ BEFORE uploadFile mapping of file:', request.files['uploadFile.0']);
          //   request.files.uploadFile = request.files['uploadFile.0'];
          //   delete request.files['uploadFile.0'];
          // }

          // console.log('✅ AFTER files:', (request as any).files);
          // console.log('✅ AFTER uploadFile mapping of file:', request.files.uploadFile);
          // // request.payload.uploadFile = request.files.uploadFile;

          // request.files.uploadFile["key"] = "uploadFile-custom-key";
          // request.files.uploadFile["bucket"] = "uploadFile-custom-bucket";
          // request.files.uploadFile["mime"] = "uploadFile-custom-mime";
          // request.files.uploadFile["file"] = "uploadFile-custom-file";

          // const rawFiles = (request as any).files || {};

          // // Fix if file is in `uploadFile.0` instead of `uploadFile`
          // if (rawFiles['uploadFile.0']) {
          //   request.files.uploadFile = rawFiles['uploadFile.0'];
          //   delete request.files['uploadFile.0'];
          // }

          return request;
        },
        after: async (response, request, context) => {
          console.log('✅ AFTER response:', response.record?.params);
          console.log('✅ AFTER s3Key:', response.record?.params?.s3Key);
          console.log('✅ AFTER bucket:', response.record?.params?.bucket);
          console.log('✅ AFTER mime:', response.record?.params?.mime);
          console.log('record:', response.record?.toJSON?.());
          return response;
        },
      },
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
        const path = generateDateBasedPath('media', recordId, filename);
        console.log('📁 Upload path generated:', path);
        return path;
      },
      validation: {
        mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
      },
      componentLoader,
    }),
  ],
};
