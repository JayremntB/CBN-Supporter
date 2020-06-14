const { MongoClient } = require('mongodb');
const template = require('../src/general/template');
// const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-obtbe.mongodb.net/test`;
const connectionUrl = "mongodb://127.0.0.1:27017"
// const connectionUrl = process.env.DATABASE_URI;
const dbName = "database-for-cbner";
const teacherName = "";
MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    return console.log('Failed to connect to database');
  }
  console.log("Connect successfully");
  const db = client.db(dbName);
  const collection = db.collection('schedule');
  // collection.find({
  //   $or: [
  //     {"schedule.morning.teacher": teacherName},
  //     {"schedule.afternoon.teacher": teacherName}
  //   ]
  // }).toArray((err, docs) => {
  //   if(err) console.log(err);
  //   else {
  //     let res = [];
  //     for(let i = 0; i < 6; i ++) { // loop days
  //       res.push({
  //         "morning": [],
  //         "afternoon": []
  //       });
  //       for(let j = 0; j < 5; j ++) {
  //         docs.forEach((doc) => {
  //           if(doc.schedule[i].morning[j] && doc.schedule[i].morning[j].teacher === teacherName){
  //             res[i].morning.push(doc.group);
  //             return;
  //           }
  //         });
  //         docs.forEach((doc) => {
  //           if(doc.schedule[i].afternoon[j] && doc.schedule[i].afternoon[j].teacher === teacherName){
  //             res[i].afternoon.push(doc.group);
  //             return;
  //           }
  //         });
  //       }
  //     }
  //     // console.log(res);
  //     res.forEach((day) => {
  //       console.log(day.morning);
  //       console.log(day.afternoon);
  //     });
  //   }
  // });
  collection.find({ "schedule.0": {$exists: true} }).toArray((err, docs) => {
    if(err) console.log(err);
    else {
      let teachersList = [];
      docs.forEach((doc) => {
        doc.schedule.forEach((doc1) => {
          doc1.morning.forEach((doc2) => {
            if(doc2.teacher !== "" && !teachersList.includes(doc2.teacher)) teachersList.push(doc2.teacher);
          });
          doc1.afternoon.forEach((doc2) => {
            if(doc2.teacher !== "" && !teachersList.includes(doc2.teacher)) teachersList.push(doc2.teacher);
          });
        });
      });
      console.log(teachersList);
      // teachersList.sort((a, b) => {
      //   let nameA = a.toUpperCase().split(".")[1];
      //   let nameB = b.toUpperCase().split(".")[1];
      //   if(nameA < nameB) return -1;
      //   if(nameA > nameB) return 1;
      //   return 0;
      // });
     console.log(teachersList.length);
      teachersList.forEach((teacher) => {
        let exist = false;
        template.teachersCheckArray.forEach((check) => {
          if(teacher === check) exist = true;
        });
        if(!exist) console.log("'" + teacher + "'");
      });
    }
  });
});
