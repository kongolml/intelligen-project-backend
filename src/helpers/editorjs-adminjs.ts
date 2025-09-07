// types
import { EditorJSDataBlock, EditorJSDataBlockTypesEnum } from '../types/editorjs.types.js';

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
