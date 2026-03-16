import express, { Request, Response } from 'express';
import multer from "multer";

// middleware
import {
  getPortfolioCategories,
  getPortfolioItems,
  getRandomDemoPortfolioItem,
  getPortfolioItemById,
  getPortfolioItemBySlug,
  getPortFolioShowcases
} from '../middleware/portfolio-item.middleware.js';

import { getTeammates } from '../middleware/teammates.middleware.js';

import { uploadFileAndCreateDbRecord } from '../helpers/import.js';

const router = express.Router();

const ALLOWED_IMAGE_MIMES = ['image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml'];

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB
});

router.get('/portfolio-categories', async (req, res) => {
  try {
    const allCategories = await getPortfolioCategories();
    res.json(allCategories);
  } catch (err) {
    console.error('Error fetching portfolio categories', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/portfolio', async (req, res) => {
  try {
    const locale = req.query.locale as string | undefined;
    const formattedItems = await getPortfolioItems(locale);
    res.json(formattedItems);
  } catch (err) {
    console.error('Error fetching portfolio items', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/portfolio/showcases', async (req, res) => {
  try {
    const locale = req.query.locale as string | undefined;
    const portfolioItems = await getPortFolioShowcases(8, locale);

    res.json(portfolioItems);
  } catch (err) {
    console.error('Error fetching portfolio random-demo items', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// router.get('/portfolio/random-demo', async (req, res) => {
//   try {
//     const portfolioItems = await getRandomDemoPortfolioItem();

//     res.json(portfolioItems);
//   } catch (err) {
//     console.error('Error fetching portfolio random-demo items', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

// router.get('/portfolio/:id', async (req, res) => {
//   const { id } = req.params;

//   try {
//     // const portfolioItems = await getPortfolioItemById(id);
//     // const item = portfolioItems.find((item) => item.id === id);

//     const item = await getPortfolioItemById(id);

//     if (!item) {
//       return res.status(404).json({ error: 'Portfolio item not found' });
//     }

//     res.json(item);
//   } catch (err) {
//     console.error('Error fetching portfolio item', err);
//     res.status(500).json({ error: 'Internal server error' });
//   }
// });

router.get('/portfolio/:slug', async (req, res) => {
  const { slug } = req.params;
  const locale = req.query.locale as string | undefined;

  try {
    const item = await getPortfolioItemBySlug(slug, locale);

    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error('Error fetching portfolio item', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post(
  '/admin/api/editorjs/upload',
  upload.single('file'),
  async (req: Request & { file?: any; session?: any }, res: Response) => {
    if (!req.session?.adminUser) {
      return res.status(401).json({ success: 0, error: 'Unauthorized' });
    }

    if (!req.file) return res.status(400).json({ success: 0, error: 'No file' });

    if (!ALLOWED_IMAGE_MIMES.includes(req.file.mimetype)) {
      return res.status(400).json({
        success: 0,
        error: `Invalid file type: ${req.file.mimetype}. Allowed: ${ALLOWED_IMAGE_MIMES.join(', ')}`,
      });
    }

    const { buffer, mimetype: contentType, originalname: originalFilename } = req.file;

    const { key: s3Key, url: imageUrl } = await uploadFileAndCreateDbRecord(
      buffer,
      contentType,
      req.body.portfolioItemId,
      originalFilename,
    );

    return res.json({ success: 1, file: { url: imageUrl, key: s3Key } });
  },
);

router.get('/teammates', async (req, res) => {
  const teammates = await getTeammates();
  res.json(teammates);
});

export default router;
