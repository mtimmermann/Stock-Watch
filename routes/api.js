var express = require('express');
var router = express.Router();

var stockController = require('../api/controllers/stockController');

// GET /api/stocks/:id
router.get('/stocks/:stockCode', stockController.getStocks);

// GET /api/stocks/canned/:id
router.get('/stocks/canned/:stockCode', stockController.getStocksCanned);

module.exports = router;
