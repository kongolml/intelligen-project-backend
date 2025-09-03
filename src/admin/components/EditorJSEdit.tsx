// admin/components/EditorJSEdit.jsx
import React, { useEffect, useMemo, useRef } from 'react';
import EditorJS from '@editorjs/editorjs';
import Paragraph from '@editorjs/paragraph';
import Header from '@editorjs/header';
import List from '@editorjs/list';

/** @type {import('adminjs').BasePropertyProps} */
const EditorJSEdit = (props) => {
  const { property, record, onChange } = props;
  const path = property?.path || property?.name;
  const holderId = `editorjs-${path}`;
  const editorRef = useRef(null);

  // Guards to prevent focus loss
  const hydratedOnceRef = useRef(false);      // did we hydrate from server once?
  const fromEditorRef = useRef(false);        // was the last change triggered by our onChange?
  const lastSentJSONRef = useRef('');         // last JSON we sent to AdminJS (to avoid redundant updates)
  const saveTimerRef = useRef(null);          // debounce timer

  // Unflatten AdminJS params like "description.0.data.text" -> blocks[0].data.text
  const unflattenBlocks = (params, basePath) => {
    if (!params) return [];
    const re = new RegExp(`^${escapeRegExp(basePath)}\\.(\\d+)\\.(.+)$`);
    const acc = [];
    for (const [k, v] of Object.entries(params)) {
      const m = k.match(re);
      if (!m) continue;
      const idx = Number(m[1]);
      const tail = m[2].split('.');
      acc[idx] = acc[idx] || {};
      setDeep(acc[idx], tail, v);
    }
    return acc.filter(Boolean);
  };
  const setDeep = (obj, parts, value) => {
    let o = obj;
    for (let i = 0; i < parts.length - 1; i++) {
      const p = parts[i];
      o[p] = o[p] ?? {};
      o = o[p];
    }
    o[parts[parts.length - 1]] = value;
  };
  const escapeRegExp = (s) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

  const storedBlocks = useMemo(
    () => unflattenBlocks(record?.params || {}, path),
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
        blocks: storedBlocks?.length ? storedBlocks : [{ type: 'paragraph', data: { text: '' } }],
      },
      tools: {
        paragraph: Paragraph,
        header: Header,
        list: List,
      },
      async onChange() {
        // Debounce a little to reduce churn
        if (saveTimerRef.current) clearTimeout(saveTimerRef.current);
        saveTimerRef.current = setTimeout(async () => {
          try {
            const output = await editor.save();
            const blocks = output.blocks || [];
            const json = JSON.stringify(blocks);

            // Avoid echo loops: only send if changed vs lastSent
            if (json !== lastSentJSONRef.current) {
              fromEditorRef.current = true;         // mark that the next param change is ours
              lastSentJSONRef.current = json;
              onChange(path, blocks);               // send JSON array; AdminJS will flatten
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
      editor.isReady
        .then(() => editor.render({ blocks: nextBlocks }))
        .catch(() => {});
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
</style></>
    
  );
};

export default EditorJSEdit;
