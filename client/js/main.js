'use strict';

var App = App || {};
var Highcharts = Highcharts || {};

(function ($) {

  var seriesOptions = null,
      names = ['MSFT', 'AAPL', 'GOOG'];

  App.addName = function(name) {
    if (names.indexOf(name) === -1) {
      names.push(name);
console.log('names: '+ names);
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

  App.init = function () {

    // Initialize the series option array
    seriesOptions = [];

    var nameCount = 0;
    $.each(names, function (i, name) {
      getData(name, function(err) {
        nameCount += 1;
        if (err) {  
          console.log(name + ' error '+ err);
        } else {
          console.log(name + ' Success');
        }

        // Create chart after all async calls have completed
        if (nameCount === names.length) {
          createChart();
        }
      });
    });
  };

}(jQuery, App));

(function() {
  App.init();
  App.setHighChartTheme();
})();
