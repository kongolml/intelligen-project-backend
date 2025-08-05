import { ComponentLoader } from 'adminjs';
// import MediaFileCustomPage from './components/MediaFileCustomPage.js';

const componentLoader = new ComponentLoader();

const Components = {
    MediaFileCustomPage: componentLoader.add('MediaFileCustomPage', './components/MediaFileCustomPage.tsx'),
    CategoriesList: componentLoader.add('CategoriesList', './components/CategoriesList.tsx'),
    // other custom components
}

// export default componentLoader;
export { componentLoader, Components };
