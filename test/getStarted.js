const request = require('request');

const webhook_uri = "";
const body_json = {
  "object":"page",
  "entry":[
    {
      "id": '100599201638035',
      "messaging": [
        {
          sender: { id: '2971837452854702' },
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
