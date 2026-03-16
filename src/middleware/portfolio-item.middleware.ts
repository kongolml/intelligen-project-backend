// models
import { PortfolioCategory } from '@models/portfolio-category.model.js';
import { PortfolioItem } from '@models/portfolio-item.model.js';

// middleware
import { prepareMediaFileForResponse } from './media-file.middleware.js';

// helpers
import { getMediaUrl } from '../helpers/url.js';

// constants
import { DEFAULT_LOCALE } from '../admin/constants.js';

/**
 * Extract a locale value from a Map field, with fallback to default locale.
 * Also handles legacy string values during transition.
 */
const getLocaleValue = (field: any, locale: string): string | undefined => {
  if (!field) return undefined;
  // Legacy string value (pre-migration)
  if (typeof field === 'string') return field;
  // Mongoose Map
  if (field instanceof Map) return field.get(locale) || field.get(DEFAULT_LOCALE);
  // Plain object (from lean queries)
  if (typeof field === 'object') return field[locale] || field[DEFAULT_LOCALE];
  return undefined;
};

const preparePortfolioItemForResponse = (portfolioItems: any, locale: string = DEFAULT_LOCALE) => {
    return portfolioItems.map((item) => ({
      id: item._id,
      title: getLocaleValue(item.name, locale),
      subtitle: getLocaleValue(item.subtitle, locale) || null,
      client: getLocaleValue(item.client, locale) || null,
      year: item.year || null,
      description: item.description,
      thumbnail: item.thumbnail ? item.thumbnail.url : null,
      categories: item.categories,
      mediaFiles: item.mediaFiles.map(prepareMediaFileForResponse),
      slug: item.slug,
      isShowcase: item.isShowcase
    }))
}

export const getPortfolioCategories = async () => {
    const allCategories = await PortfolioCategory.find({}, 'name slug description').sort({ name: 1 }).lean();

    return allCategories.map((category) => ({
        id: category._id,
        name: category.name,
        slug: category.slug,
        description: category.description
    }));
}

export const getPortfolioItems = async (locale: string = DEFAULT_LOCALE) => {
    const portfolioItems = await PortfolioItem.find({})
        .populate({
            path: 'mediaFiles thumbnail',
            select: 'bucket s3Key',
            options: {},
            transform: (doc: any) => ({
                id: doc._id.toString(),
                url: getMediaUrl(doc.bucket, doc.s3Key),
            })
        })
        .populate({
            path: 'categories',
            select: 'name slug description',
            transform: (doc: any) => ({
                name: doc.name,
                slug: doc.slug,
                description: doc.description
            })
        })
        .sort({ createdAt: -1 });

    return preparePortfolioItemForResponse(portfolioItems, locale);
}

export const getRandomDemoPortfolioItem = async (locale: string = DEFAULT_LOCALE) => {
    const portfolioCategories = await getPortfolioCategories();

    if (portfolioCategories.length === 0) {
        throw new Error('No portfolio categories found');
    }

    const randomPortfolioItemsPromises = portfolioCategories.map(async (category) => {
        const result = await PortfolioItem.aggregate([
            {
                $match: {
                    'categories': category.id,
                },
            },
            { $sample: { size: 1 } },
        ]);

        // optionally populate categories
        if (result[0]) {
            return await PortfolioItem.populate(result[0], [{
                path: 'categories',
                select: 'name',
            }, {
                path: 'mediaFiles thumbnail',
                select: 's3Key bucket',
                transform: (doc: any) => ({
                    id: doc._id.toString(),
                    url: getMediaUrl(doc.bucket, doc.s3Key),
                })
            }]);
        }

        return result[0] || null;
    });

    const portfolioItems = (await Promise.all(randomPortfolioItemsPromises)).filter(Boolean);

    return preparePortfolioItemForResponse(portfolioItems, locale).map((item) => {
        const itemWithoutMediaFiles = { ...item };
        delete itemWithoutMediaFiles.mediaFiles;
        return itemWithoutMediaFiles;
    });
}

export const getPortFolioShowcases = async (limit?: number, locale: string = DEFAULT_LOCALE) => {
    const portfolioItems = await PortfolioItem.find({
        isShowcase: true
    })
        .limit(limit)
        .populate({
            path: 'mediaFiles thumbnail',
            select: 'bucket s3Key',
            options: {},
            transform: (doc: any) => ({
                id: doc._id.toString(),
                url: getMediaUrl(doc.bucket, doc.s3Key),
            })
        })
        .populate({
            path: 'categories',
            select: 'name slug description',
            transform: (doc: any) => ({
                name: doc.name,
                slug: doc.slug,
                description: doc.description
            })
        })
        .sort({ createdAt: -1 });

    return preparePortfolioItemForResponse(portfolioItems, locale);
}

export const getPortfolioItemById = async (id: string, locale: string = DEFAULT_LOCALE) => {
    const portfolioItem = await PortfolioItem.findById(id)
        .populate({
                path: 'mediaFiles thumbnail',
                select: 's3Key bucket',
                transform: (doc: any) => ({
                    id: doc._id.toString(),
                    url: getMediaUrl(doc.bucket, doc.s3Key),
                })
            })
        .populate({
            path: 'categories',
            select: 'name',
        });

    if (!portfolioItem) {
        throw new Error('Portfolio item not found');
    }

    return preparePortfolioItemForResponse([portfolioItem], locale)[0];
}

export const getPortfolioItemBySlug = async (slug: string, locale: string = DEFAULT_LOCALE) => {
    const portfolioItem = await PortfolioItem.findOne({ slug })
        .populate({
                path: 'mediaFiles thumbnail',
                select: 's3Key bucket',
                transform: (doc: any) => ({
                    id: doc._id.toString(),
                    url: getMediaUrl(doc.bucket, doc.s3Key),
                })
            })
        .populate({
            path: 'categories',
            select: 'name slug description',
            transform: (doc: any) => ({
                name: doc.name,
                slug: doc.slug,
                description: doc.description
            })
        })
        .lean();

    if (!portfolioItem) {
        throw new Error('Portfolio item not found');
    }

    return preparePortfolioItemForResponse([portfolioItem], locale)[0];
}
