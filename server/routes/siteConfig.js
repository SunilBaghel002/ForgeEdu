const express = require('express');
const router = express.Router();
const SiteConfig = require('../models/SiteConfig');

// GET site config
router.get('/', async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = new SiteConfig();
      await config.save();
    }
    res.json(config);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// POST create site config
router.post('/', async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (config) {
      Object.assign(config, req.body);
      await config.save();
    } else {
      config = new SiteConfig(req.body);
      await config.save();
    }
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// PATCH update site config
router.patch('/', async (req, res) => {
  try {
    let config = await SiteConfig.findOne();
    if (!config) {
      config = new SiteConfig(req.body);
    } else {
      Object.assign(config, req.body);
    }
    await config.save();
    res.json(config);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
