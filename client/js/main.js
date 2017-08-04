'use strict';

var app = app || {};
var Highcharts = Highcharts || {};

(function ($) {

  var seriesOptions = null,
      stockNames = ['MSFT', 'AAPL', 'GOOG'];

  /**
   * Adds a stock code name to the stock watch chart
   * @param {string} name The stock code name (e.g. 'MSFT')
   * @param {function} callback (err) 
            The function that is called after a service call
            error {object}: null if no error
   */
  app.addName = function(stockName, callback) {
    stockName = stockName.toUpperCase();

    if (stockNames.indexOf(stockName) === -1) {
      app.stockService.getStock1(stockName, function(err, data) {
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

  function getData(name, callback) {

    $.getJSON('https://www.highcharts.com/samples/data/jsonp.php?filename=' +
          name.toLowerCase() + '-c.json&callback=?'
      ).done(function(data) {

        seriesOptions.push({
          name: name,
          data: data
        });

        callback(null);
      })
      .fail(function(jqxhr, textStatus, error) {
        callback(error);
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

