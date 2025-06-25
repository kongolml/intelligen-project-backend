import mongoose, { model, Schema } from 'mongoose';

export interface IPortfolioItem {
  title: string;
  description: string;
  categories: mongoose.Schema.Types.ObjectId[];
  mediaFiles: {
    fileId: string;
    order: number;
    isThumbnail: boolean;
  }[];
}

export const PortfolioItemSchema = new Schema<IPortfolioItem>(
  {
    title: { type: String, required: true },
    description: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioCategorie', required: false }],
    mediaFiles: [{
      fileId: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaFile' },
      order: { type: Number, default: 0 },
      isThumbnail: { type: Boolean, default: false }
    }]
  },
  { timestamps: true }
);

export const PortfolioItem = model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);
