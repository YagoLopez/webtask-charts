'use latest';

import express from 'express';
import { fromExpress } from 'webtask-tools';
import bodyParser from 'body-parser';
import Chart from "frappe-charts/dist/frappe-charts.min.esm";

/*
const express = require('express');
const WebtaskTools = require('webtask-tools');
const bodyParser = require('body-parser');
// const frappeCharts = require('./node_modules/frappe-charts/dist/frappe-charts.min.cjs');
*/


const app = express();

app.use(bodyParser.json());

app.get('/', (req, res) => {

  const HTML = renderView({
    title: 'My Webtask View',
    body: '<h1>Simple webtask view</h1>',
    data: {
      labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
        "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],

      datasets: [
        {
          title: "Some Data",
          values: [25, 40, 30, 35, 8, 52, 17, -4]
        },
        {
          title: "Another Set",
          values: [25, 50, -10, 15, 18, 32, 27, 14]
        },
        {
          title: "Yet Another",
          values: [15, 20, -3, -15, 58, 12, -17, 37]
        }
      ]
    }

  });

  res.set('Content-Type', 'text/html');
  res.status(200).send(HTML);
});

app.post('/', (req, res) => {

  const HTML = renderView({
    title: 'My Webtask View',
    body: '<h1>Simple webtask view</h1>',
    data: {
      labels: ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
        "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],

      datasets: [
        {
          title: "Some Data",
          values: [25, 40, 30, 35, 8, 52, 17, -4]
        },
        {
          title: "Another Set",
          values: [25, 50, -10, 15, 18, 32, 27, 14]
        },
        {
          title: "Yet Another",
          values: [15, 20, -3, -15, 58, 12, -17, 37]
        }
      ]
    }

  });

  res.set('Content-Type', 'text/html');
  res.status(200).send(HTML);
});

function renderView(locals) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>${locals.title}</title>
    </head>

    <body>
      <div>${locals.body}</div>
      
      <div id="chart"></div>
      
      <script>
        let chart = new Chart({
          parent: "#chart", // or a DOM element
          title: "My Awesome Chart",
          data: ${JSON.stringify(locals.data)},
          type: 'bar', // or 'line', 'scatter', 'pie', 'percentage'
          height: 250,
      
          colors: ['#7cd6fd', 'violet', 'blue'],
          // hex-codes or these preset colors;
          // defaults (in order):
          // ['light-blue', 'blue', 'violet', 'red',
          // 'orange', 'yellow', 'green', 'light-green',
          // 'purple', 'magenta', 'grey', 'dark-grey']
      
          format_tooltip_x: d => (d + '').toUpperCase(),
          format_tooltip_y: d => d + ' pts'
        });
      </script>
      
      
    </body>
    </html>
  `;
}


app.listen(3000, () => {
  console.log('Example app listening on port 3000!');
});