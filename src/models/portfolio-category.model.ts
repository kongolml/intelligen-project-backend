import { model, Schema } from 'mongoose';

export interface IPortfolioCategory {
  name: string;
}

export const PortfolioCategorySchema = new Schema<IPortfolioCategory>({
  name: { type: 'String', required: true },
});

export const PortfolioCategory = model<IPortfolioCategory>('PortfolioCategorie', PortfolioCategorySchema);
