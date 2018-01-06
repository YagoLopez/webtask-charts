//todo: caso de uso: con mas tiempo se podrian haber scrappeado los datos tabulares de otra web usando cheerio
// para crear una gráfica

'use latest';

// import express from 'express';
// import { fromExpress } from 'webtask-tools';
// import bodyParser from 'body-parser';

const express = require('express');
const WebtaskTools = require('webtask-tools');
const bodyParser = require('body-parser');
// const frappeCharts = require('./node_modules/frappe-charts/dist/frappe-charts.min.cjs');

const app = express();

app.use(bodyParser.json());

const SERVER_ERROR = '<h1 style="color: red">Server Error</h1>';


//todo: refactorizar locals nombre
//todo: diferentes tipos de graficos
//todo: probar a usar storage (lo veo dificil, no hay tiempo) podria comentarlo al fulano
const renderView = (locals) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Chart Webtask</title>
      <script src="https://unpkg.com/frappe-charts@0.0.8/dist/frappe-charts.min.iife.js"></script>
      <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Raleway" type="text/css">
    </head>

    <body style="font-family: 'Raleway', sans-serif; padding: 8%; background: ghostwhite">
      <h1>${locals.title}</h1>
      
      <div id="chart"></div>
      
      <script>
        let chart = new Chart({
          parent: "#chart", // or a DOM element
          title: "Webtask Chart",
          data: ${JSON.stringify(locals.data)},
          type: 'bar', // or 'line', 'scatter', 'pie', 'percentage'
          height: 250,
          colors: ['#7cd6fd', 'violet', 'blue'],
          format_tooltip_x: d => (d + '').toUpperCase(),
          format_tooltip_y: d => d + ' pts'
        });
      </script>
    </body>
    </html>
  `;
};

app.get('/', (req, res) => {
  res.set('Content-Type', 'text/html');
  res.status(200).send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Webtask Info</title>
      <script src="https://unpkg.com/frappe-charts@0.0.8/dist/frappe-charts.min.iife.js"></script>
      <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Raleway" type="text/css">
    </head>
    <body>
      <style>
        body {font-family: 'Raleway', sans-serif; padding: 10%; background: ghostwhite}
        code {font-size: 15px; color: crimson;}
        h2 {color: cornflowerblue}
        textarea {width: 100%; height: 300px}
      </style>
      <h1>Chart Webtask</h1>
      <p>Generates a responsive chart from posted data using <a href="https://frappe.github.io/charts/" target="_blank">
        Frappé Charts</a></p>
      
      <h2>End points: </h2>
      <hr>
      <ul>
        <li>url: /</li>
        <li>method: GET</li>
        <li>returns this screen with information about the webtask</li>
      </ul>
      <hr>
      <ul> 
        <li>url: /chart</li>
        <li>method GET</li>
        <li>returns a <a href="/chart" target="_blank">demo of a default chart</a></li>
      </ul>  
      <hr>
      <ul>
        <li>url: /chart</li>
         <li>method: POST</li>
         <li>The user can post data to this webtask url and gets a chart in return</li>
      </ul>
      <hr>
      
      <h2>Chart data format:</h2>
      
      <p><code>{data: {labels: string[]}, datasets: {title: string, values: number[]}</code></p>
      
      <div>Check <a href="https://frappe.github.io/charts/" target="_blank">Frappé Charts</a> 
        website for more information</div>
      <p>For example. Making a POST request with the following data in the body to the webtask url and adding the
        path <code>/chart</code> will get the demo chart:</p>
        <textarea>
          {
          "labels": ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
            "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],
    
          "datasets": [
            {
              "title": "Some Data",
              "values": [25, 40, 30, 35, 8, 52, 17, -4]
            },
            {
              "title": "Another Set",
              "values": [25, 50, -10, 15, 18, 32, 27, 14]
            },
            {
              "title": "Yet Another",
              "values": [15, 20, -3, -15, 58, 12, -17, 37]
            }
          ]
        }
        </textarea>
        <p style="text-align: center">Developed by Yago Lopez</div>
    </body>
    </html>
  `);
});

app.get('/chart', (req, res) => {

  const HTML = renderView({
    title: 'Demo Chart',
    data: {
      "labels": ["12am-3am", "3am-6am", "6am-9am", "9am-12pm",
        "12pm-3pm", "3pm-6pm", "6pm-9pm", "9pm-12am"],
      "datasets": [
        {
          "title": "Some Data",
          "values": [25, 40, 30, 35, 8, 52, 17, -4]
        },
        {
          "title": "Another Set",
          "values": [25, 50, -10, 15, 18, 32, 27, 14]
        },
        {
          "title": "Yet Another",
          "values": [15, 20, -3, -15, 58, 12, -17, 37]
        }
      ]
    }
  });

  res.set('Content-Type', 'text/html');

  try {
    res.status(200).send(HTML);
  } catch (exception) {
    console.error(exception);
    res.status(500).send(SERVER_ERROR);
  }

});

app.post('/chart', (req, res) => {

  const HTML = renderView({
    title: 'Chart generated from data post to the server',
    data: req.body
  });

  res.set('Content-Type', 'text/html');
  try {
    res.status(200).send(HTML);
  } catch (exception) {
    res.status(500).send(SERVER_ERROR);
    console.error(exception);
  }

});


module.exports = WebtaskTools.fromExpress(app);

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});