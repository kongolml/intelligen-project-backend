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
      title: { isRequired: true },
      image: {
        isRequired: true,
        isArray: false,
        reference: 'MediaFile',
        isVisible: { list: false, show: true, edit: true, filter: false },
        // components: {
        //   list: Components.MediaFileCustomPage
        // }
      },
    },
  },
};
