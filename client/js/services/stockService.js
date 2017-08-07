'use strict';

var app = app || {};
app.stockService = app.stockService || {};

(function ($) {
  var self = app.stockService;

  /**
   * Retrieve daily stock data for a company stock
   * @param {string} stockName The stock code name (e.g. 'MSFT')
   * @param {function} callback (err, data) 
            The function that is called after a service call
            error {object}: null if no error
            data {object}: The data set of a succesful call
   */
  self.getStocks = function(stockName, callback) {
    if (typeof stockName !== 'string') throw new Error('stockName must be a string');
    if (!$.isFunction(callback)) throw new Error('callback function is required');

    $.getJSON('/api/stocks/'+ stockName
      ).done(function(data) {
        return callback(null, data);
      }).fail(function(jqxhr, textStatus, error) {
        return callback(error);
      });
  };


  self.getStocksCanned = function(stockName, callback) {
    if (typeof stockName !== 'string') throw new Error('stockName must be a string');
    if (!$.isFunction(callback)) throw new Error('callback function is required');

    $.getJSON('/api/stocks/canned/'+ stockName
      ).done(function(data) {
        return callback(null, data);
      }).fail(function(jqxhr, textStatus, error) {
        return callback(error);
      });
  };


  // --------------------------------------------------------------------------------------

  /**
   * Retrieve daily stock data for a company stock
   * @param {string} stockName The stock code name (e.g. 'MSFT')
   * @param {function} callback (err, data) 
            The function that is called after a service call
            error {object}: null if no error
            data {object}: The data set of a succesful call
   */
  // self.getStockDataFromHighCharts = function(stockName, callback) {
  //   if (typeof stockName !== 'string') throw new Error('stockName must be a string');
  //   if (!$.isFunction(callback)) throw new Error('callback function is required');

  //   var query = '?filename='+ stockName.toLowerCase() +'-c.json&callback=?';
  //   var url = 'https://www.highcharts.com/samples/data/jsonp.php'+ query;
  //   $.getJSON(url
  //     ).done(function(data) {
  //       var dataset = {
  //         stockCode: stockName.toUpperCase(),
  //         companyName: '',
  //         data: data
  //       };
  //       callback(null, dataset);
  //     }).fail(function(jqxhr, textStatus, error) {
  //       callback(error);
  //     });
  // };

}(jQuery));


