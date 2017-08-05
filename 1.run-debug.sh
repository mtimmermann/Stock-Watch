#!/bin/bash

# Run in Debug
#DEBUG=stock-watch:* npm start

grunt

# Run Debug w/ nodemon listener
# Must add the Qundl api key before running.
QUANDL_API_KEY= DEBUG=stock-watch:* npm run devstart

#grunt watch



