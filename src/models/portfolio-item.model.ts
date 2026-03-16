import mongoose, { model, Schema } from 'mongoose';

export interface IPortfolioItem {
  name: { en?: string; uk?: string };
  subtitle?: { en?: string; uk?: string };
  client?: { en?: string; uk?: string };
  year?: number;
  description: [Schema.Types.Mixed];
  categories: mongoose.Schema.Types.ObjectId[];
  thumbnail?: mongoose.Schema.Types.ObjectId;
  mediaFiles?: mongoose.Schema.Types.ObjectId[];
  slug: string; // url name slug
  isShowcase?: boolean;
}

export const PortfolioItemSchema = new Schema<IPortfolioItem>(
  {
    name: { type: { en: String, uk: String }, required: true },
    subtitle: { type: { en: String, uk: String } },
    client: { type: { en: String, uk: String } },
    year: { type: Number },
    description: { type: [Schema.Types.Mixed] },
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

export const PortfolioItem = model<IPortfolioItem>('PortfolioItem', PortfolioItemSchema);
