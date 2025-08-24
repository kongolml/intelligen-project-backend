import { ComponentLoader } from 'adminjs';
// import MediaFileCustomPage from './components/MediaFileCustomPage.js';

const componentLoader = new ComponentLoader();

const Components = {
    MediaFileCustomPage: componentLoader.add('MediaFileCustomPage', './components/MediaFileCustomPage.tsx'),
    CategoriesList: componentLoader.add('CategoriesList', './components/CategoriesList.tsx'),
    EditorJSEdit: componentLoader.add('EditorJSEdit', './components/EditorJSEdit'),
    EditorJSShow: componentLoader.add('EditorJSShow', './components/EditorJSShow'),

    // other custom components
}

// export default componentLoader;
export { componentLoader, Components };
