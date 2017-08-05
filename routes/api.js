var express = require('express');
var router = express.Router();

var stockController = require('../api/controllers/stockController');

// GET /api/stocks/:id
router.get('/stocks/:stockCode', stockController.getStocks);

module.exports = router;
