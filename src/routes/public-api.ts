import express from 'express';

// middleware
import { getPortfolioCategories, getPortfolioItems, getRandomDemoPortfolioItem } from '../middleware/portfolio-item.middleware.js';

const router = express.Router();

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
    const formattedItems = await getPortfolioItems()
    res.json(formattedItems);
  } catch (err) {
    console.error('Error fetching portfolio items', err);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/portfolio/random-demo', async (req, res) => {
    try {
        const portfolioItems = await getRandomDemoPortfolioItem();

        res.json(portfolioItems);
    } catch (err) {
        console.error('Error fetching portfolio random-demo items', err);
        res.status(500).json({ error: 'Internal server error' });
    }
});

export default router;
