import mongoose, { model, Schema } from 'mongoose';

interface IMediaFile {
  s3Key: string;
  bucket: string;
  mime: string;
  portfolioItems: mongoose.Schema.Types.ObjectId[];
}

const MediaFileSchema = new Schema<IMediaFile>({
  s3Key: { type: String, required: true },
  bucket: { type: String, required: true },
  mime: { type: String, required: true },
  portfolioItems: [{ type: Schema.Types.ObjectId, ref: 'PortfolioItem' }],
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual to get file URL
// MediaFileSchema.virtual('url').get(function() {
//   return `https://${this.bucket}.${process.env.DIGITALOCEAN_SPACE_ENDPOINT}/${this.s3Key}`;
// });

// Indexes for better performance
MediaFileSchema.index({ portfolioItems: 1 });
MediaFileSchema.index({ mime: 1 });

export const MediaFile = model<IMediaFile>('MediaFile', MediaFileSchema);