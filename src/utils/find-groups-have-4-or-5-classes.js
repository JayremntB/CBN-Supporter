const sendResponse = require('../general/sendResponse');

let response = {
  "attachment": {
    "type": "template",
    "payload": {
      "template_type": "button",
      "text": "",
      "buttons": [
        {
          "type": "postback",
          "title": "Xem full tuần",
          "payload": "findGroupsWithClassesConditionFullWeek"
        }
      ]
    }
  }
}
module.exports = async function (client, userData, today = true) {
  for(let i = 2; i < (today === false ) ? 8 : 2 ; i ++) {
    response.attachment.payload.text += await getResults(client, 4, i, today) + "\n\n" + await getResults(client, 5, today);
    sendResponse(userData.sender_psid, response);
  }
}

async function getResults(client, classesNumber, day, today) {
  let result = "";
  const date = new Date();
  date.setHours(date.getHours() + 7); // deploy at US
  dayNow = Number(date.getDay()) + 1;
  if(today) {
    if(dayNow === 1) {
      result = `Không có lớp nào học ${classesNumber} tiết hôm nay...`;
      return result;
    }
  }
  else dayNow = day;
  //
  const groups = await client.db('database-for-cbner').collection('schedule').find({ "schedule.0": {$exists: true} }).toArray();
  result = `Các lớp ${classesNumber} tiết hôm nay:\n`
  let numberOfGroups = 0;
  if(groups) {
    for (let i = 0; i < groups.length - 1; i++) {
      if (
        (classesNumber === 4 && groups[i].schedule[dayNow - 2].morning[4].subject === "") ||
        (classesNumber === 5 && groups[i].schedule[dayNow - 2].morning[4].subject !== "")
      ) {
        result += groups[i].group + ", ";
        numberOfGroups++;
      }
    }
  }
  if(numberOfGroups === 0) result = `Không có lớp nào học ${classesNumber} tiết hôm nay...`;
  else {
    result = result.substring(0, result.length - 2);
    result += `\nTổng: ${numberOfGroups} lớp`
  }
  return result;
}