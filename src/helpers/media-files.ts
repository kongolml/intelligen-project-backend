import path from 'path';
import mongoose from 'mongoose';

import { MediaFile } from '../models/file.model.js';
import { PortfolioItem } from '../models/portfolio-item.model.js';

export const generateDateBasedPath = (recordId = null, filename) => {
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
  // if (recordId && recordId !== 'temp') {
    // return `portfolio/${year}/${month}/${day}/${recordId}/${cleanFilename}`;
  // } else {
    return `portfolio/${year}/${month}/${day}/${cleanFilename}`;
  // }
}

export async function handleMediaFileCreation(response: any, request: any, context: any) {
  try {
    console.log('🔄 Processing uploaded files...');
    console.log('📋 Response:', response);
    
    if (!response.record) {
      console.log('❌ No record found');
      return response;
    }

    const portfolioItemId = response.record.id;
    console.log('📋 Portfolio Item ID:', portfolioItemId);

    // Get uploaded files from the record params
    const uploadedFiles = response.record.params.mediaFiles;
    console.log('📁 Uploaded files:', uploadedFiles);

    if (!uploadedFiles) {
      console.log('ℹ️ No files uploaded');
      return response;
    }

    // Handle single file or array of files
    const files = Array.isArray(uploadedFiles) ? uploadedFiles : [uploadedFiles];

    for (const fileData of files) {
      if (fileData && (fileData.s3Key || fileData.key)) {
        try {
          console.log('📄 Processing file:', fileData);

          // Create MediaFile record
          const mediaFileData = {
            s3Key: fileData.s3Key || fileData.key,
            bucket: fileData.bucket || process.env.DIGITALOCEAN_SPACE_BUCKET,
            mime: fileData.mime || fileData.mimeType || 'application/octet-stream',
            // portfolioItems: [new mongoose.Types.ObjectId(portfolioItemId)]
          };

          const mediaFile = new MediaFile(mediaFileData);
          await mediaFile.save();
          console.log('✅ MediaFile created:', mediaFile._id);

          // Add to PortfolioItem's mediaFiles array
          await PortfolioItem.findByIdAndUpdate(
            portfolioItemId,
            {
              $addToSet: { // Use $addToSet to avoid duplicates
                mediaFiles: mediaFile._id
              }
            }
          );
          console.log('✅ MediaFile linked to PortfolioItem');

        } catch (error) {
          console.error('❌ Error processing file:', error);
        }
      }
    }

  } catch (error) {
    console.error('❌ Error in handleMediaFileCreation:', error);
  }

  return response;
}