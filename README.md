### Stock Watch
Watch and compare stocks over the past year worth of data to current day.

----

##### Server
* Node.js
* Express 4

##### Client JS
* React 15.6
* Highcharts Highstock library
* JQuery 3.2.1

##### Client Style
* Bootstrap-Sass 3.3.7

----
##### Required
* An api key from Quandl is required for api stock data. The api key is free from [Quandl](https://www.quandl.com/tools/api)

----

##### Run
```
npm install
bower install

# Run the app
# Add a Qunadl api key to QUANDL_API_KEY= in 1.run-debug.sh
./1.run-debug.sh
```

or

```
npm install
bower install
grunt
QUANDL_API_KEY= npm run devstart
```

[Demo on Heroku](https://stock-watch-mtimmer.herokuapp.com/)
