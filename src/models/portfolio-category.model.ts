import { model, Schema } from 'mongoose';

export interface IPortfolioCategory {
  name: string;
  slug: string;
  description: string;
}

export const PortfolioCategorySchema = new Schema<IPortfolioCategory>({
  name: { type: 'String', required: true },
  slug: { type: 'String', required: true, unique: true },
  description: { type: 'String', required: true },
}, {
  collection: 'portfolio_categories',
});

export const PortfolioCategory = model<IPortfolioCategory>('PortfolioCategory', PortfolioCategorySchema);
