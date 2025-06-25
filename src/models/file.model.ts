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
});

export const MediaFile = model<IMediaFile>('MediaFile', MediaFileSchema);