// admin/components/EditorJSShow.jsx
import React from 'react';

/** @type {import('adminjs').BasePropertyProps} */
const EditorJSShow = (props) => {
  const { property, record } = props;
  const path = property?.path || property?.name;

  const blocks = getBlocks(record, path);

  if (!blocks.length) return <div style={{ opacity: 0.6 }}>No content</div>;

  return (
    <div>
      {blocks.map((b, i) => {
        if (b.type === 'header') {
          const Tag = `h${b.data?.level || 2}`;
        //   @ts-ignore
          return <Tag key={i} dangerouslySetInnerHTML={{ __html: b.data?.text || '' }} />;
        }
        if (b.type === 'paragraph') {
          return <p key={i} dangerouslySetInnerHTML={{ __html: b.data?.text || '' }} />;
        }
        if (b.type === 'list') {
          const items = b.data?.items || [];
          return b.data?.style === 'ordered' ? (
            <ol key={i}>
              {items.map((it, k) => <li key={k} dangerouslySetInnerHTML={{ __html: it }} />)}
            </ol>
          ) : (
            <ul key={i}>
              {items.map((it, k) => <li key={k} dangerouslySetInnerHTML={{ __html: it }} />)}
            </ul>
          );
        }
        // fallback
        return (
          <pre key={i} style={{ background: '#f7f7f7', padding: 8, borderRadius: 6 }}>
            {JSON.stringify(b, null, 2)}
          </pre>
        );
      })}
    </div>
  );
};

export default EditorJSShow;

// -------- helpers --------
function getBlocks(record, path) {
  const val = record?.params?.[path];
  if (Array.isArray(val)) return val;
  if (typeof val === 'string') {
    try {
      const parsed = JSON.parse(val);
      if (Array.isArray(parsed)) return parsed;
      if (parsed && Array.isArray(parsed.blocks)) return parsed.blocks;
    } catch {}
    return [];
  }
  if (val && Array.isArray(val.blocks)) return val.blocks;

  // Unflatten AdminJS params (e.g., "description.0.data.text")
  const params = record?.params || {};
  const prefix = `${path}.`;
  const acc = [];
  for (const [k, v] of Object.entries(params)) {
    if (!k.startsWith(prefix)) continue;
    const rest = k.slice(prefix.length);
    const m = rest.match(/^(\d+)\.(.+)$/);
    if (!m) continue;
    const idx = Number(m[1]);
    const trail = m[2].split('.');
    acc[idx] = acc[idx] || {};
    setDeep(acc[idx], trail, v);
  }
  return acc.filter(Boolean);
}

function setDeep(obj, parts, value) {
  let o = obj;
  for (let i = 0; i < parts.length - 1; i++) {
    const p = parts[i];
    if (o[p] == null || typeof o[p] !== 'object') o[p] = {};
    o = o[p];
  }
  o[parts[parts.length - 1]] = value;
}
