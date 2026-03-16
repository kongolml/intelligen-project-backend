// import uploadFeature from '@adminjs/upload';

import fs from 'node:fs';

// models
import { themeReducer } from 'adminjs';
import { PortfolioItem } from '../../models/portfolio-item.model.js';

import { unflattenPayload } from '../../helpers/editorjs-adminjs.js';
import { uploadFileAndCreateDbRecord } from '../../helpers/import.js';

// helpers
// import { generateDateBasedPath, handleMediaFileCreation } from '../../helpers/media-files.js';

import { Components } from '../component-loader.js';

// constants
// import { spacesProvider } from '../constants.js';

/**
 * Unflatten all dotted keys in AdminJS payload (arrays & objects),
 * convert AdminJS empty-array sentinel, and coerce booleans.
 * Works for fields like:
 *   - categories.0
 *   - mediaFiles.1
 *   - description.8.data.file.url
 *   - description.6.data.items = "__FORM_VALUE_EMPTY_ARRAY__"
 */
const reconstructEditorJsData = async (request) => {
  if (request.method !== 'post' || !request?.payload) return request;

  const { payload } = request;

  // --- helpers -------------------------------------------------------------

  // const isIndex = (seg) => /^\d+$/.test(seg);

  // const coerceValue = (val) => {
  //   if (val === '__FORM_VALUE_EMPTY_ARRAY__') return [];
  //   if (val === 'true') return true;
  //   if (val === 'false') return false;
  //   return val;
  // };

  /**
   * Sets value at path (dot-separated), creating objects/arrays along the way.
   * Numeric segments create arrays; otherwise objects.
   */
  // const setDeep = (target, path, value) => {
  //   const parts = path.split('.');
  //   let cur = target;

  //   parts.forEach((part, idx) => {
  //     const last = idx === parts.length - 1;
  //     const nextPart = parts[idx + 1];

  //     if (last) {
  //       if (isIndex(part)) {
  //         if (!Array.isArray(cur)) {
  //           // If current is not an array, convert it into one
  //           // (rare, but protects against malformed inputs)
  //           const replacement = [];
  //           Object.assign(replacement, cur);
  //           cur = replacement;
  //         }
  //         cur[Number(part)] = coerceValue(value);
  //       } else {
  //         cur[part] = coerceValue(value);
  //       }
  //       return;
  //     }

  //     // Not last: ensure container exists for next step
  //     if (isIndex(part)) {
  //       // Current level should be array
  //       if (!Array.isArray(cur)) {
  //         // If cur is an object, convert to array preserving nothing (clean slate)
  //         // If cur is undefined, create empty array
  //         // In practice, this will be a fresh branch and just becomes an array
  //         const arr = [];
  //         // We can't reassign parent's reference directly here,
  //         // so we rely on the caller passing `cur` by reference in the parent object.
  //         // Therefore only safe when called with proper object reference chain.
  //         // To guarantee it, we only ever call setDeep with the true root object.
  //       }
  //       // Make sure the index exists
  //       const idxNum = Number(part);
  //       if (cur[idxNum] == null) {
  //         // Decide next container by looking ahead
  //         const nextContainer = isIndex(nextPart) ? [] : {};
  //         cur[idxNum] = nextContainer;
  //       }
  //       cur = cur[idxNum];
  //     } else {
  //       // Current level should be object
  //       if (typeof cur[part] !== 'object' || cur[part] == null || Array.isArray(cur[part])) {
  //         // Decide next container by looking ahead
  //         const nextContainer = isIndex(nextPart) ? [] : {};
  //         cur[part] = nextContainer;
  //       }
  //       cur = cur[part];
  //     }
  //   });
  // };

  // // --- rebuild payload -----------------------------------------------------

  // const newPayload = {};

  // // 1) First, copy all non-dotted keys as-is (but with boolean coercion)
  // for (const key in payload) {
  //   if (!payload.hasOwnProperty(key)) continue;
  //   if (!key.includes('.')) {
  //     newPayload[key] = coerceValue(payload[key]);
  //   }
  // }

  // // 2) Then process dotted keys into nested structure
  // for (const key in payload) {
  //   if (!payload.hasOwnProperty(key)) continue;
  //   if (key.includes('.')) {
  //     setDeep(newPayload, key, payload[key]);
  //   }
  // }

  // 3) Assign rebuilt payload back to request
  // request.payload = newPayload;

  console.log('payload', payload);

  return request;
};


