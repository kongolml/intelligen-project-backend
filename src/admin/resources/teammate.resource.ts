// models
import { Teammate } from '@/models/teammate.model.js';

export const teammateResource = {
  resource: Teammate,
  options: {
    parent: {
      name: 'Portfolio',
      icon: 'Briefcase',
    },
    properties: {
      _id: { isVisible: false },
      name: { isRequired: true },
      title: { isRequired: true }
    },
  },
};
