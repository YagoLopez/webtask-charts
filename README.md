# Chart Webtask



- Example of servless code running on https://webtask.io


- Generates a responsive charts data using <a href="https://frappe.github.io/charts/" target="_blank">Frappé Charts</a> library



### End points:

------

- url: `/`
- method: GET
- returns this screen with information about the webtask

------

- url: `/demo`

- method GET

- returns a demo of a default chart

- This route accepts the query parameter: `chartType`

- The query parameter `chartType` can have the following values: `bar, line, scatter, pie, percentage`

- - [Demo of the default chart using bars](http://localhost:3000/demo)
  - [Demo of the default chart using parameter "line"](http://localhost:3000/demo?chartType=line)

------

- url: `/post`
- method: POST
- The user can post data to this url and gets a chart in return
- This route also accept `chartType` as a parameter and his values

------

- url: `/restricted`
- method: GET
- This is a example of route that needs authorization to access

------



### Chart data format:

`{data: {labels: string[]}, datasets: {title: string, values: number[]}`

For example, to make a POST request include the following data in the body and send a request to the webtask url adding `/post` to the path:

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
Check [Frappé Charts](https://frappe.github.io/charts/) website for more information

Developed by Yago Lopez