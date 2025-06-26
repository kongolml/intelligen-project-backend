import mongoose, { model, Schema } from 'mongoose';

export interface IPortfolioItem {
  title: string;
  description: string;
  categories: mongoose.Schema.Types.ObjectId[];
  mediaFiles: mongoose.Schema.Types.ObjectId[];
}

export const PortfolioItemSchema = new Schema<IPortfolioItem>(
  {
    title: { type: String, required: true },
    description: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioCategory' }],
    mediaFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MediaFile' }]
  },
  { timestamps: true }
);

export const PortfolioItem = model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);