const handleThumbnailUpload = async (request) => {
  if (request.method !== 'post' || !request?.payload) return request;

  const { payload } = request;
  const file = payload.uploadThumbnail;

  console.log('[handleThumbnailUpload] file:', file);
  console.log('[handleThumbnailUpload] file type:', typeof file);
  console.log('[handleThumbnailUpload] payload keys:', Object.keys(payload));
  console.log('[handleThumbnailUpload] thumbnail value:', payload.thumbnail);

  // Skip if no file uploaded
  if (!file || !file.path) return request;

  if (!file.type?.startsWith('image/')) {
    throw new Error('Uploaded thumbnail must be an image');
  }

  const buffer = await fs.promises.readFile(file.path);
  const result = await uploadFileAndCreateDbRecord(buffer, file.type, undefined, file.name);

  console.log('[handleThumbnailUpload] upload result _id:', result._id);

  payload.thumbnail = result._id.toString();
  delete payload.uploadThumbnail;

  return request;
};

export const portfolioItemResource = {
  resource: PortfolioItem,
  options: {
    parent: {
      name: 'Portfolio',
      icon: 'Briefcase',
    },
    properties: {
      _id: { isVisible: { list: false, show: true, edit: false, filter: false } },
      slug: {
        position: 1,
        isVisible: { list: true, show: true, edit: true, filter: true },
        components: {
          list: Components.ViewOnSiteLink,
          show: Components.ViewOnSiteLink,
        },
      },
      name: {
        type: 'mixed',
        position: 1,
        isVisible: { list: true, show: true, edit: true, filter: false },
        components: {
          edit: Components.TranslatableEdit,
          show: Components.TranslatableShow,
        },
      },
      'name.en': { isTitle: true, isVisible: { list: false, show: false, edit: false, filter: false } },
      'name.uk': { isVisible: { list: false, show: false, edit: false, filter: false } },
      subtitle: {
        type: 'mixed',
        position: 1,
        isVisible: { list: false, show: true, edit: true, filter: false },
        components: {
          edit: Components.TranslatableEdit,
          show: Components.TranslatableShow,
        },
      },
      client: {
        type: 'mixed',
        position: 1,
        isVisible: { list: false, show: true, edit: true, filter: false },
        components: {
          edit: Components.TranslatableEdit,
          show: Components.TranslatableShow,
        },
      },
      year: {
        position: 1,
        isVisible: { list: true, show: true, edit: true, filter: true },
      },
      description: {
        // type: 'richtext',
        type: 'mixed', // Mixed JSON – we’ll edit with a custom component
        // isArray: true,
        position: 2,
        isVisible: {
          list: false,
          show: true,
          edit: true,
          filter: false,
        },
        components: {
          show: Components.EditorJSShow,
          edit: Components.EditorJSEdit
        }
      },
      categories: {
        reference: 'PortfolioCategory', // exact model name
        isArray: true,
        position: 3,
        isVisible: { list: true, show: true, edit: true, filter: true },
        components: {
          list: Components.CategoriesList
        }
      },
      // Show existing media files (many-to-many relationship)
      mediaFiles: {
        reference: 'MediaFile',
        isArray: true,
        position: 4,
        isVisible: { list: false, show: true, edit: true, filter: false },
      },
      thumbnail: {
        reference: 'MediaFile',
        isVisible: { list: false, show: true, edit: true, filter: false },
        components: {
          show: Components.ThumbnailShow,
        },
      },
      uploadThumbnail: {
        isVisible: { list: false, show: false, edit: true, filter: false },
        components: {
          edit: Components.ThumbnailUpload,
        },
      },
      // Virtual field for uploading new files
      // uploadFiles: {
      //   position: 5,
      //   isVisible: { list: false, show: false, edit: true, filter: false },
      // },
      createdAt: {
        isVisible: false,
      },
    },
    actions: {
      new: { before: [handleThumbnailUpload] },
      edit: { before: [handleThumbnailUpload] },
    },
  },
  // features: [
  //   // Upload for images (multiple)
  //   uploadFeature({
  //     provider: spacesProvider,
  //     multiple: true,
  //     properties: {
  //       // key: 'mediaFile', // Field in schema
  //       // file: 'uploadImages', // Virtual field in AdminJS form,
  //       // filePath: 'imagesPath',
  //       // filesToDelete: 'imagesToDelete',

  //       // This 'key' property in MediaFile schema will store the S3 key
  //       key: 's3Key',
  //       // This 'bucket' property in MediaFile schema will store the bucket name
  //       bucket: 'bucket',
  //       // This 'mimeType' property in MediaFile schema will store the mime type
  //       mimeType: 'mime',
  //       // The virtual field in the PortfolioItem form for the file upload
  //       file: 'uploadFiles', // Virtual field for upload
  //     },
  //     uploadPath: (record, filename) => {
  //       const recordId = record.id() || 'temp';

  //       // Date-organized path with portfolio item ID
  //       return generateDateBasedPath(recordId, filename);

  //       // This will generate paths like:
  //       // portfolio/2024/06/24/667a1234567890abcdef1234/1719234567-hero-image.jpg
  //     },
  //     validation: {
  //       mimeTypes: ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'],
  //     },
  //     componentLoader,
  //   }),
  // ],
};