const sendResponse = require('../general/sendResponse');

module.exports = {
  init: init,
  handleMessage: handleMessage
};

function init(client, sender_psid, userData) {
  let response = {
    "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
  };
  createBlock(client, sender_psid);
  response = stuff.searchClassesAskTeacher;
  sendResponse(sender_psid, response);
}

function handleMessage(client, sender_psid, text, userData) {
  if(text === "Thầy (cô) khác") {
    const response = stuff.searchScheduleAskGroup;
    clearData(client, sender_psid);
    sendResponse(sender_psid, response);
  }
  else if(userData.search_classes.teacher) {
    sendClasses(sender_psid, text, userData);
  }
  else {
    updateData(client, sender_psid, text);
  }
}

function createBlock(client, sender_psid) {
  const collectionUserData = client.db(dbName).collection('users-data');
  let response = {
    "text": "Úi, tớ không kết nối với database được. Cậu hãy thử lại sau nha T.T"
  };
  collectionUserData.updateOne({ sender_psid: sender_psid }, {
    $set: {
      search_classes: {
        block: true,
        teacher: "",
        teaches: []
      }
    }
  }, (err) => {
    if(err) {
      console.error(err);
      sendResponse(sender_psid, response);
    }
    else console.log('init search block successfully');
  });
}
