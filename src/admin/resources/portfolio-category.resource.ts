// models
import { PortfolioCategory } from '../../models/portfolio-category.model.js';

export const portfolioCategoryResource = {
  resource: PortfolioCategory,
  options: {
    parent: {
      name: 'Portfolio',
      icon: 'Briefcase',
    },
    properties: {
      _id: { isVisible: false },
      name: { isRequired: true },
      slug: { isRequired: true },
      description: {
        // type: 'richtext',
        isRequired: true,
        isVisible: { list: false, show: true, edit: true, filter: false },
      },
    },
  },
};
