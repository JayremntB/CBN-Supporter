const sendResponse = require('../general/sendResponse');
const request = require('request');

module.exports = {
  startLiveChat: startLiveChat,
  deniedUsingOtherFeatures: deniedUsingOtherFeatures
}

async function startLiveChat(client, sender_psid) {
  let response = {
    "text": "Đợi tý, tớ đang gọi thằng coder..."
  };
  sendResponse(sender_psid, response);
  setTimeout(() => {
    response.text = stuff.liveChatExitResponse;
    sendResponse(sender_psid, response);
  }, 500);
  onLiveChat(sender_psid);

  const userName = await getUserName(sender_psid);
  response = {
    "text": `Hey boyyy, ${userName.first_name + userName.last_name} wants to have a conversation :^)`
  };
  sendResponse(process.env.authorPSID, response);
}

function deniedUsingOtherFeatures(sender_psid) {
  let response = {
    "text": "Nhập Exit để thoát hỗ trợ và sử dụng các tính năng khác nhé :3"
  };
  sendResponse(sender_psid, response);
}

async function getUserName(sender_psid) {
  const userName = await request({
    "uri": `https://graph.facebook.com/${sender_psid}`,
    "qs": {
      "fields": "first_name,last_name",
      "access_token": process.env.PAGE_ACCESS_TOKEN
    },
    "method": "GET"
  });
  return JSON.parse(userName);
}


function onLiveChat(sender_psid) {
  client.db(dbName).collection(collectionName).updateOne({ sender_psid: sender_psid }, {
    $set: {
      live_chat: true
    }
  });
}
