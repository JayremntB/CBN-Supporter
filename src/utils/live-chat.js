const request = require('request');
const sendResponse = require('../general/sendResponse');
const stuff = require('../general/stuff');

const dbName = 'database-for-cbner';
const collectionName = 'users-data';

module.exports = {
  startLiveChat: startLiveChat,
  deniedUsingOtherFeatures: deniedUsingOtherFeatures
}

async function startLiveChat(client, sender_psid) {
  let response = {
    "text": "Đợi tý, tớ đang gọi thằng coder..."
  };
  sendResponse(sender_psid, response);
  onLiveChat(client, sender_psid);
  // send notification to author with user's info
  request({
    "uri": `https://graph.facebook.com/${sender_psid}`,
    "qs": {
      "fields": "first_name,last_name",
      "access_token": process.env.PAGE_ACCESS_TOKEN
    },
    "method": "GET"
  }, (err, res, body) => {
    if(err) {
      console.error("Unable to send message:" + err);
    } else {
      let userName = JSON.parse(body);
      response = {
        "text": `Hey boyyy, ${userName.first_name} ${userName.last_name} wants to have a conversation :^)`
      };
      sendResponse(process.env.authorPSID, response);
    }
  });
}

function deniedUsingOtherFeatures(sender_psid) {
  let response = stuff.liveChatExitResponse;
  response.text = "Nhập Exit để thoát hỗ trợ và sử dụng các tính năng khác nhé :3";
  sendResponse(sender_psid, response);
}

function onLiveChat(client, sender_psid) {
  client.db(dbName).collection(collectionName).updateOne({ sender_psid: sender_psid }, {
    $set: {
      live_chat: true
    }
  }, (err) => {
    if(err) {
      console.error(err);
      const response = {
        "text": "Úi, tớ không kết nối với database được. Bạn hãy thử lại sau nha T.T"
      };
      sendResponse(sender_psid, response);
    }
    else {
      setTimeout(() => {
        const response = stuff.liveChatExitResponse;
        sendResponse(sender_psid, response);
      }, 500);
    }
  });
}
