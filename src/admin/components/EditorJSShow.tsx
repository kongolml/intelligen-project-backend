// admin/components/EditorJSShow.jsx
import React from 'react';
import DOMPurify from 'isomorphic-dompurify';

// types
import { EditorJSDataBlockTypesEnum } from '../../types/editorjs.types.js';

// helpers
import { convertAdminJSDataToEditorJS } from '../../helpers/editorjs-adminjs.js';

/** @type {import('adminjs').BasePropertyProps} */
const EditorJSShow = (props) => {
  const { property, record } = props;
  const path = property?.path || property?.name;

  // @ts-ignore
  const blocks = convertAdminJSDataToEditorJS(record.params, path).description.blocks;

  if (!blocks.length) return <div style={{ opacity: 0.6 }}>No content</div>;

  return (
    <div>
      {blocks.map((b, i) => {
        switch (b.type) {
          case EditorJSDataBlockTypesEnum.HEADER:
            const Tag = `h${b.data?.level || 2}` as keyof JSX.IntrinsicElements;
            return <Tag key={i} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(b.data?.text || '') }} />;
          case EditorJSDataBlockTypesEnum.PARAGRAPH:
            return <p key={i} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(b.data?.text || '') }} />;
          case EditorJSDataBlockTypesEnum.LIST:
            const items = b.data?.items || [];
            return b.data?.style === 'ordered' ? (
              <ol key={i}>
                {items.map((it, k) => <li key={k} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(it) }} />)}
              </ol>
            ) : (
              <ul key={i}>
                {typeof items === 'object' ? Object.values(items).map((it, k) => <li key={k} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(it as string) }} />) : items.map((it, k) => <li key={k} dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(it) }} />)}
              </ul>
            );
          case EditorJSDataBlockTypesEnum.IMAGE:
            return <img key={i} src={b.data?.file.url} alt={b.data?.caption} />;
        }
      })}
    </div>
  );
};

export default EditorJSShow;
