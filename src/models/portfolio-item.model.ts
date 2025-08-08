import mongoose, { model, Schema } from 'mongoose';

export interface IPortfolioItem {
  name: string;
  description: string;
  categories: mongoose.Schema.Types.ObjectId[];
  thumbnail?: mongoose.Schema.Types.ObjectId;
  mediaFiles?: mongoose.Schema.Types.ObjectId[];
  slug: string; // url name slug
  isShowcase?: boolean;
}

export const PortfolioItemSchema = new Schema<IPortfolioItem>(
  {
    name: { type: String, required: true },
    description: { type: String },
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'PortfolioCategory' }],
    thumbnail: { type: mongoose.Schema.Types.ObjectId, ref: 'MediaFile' },
    mediaFiles: [{ type: mongoose.Schema.Types.ObjectId, ref: 'MediaFile' }],
    slug: { type: String, required: true, unique: true },
    isShowcase: { type: Boolean, required: false, default: undefined}
  },
  {
    timestamps: true,
    collection: 'portfolio_items',
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
  },
);

// Indexes for better performance
PortfolioItemSchema.index({ slug: 1 }); // Single field index for slug lookups
// PortfolioItemSchema.index({ isShowcase: 1 }); // Index for showcase filtering
// PortfolioItemSchema.index({ categories: 1 }); // Index for category-based queries
// PortfolioItemSchema.index({ createdAt: -1 }); // Index for sorting by creation date

export const PortfolioItem = model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);
