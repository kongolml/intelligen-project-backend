// types
import { EditorJSDataBlock, EditorJSDataBlockTypesEnum } from '../types/editorjs.types.js';

import { unflatten } from 'flat';
import { ActionRequest } from 'adminjs';

export const convertEditorJSDataToAdminJS = (editorJSBlocks: EditorJSDataBlock[]) => {
  const adminJSData = editorJSBlocks.map((editorJSBlock) => {
    switch (editorJSBlock.type) {
      case EditorJSDataBlockTypesEnum.PARAGRAPH: {
        return {
          type: editorJSBlock.type,
          data: editorJSBlock.data,
        };
      }
      case EditorJSDataBlockTypesEnum.HEADER: {
        return {
          type: editorJSBlock.type,
          data: editorJSBlock.data,
        };
      }
      case EditorJSDataBlockTypesEnum.LIST: {
        const dataWithoutMeta = {
          type: editorJSBlock.type,
          style: editorJSBlock.data.style,
          items: editorJSBlock.data.items.map((item) => {
            return {
              content: item.content,
              items: item.items,
            };
          }),
        };
        return dataWithoutMeta;
      }
      case EditorJSDataBlockTypesEnum.IMAGE: {
        const dataWithoutMeta = {
          caption: editorJSBlock.data.caption,
          file: {
            url: editorJSBlock.data.file.url,
          },
        };

        return {
          data: dataWithoutMeta,
          type: editorJSBlock.type,
        };
      }
      case EditorJSDataBlockTypesEnum.COLUMNS: {
        console.log('editorJSBlock:::');
        console.log(editorJSBlock);
        return {
          type: editorJSBlock.type,
          data: editorJSBlock.data,
        };
      }
    }
  });

  return adminJSData;
};

export const convertAdminJSDataToEditorJS = (adminJSData: any, key: string) => {
  return convertFlattenedDataToEditorJsFormat(adminJSData, key);
};

function convertFlattenedDataToEditorJsFormat(flattenedData: any, key: string) {
  const result = {};
  const blocks = [];

  // Copy non-description fields
  Object.keys(flattenedData).forEach((loopKey) => {
    if (!loopKey.startsWith(`${key}.`)) {
      result[loopKey] = flattenedData[loopKey];
    }
  });

  // Find all description block indices
  const blockIndices = new Set();
  Object.keys(flattenedData).forEach((loopKey) => {
    if (loopKey.startsWith(`${key}.`)) {
      const regex = new RegExp(`${key}\\.(\\d+)`);
      const match = loopKey.match(regex);
      if (match) {
        blockIndices.add(parseInt(match[1]));
      }
    }
  });

  // Process each block
  // @ts-ignore
  Array.from(blockIndices)
    .sort((a, b) => a - b)
    .forEach((index) => {
      const block = {
        type: flattenedData[`${key}.${index}.type`],
        data: {},
      };

      // Handle different block types
      switch (block.type) {
        case EditorJSDataBlockTypesEnum.HEADER:
          // @ts-ignore
          block.data.text = flattenedData[`${key}.${index}.data.text`] || '';

          // @ts-ignore
          block.data.level = parseInt(flattenedData[`${key}.${index}.data.level`]) || 2;
          break;

        case EditorJSDataBlockTypesEnum.PARAGRAPH:
          // @ts-ignore
          block.data.text = flattenedData[`${key}.${index}.data.text`] || '';
          break;

        case EditorJSDataBlockTypesEnum.LIST:
          // @ts-ignore
          block.data.style = flattenedData[`${key}.${index}.style`] || 'unordered';
          // @ts-ignore
          block.data.items = [];

          // Find list items
          let itemIndex = 0;
          while (flattenedData[`${key}.${index}.items.${itemIndex}.content`] !== undefined) {
            // @ts-ignore
            block.data.items.push(flattenedData[`${key}.${index}.items.${itemIndex}.content`]);
            itemIndex++;
          }
          break;

        case EditorJSDataBlockTypesEnum.IMAGE:
          // @ts-ignore
          block.data.caption = flattenedData[`${key}.${index}.data.caption`] || '';
          // @ts-ignore
          block.data.file = {
            url: flattenedData[`${key}.${index}.data.file.url`] || '',
          };
          break;

        case EditorJSDataBlockTypesEnum.COLUMNS: {
          // @ts-ignore
          block.data.cols = [];

          // Find list items
          let itemIndex = 0;
          while (flattenedData[`${key}.${index}.items.${itemIndex}.content`] !== undefined) {
            // @ts-ignore
            // block.data.items.push(flattenedData[`${key}.${index}.items.${itemIndex}.content`]);
            block.data.cols = inflateBlockColumns('description', flattenedData);
            itemIndex++;
          }
          break;
        }
      }
      // Only add blocks that aren't undefined or empty
      if (block.type && block.type !== 'undefined') {
        blocks.push(block);
      }
    });

  // Create Editor.js format description
  // @ts-ignore
  result[key] = {
    //   time: Date.now(),
    blocks: blocks,
    //   version: "2.22.2"
  };

  return result;
}

const inflateBlockColumns = (prefix: string, flattenedData: any, index: number) => {
  // Helpers
  const read = (k: string) => flattenedData[k];
  const exists = (k: string) => read(k) !== undefined;

  // Safeguards
  const MAX_COLS = 20;
  const MAX_BLOCKS_PER_COL = 200;
  const MAX_LIST_ITEMS = 1000;

  const cols: any[] = [];
  for (let c = 0; c < MAX_COLS; c++) {
    // stop when no blocks in this col
    if (
      !exists(`${prefix}.${index}.data.cols.${c}.blocks.0.type`) &&
      !exists(`${prefix}.${index}.data.cols.${c}.blocks.0.id`)
    )
      break;

    const colBlocks: any[] = [];
    for (let b = 0; b < MAX_BLOCKS_PER_COL; b++) {
      const blockPrefix = `${prefix}.${index}.data.cols.${c}.blocks.${b}`;
      if (!exists(`${blockPrefix}.type`)) break;
      const inner = inflateBlockColumns(blockPrefix);
      if (inner) colBlocks.push(inner);
    }

    const col: any = { blocks: colBlocks };
    // optionally carry over per-column time/version if present
    if (exists(`${prefix}.${index}.data.cols.${c}.time`)) {
      col.time = read(`${prefix}.${index}.data.cols.${c}.time`);
    }
    if (exists(`${prefix}.${index}.data.cols.${c}.version`)) {
      col.version = read(`${prefix}.${index}.data.cols.${c}.version`);
    }
    cols.push(col);
  }

  return cols;
  // break;
};

// Helper: normalize values AdminJS sometimes sends
const coerceValue = (val: any) => {
  if (val === '__FORM_VALUE_EMPTY_ARRAY__') return [];
  if (val === 'true') return true;
  if (val === 'false') return false;
  return val;
};

export const unflattenPayload = async (request: ActionRequest) => {
  if (request.method !== 'post' || !request.payload) return request;

  // 1) Unflatten all dotted keys into nested objects
  let unflattened = unflatten(request.payload, { object: false });

  // 2) Walk once to normalize special values
  const normalize = (obj: any): any => {
    if (Array.isArray(obj)) return obj.map(normalize);
    if (obj && typeof obj === 'object') {
      const out: any = {};
      for (const [k, v] of Object.entries(obj)) out[k] = normalize(v);
      return out;
    }
    return coerceValue(obj);
  };

  unflattened = normalize(unflattened);

  request.payload = unflattened;
  return request;
};