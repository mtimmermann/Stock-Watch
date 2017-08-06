"use strict";

var app = app || {};

app.stockService = app.stockService || {};

(function($) {
    var self = app.stockService;
    self.getStocks = function(stockName, callback) {
        if (typeof stockName !== "string") throw new Error("stockName must be a string");
        if (!$.isFunction(callback)) throw new Error("callback function is required");
        $.getJSON("/api/stocks/" + stockName).done(function(data) {
            return callback(null, data);
        }).fail(function(jqxhr, textStatus, error) {
            return callback(error);
        });
    };
    self.getStocksCanned = function(stockName, callback) {
        if (typeof stockName !== "string") throw new Error("stockName must be a string");
        if (!$.isFunction(callback)) throw new Error("callback function is required");
        $.getJSON("/api/stocks/canned/" + stockName).done(function(data) {
            return callback(null, data);
        }).fail(function(jqxhr, textStatus, error) {
            return callback(error);
        });
    };
})(jQuery, app);

"use strict";

var app = app || {};

var Highcharts = Highcharts || {};

Highcharts.createElement("link", {
    href: "https://fonts.googleapis.com/css?family=Unica+One",
    rel: "stylesheet",
    type: "text/css"
}, null, document.getElementsByTagName("head")[0]);

Highcharts.theme = {
    colors: [ "#2b908f", "#90ee7e", "#f45b5b", "#7798BF", "#aaeeee", "#ff0066", "#eeaaee", "#55BF3B", "#DF5353", "#7798BF", "#aaeeee" ],
    chart: {
        backgroundColor: {
            linearGradient: {
                x1: 0,
                y1: 0,
                x2: 1,
                y2: 1
            },
            stops: [ [ 0, "#2a2a2b" ], [ 1, "#3e3e40" ] ]
        },
        style: {
            fontFamily: "'Unica One', sans-serif"
        },
        plotBorderColor: "#606063"
    },
    title: {
        style: {
            color: "#E0E0E3",
            textTransform: "uppercase",
            fontSize: "20px"
        }
    },
    subtitle: {
        style: {
            color: "#E0E0E3",
            textTransform: "uppercase"
        }
    },
    xAxis: {
        gridLineColor: "#707073",
        labels: {
            style: {
                color: "#E0E0E3"
            }
        },
        lineColor: "#707073",
        minorGridLineColor: "#505053",
        tickColor: "#707073",
        title: {
            style: {
                color: "#A0A0A3"
            }
        }
    },
    yAxis: {
        gridLineColor: "#707073",
        labels: {
            style: {
                color: "#E0E0E3"
            }
        },
        lineColor: "#707073",
        minorGridLineColor: "#505053",
        tickColor: "#707073",
        tickWidth: 1,
        title: {
            style: {
                color: "#A0A0A3"
            }
        }
    },
    tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.85)",
        style: {
            color: "#F0F0F0"
        }
    },
    plotOptions: {
        series: {
            dataLabels: {
                color: "#B0B0B3"
            },
            marker: {
                lineColor: "#333"
            }
        },
        boxplot: {
            fillColor: "#505053"
        },
        candlestick: {
            lineColor: "white"
        },
        errorbar: {
            color: "white"
        }
    },
    legend: {
        itemStyle: {
            color: "#E0E0E3"
        },
        itemHoverStyle: {
            color: "#FFF"
        },
        itemHiddenStyle: {
            color: "#606063"
        }
    },
    credits: {
        style: {
            color: "#666"
        }
    },
    labels: {
        style: {
            color: "#707073"
        }
    },
    drilldown: {
        activeAxisLabelStyle: {
            color: "#F0F0F3"
        },
        activeDataLabelStyle: {
            color: "#F0F0F3"
        }
    },
    navigation: {
        buttonOptions: {
            symbolStroke: "#DDDDDD",
            theme: {
                fill: "#505053"
            }
        }
    },
    rangeSelector: {
        buttonTheme: {
            fill: "#505053",
            stroke: "#000000",
            style: {
                color: "#CCC"
            },
            states: {
                hover: {
                    fill: "#707073",
                    stroke: "#000000",
                    style: {
                        color: "white"
                    }
                },
                select: {
                    fill: "#000003",
                    stroke: "#000000",
                    style: {
                        color: "white"
                    }
                }
            }
        },
        inputBoxBorderColor: "#505053",
        inputStyle: {
            backgroundColor: "#333",
            color: "silver"
        },
        labelStyle: {
            color: "silver"
        }
    },
    navigator: {
        handles: {
            backgroundColor: "#666",
            borderColor: "#AAA"
        },
        outlineColor: "#CCC",
        maskFill: "rgba(255,255,255,0.1)",
        series: {
            color: "#7798BF",
            lineColor: "#A6C7ED"
        },
        xAxis: {
            gridLineColor: "#505053"
        }
    },
    scrollbar: {
        barBackgroundColor: "#808083",
        barBorderColor: "#808083",
        buttonArrowColor: "#CCC",
        buttonBackgroundColor: "#606063",
        buttonBorderColor: "#606063",
        rifleColor: "#FFF",
        trackBackgroundColor: "#404043",
        trackBorderColor: "#404043"
    },
    legendBackgroundColor: "rgba(0, 0, 0, 0.5)",
    background2: "#505053",
    dataLabelsColor: "#B0B0B3",
    textColor: "#C0C0C0",
    contrastTextColor: "#F0F0F3",
    maskColor: "rgba(255,255,255,0.3)"
};

