import { model, Schema } from 'mongoose';

export interface IPortfolioCategory {
  name: string;
  description?: string; // Optional field for future use
}

export const PortfolioCategorySchema = new Schema<IPortfolioCategory>({
  name: { type: 'String', required: true },
  description: { type: 'String', required: false },
});

export const PortfolioCategory = model<IPortfolioCategory>('PortfolioCategory', PortfolioCategorySchema);
