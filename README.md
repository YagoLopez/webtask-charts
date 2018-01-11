# Chart Webtask



- Example of servless code running on https://webtask.io


- Webtask that generates responsive charts using <a href="https://frappe.github.io/charts/" target="_blank">Frappé Charts</a> library



### End points:

------

- **url**: `/`
- **method**: *GET*
- [returns initial screen with information about the webtask](https://wt-26c8d8dafc4cb18db903554c4e796c40-0.run.webtask.io/chart)

------

- **url**: `/demo`

- **method** *GET*

- returns a demo of a default chart

- This route accepts the query parameter: `chartType`

- The query parameter `chartType` can have the following values: `bar, line, scatter, pie, percentage`


------

- **url**: `/post`
- **method**: *POST*
- The user can post data to this url and gets a chart in return
- This route also accept `chartType` as a parameter with the before mentioned values

------

- **url**: `/restricted`
- **method**: *GET*
- This is a example of route that needs authorization to access

------



### Chart data format:

```javascript
{ 
	"labels": string[], 
	"datasets": [
		{
			"title": string, 
			"values": number[]
        }
    ]
}
```

For example, to get a chart from user data, send a **POST** request to the webtask url adding `/post` to the path with the following data in the request body:

```javascript
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
```



<p align="center">Developed by Yago Lopez</p>