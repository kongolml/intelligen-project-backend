import { ComponentLoader } from 'adminjs';
// import MediaFileCustomPage from './components/MediaFileCustomPage.js';

const componentLoader = new ComponentLoader();

const Components = {
    MediaFileCustomPage: componentLoader.add('MediaFileCustomPage', './components/MediaFileCustomPage.tsx'),
    CategoriesList: componentLoader.add('CategoriesList', './components/CategoriesList.tsx'),
    EditorJSEdit: componentLoader.add('EditorJSEdit', './components/EditorJSEdit'),
    EditorJSShow: componentLoader.add('EditorJSShow', './components/EditorJSShow'),

    TranslatableEdit: componentLoader.add('TranslatableEdit', './components/TranslatableEdit'),
    TranslatableShow: componentLoader.add('TranslatableShow', './components/TranslatableShow'),

    ViewOnSiteLink: componentLoader.add('ViewOnSiteLink', './components/ViewOnSiteLink'),

    ThumbnailUpload: componentLoader.add('ThumbnailUpload', './components/ThumbnailUpload'),
    ThumbnailShow: componentLoader.add('ThumbnailShow', './components/ThumbnailShow'),

    // other custom components
}

// export default componentLoader;
export { componentLoader, Components };