(function($) {
    app.setHighChartTheme = function() {
        Highcharts.setOptions(Highcharts.theme);
    };
})(jQuery, app);

"use strict";

var app = app || {};

var Highcharts = Highcharts || {};

(function($) {
    var seriesOptions = null, stockList = [], chart = null, hasLocalStorage = false;
    var svcGetStocks = app.stockService.getStocks;
    app.addStockItem = function(stockCode, callback) {
        stockCode = stockCode.toUpperCase();
        var item = $.grep(stockList, function(obj) {
            return stockCode === obj.stockCode;
        });
        if (item.length === 0) {
            svcGetStocks(stockCode, function(err, dataset) {
                if (err) {
                    console.log(stockCode + " error " + err);
                    callback(err);
                } else {
                    console.log(stockCode + " Success");
                    stockList.push({
                        stockCode: stockCode,
                        companyName: dataset.companyName
                    });
                    chart.addSeries({
                        name: dataset.stockCode,
                        data: dataset.data
                    });
                    if (hasLocalStorage) localStorage.setItem("stock-watch-list", JSON.stringify(stockList));
                    callback(null);
                }
            });
        }
    };
    app.delStockItem = function(stockCode) {
        var items = $.grep(stockList, function(obj) {
            return obj.stockCode !== stockCode;
        });
        if (items.length !== stockList.length) {
            stockList = items;
            if (hasLocalStorage) localStorage.setItem("stock-watch-list", JSON.stringify(stockList));
            var idx = null;
            chart.series.forEach(function(s, i) {
                if (s.name === stockCode) idx = i;
            });
            if (idx >= 0 && chart.series[idx]) chart.series[idx].remove();
        }
    };
    app.getStockList = function() {
        return stockList;
    };
    function createChart(seriesOptions) {
        chart = Highcharts.stockChart("container-chart", {
            rangeSelector: {
                selected: 4
            },
            yAxis: {
                labels: {
                    formatter: function() {
                        return (this.value > 0 ? " + " : "") + this.value + "%";
                    }
                },
                plotLines: [ {
                    value: 0,
                    width: 2,
                    color: "silver"
                } ]
            },
            plotOptions: {
                series: {
                    compare: "percent",
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
            if (err) callback(err); else {
                callback(null, dataset);
            }
        });
    }
    app.init = function() {
        if (typeof Storage !== "undefined") {
            hasLocalStorage = true;
            try {
                stockList = JSON.parse(localStorage.getItem("stock-watch-list")) || [];
            } catch (err) {
                stockList = [];
                localStorage.setItem("stock-watch-list", JSON.stringify(stockList));
            }
        }
        if (chart === null) {
            app.setHighChartTheme();
            createChart([ {
                name: "GOOG",
                data: [ [ 14676768e5, 694.49 ], [ 14677632e5, 697.77 ], [ 14678496e5, 695.36 ], [ 1467936e6, 705.63 ], [ 14681952e5, 715.09 ], [ 14682816e5, 720.64 ], [ 1468368e6, 716.98 ], [ 14684544e5, 720.95 ], [ 14685408e5, 719.85 ], [ 14688e8, 733.78 ], [ 14688864e5, 736.96 ], [ 14689728e5, 741.19 ], [ 14690592e5, 738.63 ], [ 14691456e5, 742.74 ], [ 14694048e5, 739.77 ], [ 14694912e5, 738.42 ], [ 14695776e5, 741.77 ], [ 1469664e6, 745.91 ], [ 14697504e5, 768.79 ], [ 14700096e5, 772.88 ], [ 1470096e6, 771.07 ], [ 14701824e5, 773.18 ], [ 14702688e5, 771.61 ], [ 14703552e5, 782.22 ], [ 14706144e5, 781.76 ], [ 14707008e5, 784.26 ], [ 14707872e5, 784.68 ], [ 14708736e5, 784.85 ], [ 147096e7, 783.22 ], [ 14712192e5, 782.44 ], [ 14713056e5, 777.14 ], [ 1471392e6, 779.91 ], [ 14714784e5, 777.5 ], [ 14715648e5, 775.42 ], [ 1471824e6, 772.15 ], [ 14719104e5, 772.08 ], [ 14719968e5, 769.64 ], [ 14720832e5, 769.41 ], [ 14721696e5, 769.54 ], [ 14724288e5, 772.15 ], [ 14725152e5, 769.09 ], [ 14726016e5, 767.05 ], [ 1472688e6, 768.78 ], [ 14727744e5, 771.46 ], [ 147312e7, 780.08 ], [ 14732064e5, 780.35 ], [ 14732928e5, 775.32 ], [ 14733792e5, 759.66 ], [ 14736384e5, 769.02 ], [ 14737248e5, 759.69 ], [ 14738112e5, 762.49 ], [ 14738976e5, 771.76 ], [ 1473984e6, 768.88 ], [ 14742432e5, 765.7 ], [ 14743296e5, 771.41 ], [ 1474416e6, 776.22 ], [ 14745024e5, 787.21 ], [ 14745888e5, 786.9 ], [ 1474848e6, 774.21 ], [ 14749344e5, 783.01 ], [ 14750208e5, 781.56 ], [ 14751072e5, 775.01 ], [ 14751936e5, 777.29 ], [ 14754528e5, 772.56 ], [ 14755392e5, 776.43 ], [ 14756256e5, 776.47 ], [ 1475712e6, 776.86 ], [ 14757984e5, 775.08 ], [ 14760576e5, 785.94 ], [ 1476144e6, 783.07 ], [ 14762304e5, 786.14 ], [ 14763168e5, 778.19 ], [ 14764032e5, 778.53 ], [ 14766624e5, 779.96 ], [ 14767488e5, 795.26 ], [ 14768352e5, 801.56 ], [ 14769216e5, 796.97 ], [ 1477008e6, 799.37 ], [ 14772672e5, 813.11 ], [ 14773536e5, 807.67 ], [ 147744e7, 799.07 ], [ 14775264e5, 795.35 ], [ 14776128e5, 795.37 ], [ 1477872e6, 784.54 ], [ 14779584e5, 783.61 ], [ 14780448e5, 768.7 ], [ 14781312e5, 762.13 ], [ 14782176e5, 762.02 ], [ 14784768e5, 782.52 ], [ 14785632e5, 790.51 ], [ 14786496e5, 785.31 ], [ 1478736e6, 762.56 ], [ 14788224e5, 754.02 ], [ 14790816e5, 736.08 ], [ 1479168e6, 758.49 ], [ 14792544e5, 764.48 ], [ 14793408e5, 771.23 ], [ 14794272e5, 760.54 ], [ 14796864e5, 769.2 ], [ 14797728e5, 768.27 ], [ 14798592e5, 760.99 ], [ 1480032e6, 761.68 ], [ 14802912e5, 768.24 ], [ 14803776e5, 770.84 ], [ 1480464e6, 758.04 ], [ 14805504e5, 747.92 ], [ 14806368e5, 750.5 ], [ 1480896e6, 762.52 ], [ 14809824e5, 759.11 ], [ 14810688e5, 771.19 ], [ 14811552e5, 776.42 ], [ 14812416e5, 789.29 ], [ 14815008e5, 789.27 ], [ 14815872e5, 796.1 ], [ 14816736e5, 797.07 ], [ 148176e7, 797.85 ], [ 14818464e5, 790.8 ], [ 14821056e5, 794.2 ], [ 1482192e6, 796.42 ], [ 14822784e5, 794.56 ], [ 14823648e5, 791.26 ], [ 14824512e5, 789.91 ], [ 14827968e5, 791.55 ], [ 14828832e5, 785.05 ], [ 14829696e5, 782.79 ], [ 1483056e6, 771.82 ], [ 14834016e5, 786.14 ], [ 1483488e6, 786.9 ], [ 14835744e5, 794.02 ], [ 14836608e5, 806.15 ], [ 148392e7, 806.65 ], [ 14840064e5, 804.79 ], [ 14840928e5, 807.91 ], [ 14841792e5, 806.36 ], [ 14842656e5, 807.88 ], [ 14846112e5, 804.61 ], [ 14846976e5, 806.07 ], [ 1484784e6, 802.175 ], [ 14848704e5, 805.02 ], [ 14851296e5, 819.31 ], [ 1485216e6, 823.87 ], [ 14853024e5, 835.67 ], [ 14853888e5, 832.15 ], [ 14854752e5, 823.31 ], [ 14857344e5, 802.32 ], [ 14858208e5, 796.79 ], [ 14859072e5, 795.695 ], [ 14859936e5, 798.53 ], [ 148608e7, 801.49 ], [ 14863392e5, 801.34 ], [ 14864256e5, 806.97 ], [ 1486512e6, 808.38 ], [ 14865984e5, 809.56 ], [ 14866848e5, 813.67 ], [ 1486944e6, 819.24 ], [ 14870304e5, 820.45 ], [ 14871168e5, 818.98 ], [ 14872032e5, 824.16 ], [ 14872896e5, 828.07 ], [ 14876352e5, 831.66 ], [ 14877216e5, 830.76 ], [ 1487808e6, 831.33 ], [ 14878944e5, 828.64 ], [ 14881536e5, 829.28 ], [ 148824e7, 823.21 ], [ 14883264e5, 835.24 ], [ 14884128e5, 830.63 ], [ 14884992e5, 829.08 ], [ 14887584e5, 827.78 ], [ 14888448e5, 831.91 ], [ 14889312e5, 835.37 ], [ 14890176e5, 838.68 ], [ 1489104e6, 843.25 ], [ 14893632e5, 845.54 ], [ 14894496e5, 845.62 ], [ 1489536e6, 847.2 ], [ 14896224e5, 848.78 ], [ 14897088e5, 852.12 ], [ 1489968e6, 848.4 ], [ 14900544e5, 830.46 ], [ 14901408e5, 829.59 ], [ 14902272e5, 817.58 ], [ 14903136e5, 814.43 ], [ 14905728e5, 819.51 ], [ 14906592e5, 820.92 ], [ 14907456e5, 831.41 ], [ 1490832e6, 831.5 ], [ 14909184e5, 829.56 ], [ 14911776e5, 838.55 ], [ 1491264e6, 834.57 ], [ 14913504e5, 831.41 ], [ 14914368e5, 827.88 ], [ 14915232e5, 824.67 ], [ 14917824e5, 824.73 ], [ 14918688e5, 823.35 ], [ 14919552e5, 824.32 ], [ 14920416e5, 823.56 ], [ 14923872e5, 837.17 ], [ 14924736e5, 836.82 ], [ 149256e7, 838.21 ], [ 14926464e5, 841.65 ], [ 14927328e5, 843.19 ], [ 1492992e6, 862.76 ], [ 14930784e5, 872.3 ], [ 14931648e5, 871.624 ], [ 14932512e5, 874.25 ], [ 14933376e5, 905.96 ], [ 14935968e5, 912.57 ], [ 14936832e5, 916.44 ], [ 14937696e5, 927.04 ], [ 1493856e6, 931.66 ], [ 14939424e5, 927.13 ], [ 14942016e5, 934.3 ], [ 1494288e6, 932.17 ], [ 14943744e5, 928.78 ], [ 14944608e5, 930.6 ], [ 14945472e5, 932.22 ], [ 14948064e5, 937.08 ], [ 14948928e5, 943 ], [ 14949792e5, 919.62 ], [ 14950656e5, 930.24 ], [ 1495152e6, 934.01 ], [ 14954112e5, 941.86 ], [ 14954976e5, 948.82 ], [ 1495584e6, 954.96 ], [ 14956704e5, 969.54 ], [ 14957568e5, 971.47 ], [ 14961024e5, 975.88 ], [ 14961888e5, 964.86 ], [ 14962752e5, 966.95 ], [ 14963616e5, 975.6 ], [ 14966208e5, 983.68 ], [ 14967072e5, 976.57 ], [ 14967936e5, 981.08 ], [ 149688e7, 983.41 ], [ 14969664e5, 949.83 ], [ 14972256e5, 942.9 ], [ 1497312e6, 953.4 ], [ 14973984e5, 950.76 ], [ 14974848e5, 942.31 ], [ 14975712e5, 939.78 ], [ 14978304e5, 957.37 ], [ 14979168e5, 950.63 ], [ 14980032e5, 959.45 ], [ 14980896e5, 957.09 ], [ 1498176e6, 965.59 ], [ 14984352e5, 952.27 ], [ 14985216e5, 927.33 ], [ 1498608e6, 940.49 ], [ 14986944e5, 917.79 ], [ 14987808e5, 908.73 ], [ 149904e7, 898.7 ], [ 14992128e5, 911.94 ], [ 14992992e5, 906.69 ], [ 14993856e5, 918.59 ], [ 14996448e5, 928.8 ], [ 14997312e5, 930.09 ], [ 14998176e5, 943.83 ], [ 1499904e6, 947.16 ], [ 14999904e5, 955.99 ], [ 15002496e5, 953.42 ], [ 1500336e6, 965.4 ], [ 15004224e5, 970.89 ], [ 15005088e5, 968.15 ], [ 15005952e5, 972.92 ], [ 15008544e5, 980.34 ], [ 15009408e5, 950.7 ], [ 15010272e5, 947.8 ], [ 15011136e5, 934.09 ], [ 15012e8, 941.53 ], [ 15014592e5, 930.5 ], [ 15015456e5, 930.83 ], [ 1501632e6, 930.39 ], [ 15017184e5, 923.65 ], [ 15018048e5, 927.96 ] ]
            } ]);
            chart.series[0].remove();
        }
        var seriesOptions = [];
        var stockListCount = 0;
        $.each(stockList, function(i, item) {
            getData(item.stockCode, function(err, dataset) {
                stockListCount += 1;
                if (err) {
                    console.log(item.stockCode + " error " + err);
                } else {
                    seriesOptions.push({
                        name: dataset.stockCode,
                        data: dataset.data
                    });
                    console.log(item.stockCode + " Success");
                }
                if (stockListCount === stockList.length) {
                    createChart(seriesOptions);
                }
            });
        });
    };
})(jQuery, app);

(function() {
    app.init();
    app.setHighChartTheme();
})();