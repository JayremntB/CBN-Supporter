const request = require('request');

const webhook_uri = "https://cbnsupporter.herokuapp.com/webhook";
const body_json = {
  "object":"page",
  "entry":[
    {
      "id": '100599201638035',
      "messaging": [
        {
          sender: { id: '2808920669162332' },
          recipient: { id: '100599201638035' },
          timestamp: "",
          postback: { title: 'GET STARTED', payload: 'getStarted' }
        }
      ]
    }
  ]
}

request({
  "uri": webhook_uri,
  "method": "POST",
  "json": body_json
}, (err, res, body) => {
  if(err) console.error(err);
  else console.log(body);
});
