// admin/components/EditorJSEdit.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';
import ImageTool from '@editorjs/image';

// helpers
import { convertEditorJSDataToAdminJS, convertAdminJSDataToEditorJS } from '../../helpers/editorjs-adminjs.js';

/** @type {import('adminjs').BasePropertyProps} */
const EditorJSEdit = (props) => {
  const { property, record, onChange } = props;
  const path = property?.path || property?.name;
  const holderId = `editorjs-${path}`;
  const editorRef = useRef(null);

  // Guards to prevent focus loss
  const hydratedOnceRef = useRef(false); // did we hydrate from server once?
  const fromEditorRef = useRef(false); // was the last change triggered by our onChange?
  const lastSentJSONRef = useRef(''); // last JSON we sent to AdminJS (to avoid redundant updates)
  const saveTimerRef = useRef(null); // debounce timer

  const storedBlocks = useMemo(
    () => convertAdminJSDataToEditorJS(record?.params || {}, 'description'),
    [record?.params, path]
  );
  const storedBlocksJSON = useMemo(() => JSON.stringify(storedBlocks), [storedBlocks]);

  // Init once
  useEffect(() => {
    const holderEl = document.getElementById(holderId);
    if (!holderEl) return;

    // @ts-ignore
    const editor = new EditorJS({
      holder: holderId,
      data: {
        // @ts-ignore
        blocks: storedBlocks?.length ? storedBlocks : [{ type: 'paragraph', data: { text: '' } }],
      },
      tools: {
        paragraph: Paragraph,
        header: Header,
        list: List,
        image: {
          class: ImageTool,
          config: {
            uploader: {
              async uploadByFile(file: File) {
                const form = new FormData();
                form.append('file', file);
                form.append('portfolioItemId', record?.params?.portfolioItemId);
                // http://localhost:3000/public-api
                const res = await fetch('/public-api/admin/api/editorjs/upload', {
                  method: 'POST',
                  body: form,
                  credentials: 'include',
                });

                if (!res.ok) throw new Error('Upload failed');
                const json = await res.json();
                return json; // must be { success: 1, file: { url, ... } }
              },
              // async uploadByUrl(url: string) {
              //   const res = await fetch("/admin/api/editorjs/fetch", {
              //     method: "POST",
              //     headers: { "Content-Type": "application/json" },
              //     credentials: "include",
              //     body: JSON.stringify({ url }),
              //   });
              //   if (!res.ok) throw new Error("Fetch failed");
              //   const json = await res.json();
              //   return json; // must be { success: 1, file: { url, ... } }
              // },
            },
          },
        },
      },
      async onChange() {
        // Debounce a little to reduce churn
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(async () => {
          try {
            const output = await editor.save();
            const blocks = output.blocks || [];
            const json = JSON.stringify(blocks);

            const adminJSData = convertEditorJSDataToAdminJS(blocks);

            // Avoid echo loops: only send if changed vs lastSent
            if (json !== lastSentJSONRef.current) {
              fromEditorRef.current = true; // mark that the next param change is ours
              lastSentJSONRef.current = json;
              onChange(path, adminJSData); // send JSON array; AdminJS will flatten
            }
          } catch (e) {
            // ignore
          }
        }, 150);
      },
    });

    editorRef.current = editor;
    return () => {
      if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
      editor?.destroy?.();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [holderId]);

  // Hydrate once when server value arrives, but don't clobber typing
  useEffect(() => {
    const editor = editorRef.current;
    if (!editor) return;

    // If this change came from our own onChange, skip re-render (prevents blur)
    if (fromEditorRef.current) {
      fromEditorRef.current = false;
      return;
    }

    // Only hydrate once per mount (handles async record load)
    if (!hydratedOnceRef.current) {
      hydratedOnceRef.current = true;
      const nextBlocks = JSON.parse(storedBlocksJSON);
      editor.isReady.then(() => editor.render({ blocks: nextBlocks.description.blocks })).catch(console.error);
    }
  }, [storedBlocksJSON]);

  return (
    <>
      <div style={{ border: '1px solid #D9D9D9', borderRadius: 6, padding: 8 }}>
        <div id={holderId} style={{ minHeight: 220 }} />
      </div>
      <style>
        {`
    #${holderId} .ce-header { font-weight: 600; line-height: 1.3; margin: 12px 0; }
    #${holderId} .ce-header[contenteditable="true"]:empty:before { content: 'Heading'; opacity: .4; }
  `}
      </style>
    </>
  );
};

export default EditorJSEdit;
