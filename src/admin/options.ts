import { AdminJSOptions } from 'adminjs';

import { componentLoader } from './component-loader.js';

// resources
import { portfolioCategoryResource } from './resources/portfolio-category.resource.js';
import { portfolioItemResource } from './resources/portfolio-item.resource.js';
import { mediaFileResource } from './resources/media-item.resource.js';
import { teammateResource } from './resources/teammate.resource.js';

const options: AdminJSOptions = {
  componentLoader,
  rootPath: '/admin',
  resources: [portfolioCategoryResource, portfolioItemResource, mediaFileResource, teammateResource],
  databases: [],
};

export default options;
