import path from 'path';

export const generateDateBasedPath = (category, recordId = null, filename) => {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');

  // Clean filename - remove special characters
  const ext = path.extname(filename);
  const baseName = path
    .basename(filename, ext)
    .toLowerCase()
    .replace(/[^a-z0-9]/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, ''); // trim dashes from start/end

  // Generate unique filename with timestamp
  const timestamp = Date.now();
  const cleanFilename = `${timestamp}-${baseName}${ext}`;

  // Create path structure
  if (recordId) {
    return `${category}/${year}/${month}/${day}/${recordId}/${cleanFilename}`;
  } else {
    return `${category}/${year}/${month}/${day}/${cleanFilename}`;
  }
}
