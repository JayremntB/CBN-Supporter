(async () => {

// This file just for setting up single part of chatbot like get started button,
// persistent menu, greeting text,... It does not support for main code and
// another files in this repository

const request = require('request');
// 
// await request({
//   "uri": "https://graph.facebook.com/v6.0/me/messenger_profile",
//   // "uri": "https://graph.facebook.com/me/personas",
//   "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
//   "method": "POST",
//   "json": {
//     "setting-type":"call_to_actions",
//     "thread_state":"new_thread",
//     "get_started": {
//       "payload": "getStarted"
//     }
//   }
// }, (err, res, body) => {
//   console.log("getStarted: \n");
//   if(err) console.error(err);
//   else console.log(body);
// });

await request({
  "uri": "https://graph.facebook.com/v6.0/me/messenger_profile",
  // "uri": "https://graph.facebook.com/me/personas",
  "qs": { "access_token": process.env.PAGE_ACCESS_TOKEN },
  "method": "POST",
  "json": {
    "greeting":[{
      "locale":"default",
      "text":"Chào {{user_first_name}} nha :> Bấm GET STARTED/BẮT ĐẦU để khám phá những tính năng dành riêng cho CBNer nhé!"
    }]
  }
}, (err, res, body) => {
  console.log('greeting: \n');
  if(err) console.error(err);
  else console.log(body);
});
})()
