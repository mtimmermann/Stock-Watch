'use strict';

var https = require('https');

// GET /api/stocks/:stockCode
exports.getStocks = function(req, res, next) {

  if (!process.env.QUANDL_API_KEY) {
    return res.status(409).send('QUANDL_API_KEY environement variable is required, set with node env variable');
  }

  getStocksData(getQuandlUrl(req.params.stockCode), function(err, dataset) {
    if (err) return next(err);
    else if (!dataset) {
      return res.status(500).send('Error, no data found');
    } else if (dataset.quandl_error) {
      var err = dataset.quandl_error.message || 'Quandl error';
      return res.status(409).send(err);
    }

    res.setHeader('Content-Type', 'application/json');
    dataset = parseQuandlData(dataset);
    return res.json(dataset);
  });
};

function getQuandlUrl (stockCode) {
  var now = new Date();
  var year = now.getFullYear();
  var month = now.getMonth() + 1;
  var date = now.getDate();

  return 'https://www.quandl.com/api/v3/datasets/WIKI/'+ stockCode +'.json' +
    '?start_date='+ (year - 1) +'-'+ (month -1) +'-'+ date +'&order=asc'+
    '&api_key='+ process.env.QUANDL_API_KEY;
}

function parseQuandlData(raw) {
  var dataset = {
    stockCode: raw.dataset.dataset_code,
    companyName: raw.dataset.name,
    data: []
  };

  var dateIndex = raw.dataset.column_names.indexOf("Date");
  var closeIndex = raw.dataset.column_names.indexOf("Close");
  raw.dataset.data.forEach(function(dataRow, index) {
    var textDate = dataRow[dateIndex];
    dataset.data.push([Date.parse(textDate), dataRow[closeIndex]]);
  });

  return dataset;
}

function getStocksData(url, callback) {

  https.get(url, (res) => {
    //console.log('statusCode:', res.statusCode);
    //console.log('headers:', res.headers);
    var data = '';
    res.on('data', (chunk) => {
      data += chunk;
    });

    res.on('end', function() {
      data = JSON.parse(data);
      callback(null, data);
    });

    res.resume();

  }).on('error', (e) => {
    callback(e);
  });
}

