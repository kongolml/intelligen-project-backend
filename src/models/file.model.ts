import mongoose, { model, Schema } from 'mongoose';
import { getMediaUrl } from '../helpers/url.js';

interface IMediaFile {
  s3Key: string;
  bucket: string;
  mime: string;
  name?: string;
  originalName?: string;
  size?: number;
  portfolioItems?: mongoose.Types.ObjectId[];
  metadata?: Record<string, unknown>;
}

const MediaFileSchema = new Schema<IMediaFile>({
  s3Key: { type: String, required: false }, // TODO: resolve thise somehow. for now: required is false, otherwise we fail validation during file upload
  bucket: { type: String, required: false }, // TODO: resolve thise somehow. for now: required is false, otherwise we fail validation during file upload
  mime: { type: String, required: false }, // TODO: resolve thise somehow. for now: required is false, otherwise we fail validation during file upload
  name: { type: String, required: false },
  originalName: { type: String, required: false },
  size: { type: Number, required: false },
  portfolioItems: [{ type: Schema.Types.ObjectId, ref: 'PortfolioItem' }],
  metadata: { type: Schema.Types.Mixed },
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

MediaFileSchema.index({ portfolioItems: 1 });
MediaFileSchema.index({ mime: 1 });

export const MediaFile = model<IMediaFile>('MediaFile', MediaFileSchema);