const express = require('express');
const router = express.Router();
const { getTransactions } = require('../controllers/salesController');

router.get('/transactions', getTransactions);

module.exports = router;