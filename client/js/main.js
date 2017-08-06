'use strict';

var app = app || {};
var Highcharts = Highcharts || {};

(function ($) {

  var seriesOptions = null,
      stockList = [], // e.g. { stockCode: 'GOOG', companyName 'Alphabet Inc (GOOG)' }
      chart = null,
      hasLocalStorage = false;

  var svcGetStocks = app.stockService.getStocks;

  /**
   * Adds a stock item to the stock watch chart
   * @param {string} stockCode The stock code name (e.g. 'MSFT')
   * @param {function} callback (err) 
            The function that is called after a service call
            error {object}: null if no error
   */
  app.addStockItem = function(stockCode, callback) {
    stockCode = stockCode.toUpperCase();

    var item = $.grep(stockList, function(obj) { return stockCode === obj.stockCode; });
    if (item.length === 0) {

      svcGetStocks(stockCode, function(err, dataset) {
        if (err) {
          callback(err);
        } else {
          stockList.push({ stockCode: stockCode, companyName: dataset.companyName });
          chart.addSeries({ name: dataset.stockCode, data: dataset.data });
          if (hasLocalStorage) localStorage.setItem('stock-watch-list', JSON.stringify(stockList));
          callback(null);
        }
      });
    }
  };

  /**
   * Delete a stock item from chart
   * @param {string} stockCode name of the stock code (e.g. 'MSFT')
   */
  app.delStockItem = function(stockCode) {
    var items = $.grep(stockList, function(obj) { return obj.stockCode !== stockCode; });
    if (items.length !== stockList.length) {
      stockList = items;
      if (hasLocalStorage) localStorage.setItem('stock-watch-list', JSON.stringify(stockList));

      var idx = null;
      chart.series.forEach(function(s, i) {
        if (s.name === stockCode) idx = i;
      });
      if (idx >= 0) chart.series[idx].remove();
    }
  };

  /**
   * Returns a list of stock code names displayed by the chart
   * @return {[array]} Array of stock list items
   */
  app.getStockList = function() {
    return stockList;
  };

  /**
   * Create the chart when all data is loaded
   * @returns {undefined}
   */
  function createChart(seriesOptions) {

    chart = Highcharts.stockChart('container-chart', {

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

  function getData(stockCode, callback) {

    svcGetStocks(stockCode, function(err, dataset) {
      if (err) callback(err);
      else {
        callback(null, dataset);
      }
    });
  }

  /**
   * Initialize the app data and app stock chart
   */
  app.init = function () {

    if (typeof(Storage) !== 'undefined') {
      hasLocalStorage = true;
      try {
        stockList = JSON.parse(localStorage.getItem('stock-watch-list')) || [];
      } catch (err) {
        stockList = [];
        localStorage.setItem('stock-watch-list', JSON.stringify(stockList));
      }
    }

    // Initialize empty chart prior to loading any data.
    //  This will allow a chart view while any data is in the
    //  process of loading.
    if (chart === null) {
      app.setHighChartTheme();
      createChart([{
        name: 'GOOG',
        data: [[1467676800000,694.49],[1467763200000,697.77],[1467849600000,695.36],[1467936000000,705.63],[1468195200000,715.09],[1468281600000,720.64],[1468368000000,716.98],[1468454400000,720.95],[1468540800000,719.85],[1468800000000,733.78],[1468886400000,736.96],[1468972800000,741.19],[1469059200000,738.63],[1469145600000,742.74],[1469404800000,739.77],[1469491200000,738.42],[1469577600000,741.77],[1469664000000,745.91],[1469750400000,768.79],[1470009600000,772.88],[1470096000000,771.07],[1470182400000,773.18],[1470268800000,771.61],[1470355200000,782.22],[1470614400000,781.76],[1470700800000,784.26],[1470787200000,784.68],[1470873600000,784.85],[1470960000000,783.22],[1471219200000,782.44],[1471305600000,777.14],[1471392000000,779.91],[1471478400000,777.5],[1471564800000,775.42],[1471824000000,772.15],[1471910400000,772.08],[1471996800000,769.64],[1472083200000,769.41],[1472169600000,769.54],[1472428800000,772.15],[1472515200000,769.09],[1472601600000,767.05],[1472688000000,768.78],[1472774400000,771.46],[1473120000000,780.08],[1473206400000,780.35],[1473292800000,775.32],[1473379200000,759.66],[1473638400000,769.02],[1473724800000,759.69],[1473811200000,762.49],[1473897600000,771.76],[1473984000000,768.88],[1474243200000,765.7],[1474329600000,771.41],[1474416000000,776.22],[1474502400000,787.21],[1474588800000,786.9],[1474848000000,774.21],[1474934400000,783.01],[1475020800000,781.56],[1475107200000,775.01],[1475193600000,777.29],[1475452800000,772.56],[1475539200000,776.43],[1475625600000,776.47],[1475712000000,776.86],[1475798400000,775.08],[1476057600000,785.94],[1476144000000,783.07],[1476230400000,786.14],[1476316800000,778.19],[1476403200000,778.53],[1476662400000,779.96],[1476748800000,795.26],[1476835200000,801.56],[1476921600000,796.97],[1477008000000,799.37],[1477267200000,813.11],[1477353600000,807.67],[1477440000000,799.07],[1477526400000,795.35],[1477612800000,795.37],[1477872000000,784.54],[1477958400000,783.61],[1478044800000,768.7],[1478131200000,762.13],[1478217600000,762.02],[1478476800000,782.52],[1478563200000,790.51],[1478649600000,785.31],[1478736000000,762.56],[1478822400000,754.02],[1479081600000,736.08],[1479168000000,758.49],[1479254400000,764.48],[1479340800000,771.23],[1479427200000,760.54],[1479686400000,769.2],[1479772800000,768.27],[1479859200000,760.99],[1480032000000,761.68],[1480291200000,768.24],[1480377600000,770.84],[1480464000000,758.04],[1480550400000,747.92],[1480636800000,750.5],[1480896000000,762.52],[1480982400000,759.11],[1481068800000,771.19],[1481155200000,776.42],[1481241600000,789.29],[1481500800000,789.27],[1481587200000,796.1],[1481673600000,797.07],[1481760000000,797.85],[1481846400000,790.8],[1482105600000,794.2],[1482192000000,796.42],[1482278400000,794.56],[1482364800000,791.26],[1482451200000,789.91],[1482796800000,791.55],[1482883200000,785.05],[1482969600000,782.79],[1483056000000,771.82],[1483401600000,786.14],[1483488000000,786.9],[1483574400000,794.02],[1483660800000,806.15],[1483920000000,806.65],[1484006400000,804.79],[1484092800000,807.91],[1484179200000,806.36],[1484265600000,807.88],[1484611200000,804.61],[1484697600000,806.07],[1484784000000,802.175],[1484870400000,805.02],[1485129600000,819.31],[1485216000000,823.87],[1485302400000,835.67],[1485388800000,832.15],[1485475200000,823.31],[1485734400000,802.32],[1485820800000,796.79],[1485907200000,795.695],[1485993600000,798.53],[1486080000000,801.49],[1486339200000,801.34],[1486425600000,806.97],[1486512000000,808.38],[1486598400000,809.56],[1486684800000,813.67],[1486944000000,819.24],[1487030400000,820.45],[1487116800000,818.98],[1487203200000,824.16],[1487289600000,828.07],[1487635200000,831.66],[1487721600000,830.76],[1487808000000,831.33],[1487894400000,828.64],[1488153600000,829.28],[1488240000000,823.21],[1488326400000,835.24],[1488412800000,830.63],[1488499200000,829.08],[1488758400000,827.78],[1488844800000,831.91],[1488931200000,835.37],[1489017600000,838.68],[1489104000000,843.25],[1489363200000,845.54],[1489449600000,845.62],[1489536000000,847.2],[1489622400000,848.78],[1489708800000,852.12],[1489968000000,848.4],[1490054400000,830.46],[1490140800000,829.59],[1490227200000,817.58],[1490313600000,814.43],[1490572800000,819.51],[1490659200000,820.92],[1490745600000,831.41],[1490832000000,831.5],[1490918400000,829.56],[1491177600000,838.55],[1491264000000,834.57],[1491350400000,831.41],[1491436800000,827.88],[1491523200000,824.67],[1491782400000,824.73],[1491868800000,823.35],[1491955200000,824.32],[1492041600000,823.56],[1492387200000,837.17],[1492473600000,836.82],[1492560000000,838.21],[1492646400000,841.65],[1492732800000,843.19],[1492992000000,862.76],[1493078400000,872.3],[1493164800000,871.624],[1493251200000,874.25],[1493337600000,905.96],[1493596800000,912.57],[1493683200000,916.44],[1493769600000,927.04],[1493856000000,931.66],[1493942400000,927.13],[1494201600000,934.3],[1494288000000,932.17],[1494374400000,928.78],[1494460800000,930.6],[1494547200000,932.22],[1494806400000,937.08],[1494892800000,943],[1494979200000,919.62],[1495065600000,930.24],[1495152000000,934.01],[1495411200000,941.86],[1495497600000,948.82],[1495584000000,954.96],[1495670400000,969.54],[1495756800000,971.47],[1496102400000,975.88],[1496188800000,964.86],[1496275200000,966.95],[1496361600000,975.6],[1496620800000,983.68],[1496707200000,976.57],[1496793600000,981.08],[1496880000000,983.41],[1496966400000,949.83],[1497225600000,942.9],[1497312000000,953.4],[1497398400000,950.76],[1497484800000,942.31],[1497571200000,939.78],[1497830400000,957.37],[1497916800000,950.63],[1498003200000,959.45],[1498089600000,957.09],[1498176000000,965.59],[1498435200000,952.27],[1498521600000,927.33],[1498608000000,940.49],[1498694400000,917.79],[1498780800000,908.73],[1499040000000,898.7],[1499212800000,911.94],[1499299200000,906.69],[1499385600000,918.59],[1499644800000,928.8],[1499731200000,930.09],[1499817600000,943.83],[1499904000000,947.16],[1499990400000,955.99],[1500249600000,953.42],[1500336000000,965.4],[1500422400000,970.89],[1500508800000,968.15],[1500595200000,972.92],[1500854400000,980.34],[1500940800000,950.7],[1501027200000,947.8],[1501113600000,934.09],[1501200000000,941.53],[1501459200000,930.5],[1501545600000,930.83],[1501632000000,930.39],[1501718400000,923.65],[1501804800000,927.96]]
      }]);
      chart.series[0].remove();
    }

    var seriesOptions = [];
    var stockListCount = 0;
    $.each(stockList, function (i, item) {
      getData(item.stockCode, function(err, dataset) {
        stockListCount += 1;
        if (err) {  
          console.log(item.stockCode + ' error '+ err);
        } else {
          seriesOptions.push({
            name: dataset.stockCode,
            data: dataset.data
          });
          console.log(item.stockCode + ' Success');
        }

        // Create chart after all async calls have completed
        if (stockListCount === stockList.length) {
          createChart(seriesOptions);
        }
      });
    });
  };

}(jQuery, app));

(function() {
  app.init();
  app.setHighChartTheme();
})();

