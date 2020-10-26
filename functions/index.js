const functions = require('firebase-functions');
var admin = require("firebase-admin");
var CronJob = require('cron').CronJob;
var request = require("request");
var serviceAccount = require("./service-account.json");
const { time } = require('cron');
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://testeverything-63c3c.firebaseio.com"
});
var db = admin.database();
var CronJob = require('cron').CronJob;
console.log('Start');

function isEmpty(obj) {
  for(var key in obj) {
      if(obj.hasOwnProperty(key))
          return false;
  }
  return true;
}
function Alert_text_type(path,key) {
  if(key=='type'){
    return db.ref('Alert_text_type/'+path)
    .once('value')
    .then(function(bref) {
        var data= bref.val();
        return data
    });
  }
  if(key=='id'){
    return db.ref('status_and_name/'+path)
    .once('value')
    .then(function(bref) {
        var data= bref.val();
        return data
    });
  }
}
async function sendlineloop(loop,id){
  console.log('Re loop '+ loop);
  if(loop>=60){//เกิน 1 ชม*******************
    if(loop%60==0){ //ไม่มีเศษนาทีเหลือ
      loophr = loop/60;
      loopmin = 0;
    }else {//มีเศษนาทีเหลือ
      loophr = (loop/60).floor();
      loopmin = '*/'+loop%60;
    }
  }else {//*********************************
    loophr = 1;//ไม่เกิน 1 ชม
    loopmin = '*/'+loop;
  }
  var job = new CronJob(loopmin+' */'+loophr+' * * *',async function() {
    console.log('You will see this message every '+loop+' min');
    var ref = db.ref('Alert_text/'+id);
    ref.once("value",async function(snapshot) {
          if(snapshot.val().status=='0' && chack==1){
            var textty = await Alert_text_type(snapshot.val().text,'type')
            var textid = await Alert_text_type(snapshot.val().nameid,'id')
              request({
                method: 'POST',
                uri: 'https://notify-api.line.me/api/notify',
                header: {'Content-Type': 'application/x-www-form-urlencoded'},
                auth: {bearer: 'i6tPLmr1CDgQ9sv62wSueLpnHzSJqqwXRE8kmGpYNy0'},
                form: {message: snapshot.key +' : '
                        + textty +' อุปกรณ์:'+ textid + ' เวลา:'+ snapshot.val().time
                        + ' ซ้ำทุก: ' + snapshot.val().loop+' นาที'
                      }/////message
            })
          }
    });
  }, null, true, 'Asia/Bangkok');
  func[id]=job;
  func[id].start();
  chack=1;
  // for(i=0;i<1000;i++){
  //   func[i]=job;
  // func[i].stop();
  // }
};
   

var chack;
var func={};
var ref = db.ref('Alert_text');
ref.on("value", function(snapshot) {
    snapshot.forEach(function(data){
      if(!isEmpty(func)){
        if(func[data.key]!=null){
          let myjob = func[data.key];
          myjob.stop();
          chack = 0;
        }
      }
      path = '/'+data.key;
      ref = db.ref(path);
      ref.once("value", function(snapshot) {
        if(data.val().status=='0') {
          sendlineloop(data.val().loop,data.key);
        }
      })
    })
  })

