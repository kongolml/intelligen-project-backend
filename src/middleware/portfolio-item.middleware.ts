// models
import { PortfolioCategory } from '@models/portfolio-category.model.js';
import { PortfolioItem } from '@models/portfolio-item.model.js';

// middleware
import { prepareMediaFileForResponse } from './media-file.middleware.js';

const preparePortfolioItemForResponse = (portfolioItems: any) => {
    return portfolioItems.map((item) => ({
      id: item._id,
      title: item.name,
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

export const getPortfolioItems = async () => {
    const portfolioItems = await PortfolioItem.find({})
    //   .populate('name')
    //   .populate({
    //     path: 'mediaFiles',
    //     options: { lean: { virtuals: true } }
    //   })
        .populate({
            path: 'mediaFiles thumbnail',
            // ⚠️ DO NOT use `select: 'url'` — `url` is virtual, not a real field
            select: 'bucket s3Key', // required for computing `url`
            options: {}, // no lean here — it's already lean on root
            transform: (doc: any) => ({
                id: doc._id.toString(),
                url: `https://${doc.bucket}.fra1.digitaloceanspaces.com/${doc.s3Key}` // manual virtual substitute
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

    return preparePortfolioItemForResponse(portfolioItems);
}

export const getRandomDemoPortfolioItem = async () => {
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
                    url: `https://${doc.bucket}.${process.env.DIGITALOCEAN_SPACE_REGION}.digitaloceanspaces.com/${doc.s3Key}` // manual virtual substitute
                })
            }]);
        }

        return result[0] || null;
    });

    const portfolioItems = (await Promise.all(randomPortfolioItemsPromises)).filter(Boolean);

    return preparePortfolioItemForResponse(portfolioItems).map((item) => {
        const itemWithoutMediaFiles = { ...item };
        delete itemWithoutMediaFiles.mediaFiles;
        return itemWithoutMediaFiles;
    });
}

export const getPortFolioShowcases = async (limit?: number) => {
    const portfolioItems = await PortfolioItem.find({
        isShowcase: true
    })
    //   .populate('name')
    //   .populate({
    //     path: 'mediaFiles',
    //     options: { lean: { virtuals: true } }
    //   })
        .limit(limit)
        .populate({
            path: 'mediaFiles thumbnail',
            // ⚠️ DO NOT use `select: 'url'` — `url` is virtual, not a real field
            select: 'bucket s3Key', // required for computing `url`
            options: {}, // no lean here — it's already lean on root
            transform: (doc: any) => ({
                id: doc._id.toString(),
                url: `https://${doc.bucket}.fra1.digitaloceanspaces.com/${doc.s3Key}` // manual virtual substitute
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

    return preparePortfolioItemForResponse(portfolioItems);
}

export const getPortfolioItemById = async (id: string) => {
    const portfolioItem = await PortfolioItem.findById(id)
        .populate({
                path: 'mediaFiles thumbnail',
                select: 's3Key bucket',
                transform: (doc: any) => ({
                    id: doc._id.toString(),
                    url: `https://${doc.bucket}.${process.env.DIGITALOCEAN_SPACE_REGION}.digitaloceanspaces.com/${doc.s3Key}` // manual virtual substitute
                })
            })
        .populate({
            path: 'categories',
            select: 'name',
        });

    if (!portfolioItem) {
        throw new Error('Portfolio item not found');
    }

    return preparePortfolioItemForResponse([portfolioItem])[0];
}