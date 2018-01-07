'use latest';
const express = require('express');
const WebtaskTools = require('webtask-tools');
const bodyParser = require('body-parser');
const app = express();
const WEBTASK_NAME = '/chart';
const SERVER_ERROR = '<h1 style="color: red">Server Error</h1>';
app.use(bodyParser.json());


/**
 * Rendrer HTML view with data from de model
 * @param data {object} Model data in MVC
 * @returns {string} string with HTML template and data interpolated
 */
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

/**
 * Base route that renders the initial page
 */
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
        code {font-size: 15px; color: crimson; background-color: #efefef}
        h2 {color: cornflowerblue}
        textarea {width: 100%; height: 300px}
        .colored {color: grey}
        .pad5 {padding: 5px}
      </style>
      <h1>Chart Webtask</h1>
      <p>Generates responsive charts using <a href="https://frappe.github.io/charts/" 
        target="_blank">Frappé Charts</a> Library</p>
      
      <h2>End points: </h2>
      <hr>
      <ul>
        <li>url: <code>/</code></li>
        <li>method: GET</li>
        <li>returns initial screen with information about the webtask</li>
      </ul>
      <hr>
      <ul> 
        <li>url: <code>/demo</code></li>
        <li>method GET</li>
        <li>returns a demo of a default chart</li>
        <li>This route accepts the query parameter: <code class="colored">chartType</code>
        <li>The query parameter <code class="colored">chartType</code> can have the following 
          values: <code class="colored">bar, line, scatter, pie, percentage</code></li>
        <ul>
          <li class="pad5"><a href="${WEBTASK_NAME}/demo?chartType=bar" target="_blank">Demo of default chart using 
            parameter "bar"</a></li>
          <li class="pad5"><a href="${WEBTASK_NAME}/demo?chartType=line" target="_blank">Demo of default chart 
            using parameter "line"</a></li>
        </ul>
      </ul>  
      <hr>
      <ul>
        <li>url: <code>/post</code></li>
        <li>method: POST</li>
        <li>The user can post data to this url and gets a chart in return</li>
        <li>This route also accept <code class="colored">chartType</code> as a parameter and his values</li>
      </ul>
      <hr>
      <ul>
        <li>url: <code>/restricted</code></li>
        <li>method: GET</li>
        <li><a href="${WEBTASK_NAME}/restricted" target="_blank">This is a example of restricted route 
          to unauthorized users</a></li>
      </ul>
      <hr>
      
      <h2>Chart data format:</h2>
      
      <p><code class="colored">{data: {labels: string[]}, datasets: {title: string, values: number[]}</code></p>

      <p>For example, to get a chart from user data, send a POST request to 
        the <code>/post</code> <a href="${WEBTASK_NAME}/post" target="_blank">route</a></p> with the following data
        in the request body:</p>
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
  `)
});

/**
 * Rendes a demo of a chart with predefined data
 * Accept a query string parameter (chartType) to indicate the type of chart to draw
 */
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

/**
 * Receive chart data from the request body and create a chart from it
 * Accept a query string parameter (chartType) to indicate the type of chart to draw
 * the same as '/demo' route
 * The resulting chart can be embbeded in a iframe to show it
 */
app.post('/post', (req, res) => {

  const chartType = req.query.chartType || 'bar';
  const chartData = req.body;
  let HTML;

  console.log('chart type:', chartType);
  console.log('chart data:', chartData);

  if(chartData.datasets && chartData.datasets.length > 0) {
    HTML = renderHTML({
      title: 'Chart dynamically created with data posted to the server',
      chartType: chartType,
      chartData: chartData
    });
  } else {
    HTML = '<h1>Chart could not be created</h1><p>No data provided</p>';
  }

  res.set('Content-Type', 'text/html');

  try {
    res.status(200).send(HTML);
  } catch (exception) {
    res.status(500).send(SERVER_ERROR);
    console.error(exception);
  }

});

/**
 * This is a demostration of restricted route.
 * It is not excluded from authentication therefore is restricted to unauthenticated users
 */
app.get('/restricted', (req, res) => {

  const HTML = '<h1>This is a restricted route</h1>';

  res.set('Content-Type', 'text/html');

  try {
    res.status(200).send(HTML);
  } catch (exception) {
    res.status(500).send(SERVER_ERROR);
    console.error(exception);
  }

});

/**
 * Mangage route access
 * Routes excluded are accesible to anonymous users
 * Routes not excluded need authentication to access
 */
module.exports = WebtaskTools.fromExpress(app).auth0({
  exclude: [
    '/',
    '/demo',
    '/post'
  ],
  loginError: function (error, ctx, req, res, baseUrl) {
    res.writeHead(401, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify({
      statusCode: 401,
      message: "Forbidden. You must be authenticated to access this resource."
    }));
  }
});

app.listen(3000, () => {
  console.log('App listening on port 3000!');
});