//todo: caso de uso: con mas tiempo se podrian haber scrappeado los datos tabulares de otra web usando cheerio
// para crear una gráfica

'use latest';

const express = require('express');
const WebtaskTools = require('webtask-tools');
const bodyParser = require('body-parser');
// const frappeCharts = require('./node_modules/frappe-charts/dist/frappe-charts.min.cjs');

const app = express();

app.use(bodyParser.json());

const WEBTASK_NAME = '/';

const SERVER_ERROR = '<h1 style="color: red">Server Error</h1>';


//todo: diferentes tipos de graficos
//todo: probar a usar storage (lo veo dificil, no hay tiempo) podria comentarlo al fulano
const renderHTML = (data) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Chart Webtask</title>
      <script src="https://unpkg.com/frappe-charts@0.0.8/dist/frappe-charts.min.iife.js"></script>
      <link rel="stylesheet" href="//fonts.googleapis.com/css?family=Raleway" type="text/css">
    </head>

    <body style="font-family: 'Raleway', sans-serif; padding: 10%; background: ghostwhite">
      <h1>${data.title}</h1>
      
      <div id="chart"></div>
      
      <script>
        let chart = new Chart({
          parent: "#chart",
          title: "Webtask Chart",
          data: ${JSON.stringify(data.chartData)},
          type: ${JSON.stringify(data.chartType)},
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
        body {font-family: 'Raleway', sans-serif; padding: 8%; background: ghostwhite}
        code {font-size: 15px; color: crimson;}
        h2 {color: cornflowerblue}
        textarea {width: 100%; height: 300px}
        .green {color: orange}
      </style>
      <h1>Chart Webtask</h1>
      <p>Generates a responsive chart from posted data using <a href="https://frappe.github.io/charts/" 
        target="_blank">Frappé Charts</a></p>
      
      <h2>End points: </h2>
      <hr>
      <ul>
        <li>url: <code>/</code></li>
        <li>method: GET</li>
        <li>returns this screen with information about the webtask</li>
      </ul>
      <hr>
      <ul> 
        <li>url: <code>/demo</code></li>
        <li>method GET</li>
        <li>returns a demo of a default chart</li>
        <li>This route accepts the query parameter: <code class="green">chartType</code>
        <li>The query parameter <code class="green">chartType</code> can have the following 
          values: <code class="green">'bar', 'line', 'scatter', 'pie', 'percentage'</code></li>
        <ul>
          <li><a href="/demo" target="_blank">Demo of the default chart using bars</a></li>
          <li><a href="/demo?chartType=linear" target="_blank">Demo of the default chart using parameter "pie"</a></li>
        </ul>
      </ul>  
      <hr>
      <ul>
        <li>url: <code>/post</code></li>
         <li>method: POST</li>
         <li>The user can post data to this webtask url and gets a chart in return</li>
         <li>This route also accept <code>chartType</code> as a parameter and his values</li>
      </ul>
      <hr>
      
      <h2>Chart data format:</h2>
      
      <p><code>{data: {labels: string[]}, datasets: {title: string, values: number[]}</code></p>
      
      <div>Check <a href="https://frappe.github.io/charts/" target="_blank">Frappé Charts</a> 
        website for more information</div>
      <p>For example. Making a POST request with the following data in the body to the webtask url and adding the
        path <code>/post</code> will get the demo chart:</p>
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

app.get('/demo', (req, res) => {

  const chartType = req.query.chartType || 'bar';

  const chartData = {
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
  };

  const HTML = renderHTML({
    title: 'Demo Chart',
    chartType: chartType,
    chartData: chartData
  });

  res.set('Content-Type', 'text/html');

  try {
    res.status(200).send(HTML);
  } catch (exception) {
    console.error(exception);
    res.status(500).send(SERVER_ERROR);
  }

});

app.post('/post', (req, res) => {

  const chartType = req.query.type;

  console.log('chart type', chartType);
  console.log('chart data', req.body);

  const HTML = renderHTML({
    title: 'Chart generated from data posted to the server',
    chartType: chartType,
    chartData: req.body
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