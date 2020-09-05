const sendResponse = require('../general/sendResponse');

let response = {
  "text": ""
}
module.exports = function (client, userData, classesNumber) {
  const date = new Date();
  date.setHours(date.getHours() + 7); // deploy at US
  let dayNow = Number(date.getDay()) + 1;
  if(dayNow === 1) {
    response.text = `Không có lớp nào học ${classesNumber} tiết hôm nay...`;
    return response;
  }
  client.db('database-for-cbner').collection('schedule').find({ "schedule.0": {$exists: true} }).toArray((err, groups) => {
    response.text = `Các lớp ${classesNumber} tiết hôm nay:\n`
    let numberOfGroups = 0;
    if(groups) {
      groups.forEach((group) => {
        if(
          (classesNumber === 4 && group.schedule[dayNow - 2].morning[4].subject === "") ||
          (classesNumber === 5 && group.schedule[dayNow - 2].morning[4].subject !== "")
        ) {
          response.text += group.group + ", ";
          numberOfGroups ++;
        }
      });
    }
    if(numberOfGroups === 0) response.text = `Không có lớp nào học ${classesNumber} tiết hôm nay...`;
    else {
      response.text = response.text.substring(0, response.text.length - 2);
      response.text += `\nTổng: ${numberOfGroups} lớp`
    }
    sendResponse(userData.sender_psid, response);
  });
}