var check_onetime = 0;
var REF = db.ref('status_and_name')
  REF.once("value",function(snapshot) {
    snapshot.forEach(function(b){
      REF = db.ref('status_and_name/'+b.key)
      REF.once("value",function(f) {
        f.forEach(function(f){
          REF = db.ref('status_and_name/'+b.key+'/'+f.key)
          REF.once("value",function(snap) {
            snap.forEach(function(th){
              REF = db.ref('status_and_name/'+b.key+'/'+f.key+'/'+th.key)
              REF.once("value", function(k) {
                k.forEach(function(data){
                  REF = db.ref('status_and_name/'+b.key+'/'+f.key+'/'+th.key+'/'+data.key+'/status')
                  REF.on("value",function(s) {
                    if(check_onetime!=0){
                      if(s.val()==2){
                        Alert(b.key+'/'+f.key+'/'+th.key+'/'+data.key+'/name');
                      }
                      if(th.key=='sensor'){
                        const building = (b.key).split("_");
                        const floor = (f.key).split("_");
                        save(building[1]+'/'+floor[1]+'/s/'+data.key,s.val());
                      }
                    }
                })
              })
            })
          })
        })
      })
    })
  })
})
function save(n,s) {
  d = new Date;
  date = d.getFullYear() + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + ("0" + d.getDate()).slice(-2);
  t = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+ ":" + ("0" + d.getSeconds()).slice(-2);
  var REF = db.ref("Status_record/"+date);
  REF.once("value",function(data) {
    k = data.numChildren()+1;
    REF = REF.child(k);
    REF.update({
      name: n,
      status: s,
      time: t,
    });
  })
}
function Alert(path) {
  d = new Date;
  date = ("0" + d.getDate()).slice(-2) + "-" + ("0"+(d.getMonth()+1)).slice(-2) + "-" + d.getFullYear();
  t = ("0" + d.getHours()).slice(-2) + ":" + ("0" + d.getMinutes()).slice(-2)+ ":" + ("0" + d.getSeconds()).slice(-2);
  sp = path.split("/");
  var REF = db.ref("Alert_text");
  REF.once("value",function(data) {
    k = data.numChildren()+1;
    REF = REF.child(k);
    REF.set({
      correction: " ",
      loop: 180,
      nameid: path,
      status: 0,
      text: sp[2]+'/web',
      time: date+" "+t,
      timef: " "
    });
  })
}
setTimeout(function(){ check_onetime = 1; }, 5000);

ref = db.ref('check/check')
var jobb = null;
ref.on("value",function(snapshot) {
  if(snapshot.val()=="on"){
    jobb = new CronJob('*/3 * * * *', function() {// * * * * *
      console.log('Check timeout every 3 min');
      timeout();
    }, null, true, 'Asia/Bangkok');
    jobb.start();
  }else{
    if (jobb) {
      jobb.stop();
    }
  }
})
function timeout() {
  var REF = db.ref('status_and_name')
  REF.once("value",function(snapshot) {
    snapshot.forEach(function(b){
      REF = db.ref('status_and_name/'+b.key)
      REF.once("value",function(f) {
        f.forEach(function(f){
          REF = db.ref('status_and_name/'+b.key+'/'+f.key+'/board/1/datetime')
          REF.once("value",function(snap) {
            if(snap.val()){
              var dt = snap.val();
              dt = dt.split(" ");
              d = dt[0].split("-");
              t = dt[1].split(":");
              datetimenow = new Date;
              datetime = new Date(d[2],d[1]-1,d[0],t[0],t[1]);
              var cou = (datetimenow - datetime)/(60*1000);
              if(cou>=3){
                changstatus('status_and_name/'+b.key+'/'+f.key+'/board/1/status');
              }
            }
          })
        })
      })
    })
  })
}
function changstatus(path) {
  var REF = db.ref(path)
  REF.set(2);
}

function notification(body) {
  var REF = db.ref('token')
  REF.once("value",function(snapshot) {
    snapshot.forEach(function(token){
      if(token.key!=null){
        const options = {
          priority: "normal",
          timeToLive: 60 * 10
      }
        const payload = {
          notification: {title: "Parking Alert",body: body,}
        }
        try{
         admin.messaging().sendToDevice(token.key, payload,options);
         console.log('send');
        }catch(err){
         console.log(err);
        }
      }
    });
  });
}
// notification('test 3');


var REF = db.ref('status_and_name')
  REF.once("value",function(snapshot) {
    snapshot.forEach(function(b){
      REF = db.ref('status_and_name/'+b.key)
      REF.once("value",function(f) {
        f.forEach(function(f){
          REF = db.ref('status_and_name/'+b.key+'/'+f.key+'/board/1/status')
          var bb = b.key;bb = bb.split("_");
          var ff = f.key;ff = ff.split("_");
          REF.on("value",function(b1status) {
            console.log(b1status.val());
            if(b1status.val()==2){
              const ref = db.ref('Alert_text_type/sensor/app')
              ref.once("value",function(text) {
                // notification('อาคาร '+b.key+' ชั้น '+f.key+' '+text.val());
                console.log('อาคาร '+bb[1]+' ชั้น '+ff[1]+' '+text.val());
              });
            }else if(b1status.val()==1){
              const ref = db.ref('status_and_name/'+b.key+'/'+f.key+'/sensor')
              ref.once("value",function(text) {
              });

            }
          });
        });
      });
    });
  });