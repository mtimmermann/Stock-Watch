'use strict';

var app = app || {};
var Highcharts = Highcharts || {};

(function ($) {

  var seriesOptions = null,
      stockNames = ['MSFT', 'AAPL', 'GOOG', 'IBM'];

  var svcGetStocks = app.stockService.getStocks;
  //var svcGetStocks = app.stockService.getStocks1;                 // From Quandl (static)
  //var svcGetStocks = app.stockService.getStocks2;                 // From Quandl
  //var svcGetStocks = app.stockService.getStockDataFromHighCharts; // From highcharts


  /**
   * Adds a stock code name to the stock watch chart
   * @param {string} name The stock code name (e.g. 'MSFT')
   * @param {function} callback (err) 
            The function that is called after a service call
            error {object}: null if no error
   */
  app.addStockName = function(stockName, callback) {
    stockName = stockName.toUpperCase();

    if (stockNames.indexOf(stockName) === -1) {
      //app.stockService.getStocks(stockName, function(err, data) {
      svcGetStocks(stockName, function(err, data) {
        if (err) {
          callback(err);
        } else {
          stockNames.push(stockName);
          app.init();
          callback(null);
        }
      });
    }
  };

  app.delStockName = function(stockName) {
    console.log('delStockName');
    var index = stockNames.indexOf(stockName);
    if (index > -1) {
      stockNames.splice(index, 1);
      app.init();
    }
  };

  /**
   * Returns a list of stock code names displayed by the chart
   */
  app.getStockNames = function() {
    return stockNames;
  };

  /**
   * Create the chart when all data is loaded
   * @returns {undefined}
   */
  function createChart() {

    Highcharts.stockChart('container-chart', {

      rangeSelector: {
        selected: 4
      },

      yAxis: {
        labels: {
          formatter: function () {
            return (this.value > 0 ? ' + ' : '') + this.value + '%';
          }
        },
        plotLines: [{
          value: 0,
          width: 2,
          color: 'silver'
        }]
      },

      plotOptions: {
        series: {
          compare: 'percent',
          showInNavigator: true
        }
      },

      tooltip: {
        pointFormat: '<span style="color:{series.color}">{series.name}</span>: <b>{point.y}</b> ({point.change}%)<br/>',
        valueDecimals: 2,
        split: true
      },

      series: seriesOptions
    });
  }

  function getData(stockName, callback) {

    svcGetStocks(stockName, function(err, dataset) {
      if (err) callback(err);
      else {
        //console.log(name +'\r\n'+ JSON.stringify(dataset, null, '') +'\r\n');
        seriesOptions.push({
          name: dataset.stockCode,
          data: dataset.data
        });

        callback(null);
      }
    });
  }

  app.init = function () {

    // Initialize the series option array
    seriesOptions = [];

    var nameCount = 0;
    $.each(stockNames, function (i, name) {
      getData(name, function(err) {
        nameCount += 1;
        if (err) {  
          console.log(name + ' error '+ err);
        } else {
          console.log(name + ' Success');
        }

        // Create chart after all async calls have completed
        if (nameCount === stockNames.length) {
          createChart();
        }
      });
    });
  };

}(jQuery, app));

(function() {
  app.init();
  app.setHighChartTheme();
})();

