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

import { uploadFileAndCreateDbRecord } from '../helpers/import.js';

const router = express.Router();
const upload = multer({ storage: multer.memoryStorage() });

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
    const formattedItems = await getPortfolioItems();
    res.json(formattedItems);
  } catch (err) {
    console.error('Error fetching portfolio items', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/portfolio/showcases', async (req, res) => {
  try {
    const portfolioItems = await getPortFolioShowcases(8);

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

  try {
    // const portfolioItems = await getPortfolioItemById(id);
    // const item = portfolioItems.find((item) => item.id === id);

    const item = await getPortfolioItemBySlug(slug);

    if (!item) {
      return res.status(404).json({ error: 'Portfolio item not found' });
    }

    res.json(item);
  } catch (err) {
    console.error('Error fetching portfolio item', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/admin/api/editorjs/upload', upload.single("file"), async (req: Request & { file?: any }, res: Response) => {
  // const { file } = req.body;
  if (!req.file) return res.status(400).json({ success: 0, error: "No file" });

    const buffer = req.file.buffer;
    const contentType = req.file.mimetype || "application/octet-stream";
    const originalFilename = req.file.originalname;

    // Optional: probe image size
    // let width: number | undefined;
    // let height: number | undefined;
    // try {
    //   const meta = await sharp(buffer).metadata();
    //   width = meta.width;
    //   height = meta.height;
    // } catch {}

    // Upload to DO Spaces
    const { key: s3Key, url: imageUrl } = await uploadFileAndCreateDbRecord(
      buffer,
      contentType,
      req.body.portfolioItemId,
      originalFilename,
    );
  console.log(req);
  // const mediaFile = await createMediaFile(file);
  // res.json({"test": "testadsf", key: s3Key, url: imageUrl});
  res.json({ success: 1, file: { url: imageUrl, key: s3Key } });
});

export default router;
