const { MongoClient } = require('mongodb');
// const connectionUrl = `mongodb+srv://${process.env.DB_USERNAME}:${process.env.DB_PASSWORD}@cluster0-obtbe.mongodb.net/test`;
// const connectionUrl = "mongodb://127.0.0.1:27017"
const connectionUrl = process.env.DATABASE_URI;
const dbName = "database-for-cbner";
const teacherName = "Ngân/Nhân";
MongoClient.connect(connectionUrl, { useNewUrlParser: true, useUnifiedTopology: true }, (err, client) => {
  if(err) {
    return console.log('Failed to connect to database');
  }
  console.log("Connect successfully");
  const db = client.db(dbName);
  const collection = db.collection('schedule');
  collection.find({
    $or: [
      {"schedule.morning.teacher": teacherName},
      {"schedule.afternoon.teacher": teacherName}
    ]
  }).toArray((err, docs) => {
    if(err) console.log(err);
    else {
      let res = [];
      for(let i = 0; i < 6; i ++) { // loop days
        res.push({
          "morning": [],
          "afternoon": []
        });
        for(let j = 0; j < 5; j ++) {
          docs.forEach((doc) => {
            if(doc.schedule[i].morning[j] && doc.schedule[i].morning[j].teacher === teacherName){
              res[i].morning.push(doc.group);
              return;
            }
          });
          docs.forEach((doc) => {
            if(doc.schedule[i].afternoon[j] && doc.schedule[i].afternoon[j].teacher === teacherName){
              res[i].afternoon.push(doc.group);
              return;
            }
          });
        }
      }
      console.log(res);
      res.forEach((day) => {
        console.log(day.morning);
        console.log(day.afternoon);
      });
    }
  });
  // collection.find({}).toArray((err, docs) => {
  //   if(err) console.log(err);
  //   else {
  //     let teachersList = [];
  //     docs.forEach((doc) => {
  //       doc.schedule.forEach((doc1) => {
  //         doc1.morning.forEach((doc2) => {
  //           if(doc2.teacher !== "" && !teachersList.includes(doc2.teacher)) teachersList.push(doc2.teacher);
  //         });
  //         doc1.afternoon.forEach((doc2) => {
  //           if(doc2.teacher !== "" && !teachersList.includes(doc2.teacher)) teachersList.push(doc2.teacher);
  //         });
  //       });
  //     });
  //     console.log(teachersList);
  //     // teachersList.sort((a, b) => {
  //     //   let nameA = a.toUpperCase().split(".")[1];
  //     //   let nameB = b.toUpperCase().split(".")[1];
  //     //   if(nameA < nameB) return -1;
  //     //   if(nameA > nameB) return 1;
  //     //   return 0;
  //     // });
  //     console.log(teachersList.length);
  //     const checkArray = [
  //       'PN.An',       'NT.Bình',  'NV.Bảo',    'PT.Bằng',    'NV.Bình',
  //       'NTT.Dung',    'NT.Dịu',   'NT.Dung',   'LT.Giang',   'NT.Giang',
  //       'NTT.Huyền',   'HT.Hà',    'VT.Huyến',  'NK.Hoàn',    'NT.Hương',
  //       'BT.Hưng',     'ĐT.Hường', 'NT.Huế',    'ĐT.Hương',   'NT.Hà(h)',
  //       'VTT.Hằng',    'HL.Hương', 'ĐT.Hiền',   'NT.Hường',   'NT.Hà(su)',
  //       'NT.Hòa',      'LTT.Hiền', 'PĐ.Hiệp',   'VT.Huê',     'NT.Hoa',
  //       'VB.Huy',      'LN.Hân',   'TV.Kỷ',     'NH.Khánh',   'TT.Khanh',
  //       'TK.Linh',     'LT.Loan',  'NT.Linh',   'VT.Len',     'ND.Liễu',
  //       'NTM.Loan',    'NT.Loan',  'NTH.Liên',  'NT.Lê',      'NT.Lệ',
  //       'VT.Lợi',      'NM.Lan',   'NP.Ly Ly',  'LT.Mùi',     'NQ.Minh',
  //       'NV.Mạnh',     'NT.Nga',   'TB.Ngọc',   'TTB.Ngọc',   'NT.Nhung',
  //       'HT.Nhân',     'LV.Ngân',  'NP.Nga',    'DTT.Nga',    'NV.Nga',
  //       'NT.Nguyệt',   'HD.Ngọc',  'NTT.Nhung', 'NV.Phán',    'NTT.Phương',
  //       'TH.Quang',    'NV.Tuấn',  'HT.Thảo',   'TT.Trang',   'NTH.Trang',
  //       'NT.Thu',      'HTT.Thủy', 'NTT.Thuỷ',  'LH.Trang',   'PH.Trang',
  //       'NTP.Thảo',    'NT.Tuyết', 'CT.Thúy',   'NP.Thảo',    'NC.Trung',
  //       'BM.Thủy',     'ĐTT.Toàn', 'NH.Vân',    'PH.Vân',     'NT.Vân',
  //       'TTB.Vân',     'NĐ.Vang',  'TH.Xuân',   'NT.Yến (đ)', 'TT.Yến',
  //       'NT.Yến (nn)', 'HTN.Ánh',  'TN.Điệp',   'LĐ.Điển',    'NT.Đức',
  //       'TV.Điệp',     'NT.Đô',    'Shaine',    'VD.Khanh',   'Ngân/Nhân',
  //       'VK.Oanh',     'HT.Toan',  'LX.Cường',  'NQ.Huy',     'LT.Vui'
  //     ];
  //     teachersList.forEach((teacher) => {
  //       let exist = false;
  //       checkArray.forEach((check) => {
  //         if(teacher === check) exist = true;
  //       });
  //       if(!exist) console.log("'" + teacher + "'");
  //     });
  //
  //   }
  // });
});
