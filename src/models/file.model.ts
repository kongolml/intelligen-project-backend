import mongoose, { model, Schema } from 'mongoose';
import { getMediaUrl } from '../helpers/url.js';

interface IMediaFile {
  s3Key: string;
  bucket: string;
  mime: string;
  name?: string;
  // portfolioItems: mongoose.Schema.Types.ObjectId[];
}

const MediaFileSchema = new Schema<IMediaFile>({
  s3Key: { type: String, required: false }, // TODO: resolve thise somehow. for now: required is false, otherwise we fail validation during file upload
  bucket: { type: String, required: false }, // TODO: resolve thise somehow. for now: required is false, otherwise we fail validation during file upload
  mime: { type: String, required: false }, // TODO: resolve thise somehow. for now: required is false, otherwise we fail validation during file upload
  // portfolioItems: [{ type: Schema.Types.ObjectId, ref: 'PortfolioItem' }],
  name: { type: String, required: false },
}, {
  timestamps: true,
  collection: 'media_files',
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get file URL
MediaFileSchema.virtual('url').get(function() {
  return getMediaUrl(this.bucket, this.s3Key);
});

// Indexes for better performance
// MediaFileSchema.index({ portfolioItems: 1 });
// MediaFileSchema.index({ mime: 1 });

export const MediaFile = model<IMediaFile>('MediaFile', MediaFileSchema);