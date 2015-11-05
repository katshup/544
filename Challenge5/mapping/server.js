var fs = require('fs');
var app = require('express')();
var SerialPort = require("serialport");
var xbee = require("xbee-api");
var Q = require("q");
var xbeeAPI = new xbee.XBeeAPI({
  api_mode: 2
});
var xbeeConst = xbee.constants;

var sp = new SerialPort.SerialPort(process.argv[2], {
  baudrate: 9600,
  parser: xbeeAPI.rawParser()
});

var curLocation;
var run;

var sensors = [];
var mapDatas = [];

// counter object
function counter(num){
  this.num = num;
}

// message object
function message(msg){
  this.msg = msg;
}

// sensor object
function sensor(id, idLong){
  var status;
  var frameId;
  var deferred;
  var counter;
  var message;
  var res;
  this.id = id;
  this.idLong = idLong;
}

function mapData(loc){
  this.loc = loc;
  var beacon1;
}

// function for adding a sensors
// does not add a sensor if it already exists
function addSensor(id, idLong){
  var sen;
  var add = true;
  for(var i = 0; i < sensors.length; i++){
    sen = sensors[i];
    if(sen.id == id){
      add = false;
    }
  }

  if(add){
    console.log("new sensor", idLong);
    sensors.push(new sensor(id, idLong));
  }
}

// checks the delivery status and resolves the promise made during the initial send
function checkStatus(frame){
  var sen;
  for(var i = 0; i < sensors.length; i++){
    sen = sensors[i];
    if(frame.id == sen.frameId
        && frame.remote16 == sen.id && frame.deliveryStatus == 0){
        console.log("resolving", frame.id);
        sen.deferred.resolve(frame);
    }
  }
}

// tells the sensor node to start sending back data to us
function startMapping(sensor_num, count, res, msg){
  var sen = sensors[sensor_num];
  sen.message = msg;
  sen.counter = count;
  sen.deferred = Q.defer();
  sen.frameId = xbeeAPI.nextFrameId();
  //var sendingFrame = new sendData(sen.id, "F", sen.frameId);

  sp.write(xbeeAPI.buildFrame({
    type: xbeeConst.FRAME_TYPE.ZIGBEE_TRANSMIT_REQUEST,
    id: sen.frameId,
    destination64: sen.idLong,
    data: [0x1]
  }));

  console.log("sending to ", sen.idLong);

  sen.deferred.promise.timeout(3000)
  .then(function(f){
    sen.counter.num--;
    console.log("command received correctly");
    sen.message.msg += "Sensor " + sen.id + " has started to map;";
    if(sen.counter.num == 0){
      res.json({"msg":sen.message.msg});
    }
  })
  .catch(function(e){
    sen.counter.num--;
    // remove dead sensor
    console.log("Removing dead sensor", sen.id);
    sen.message.msg += "Sensor " + sen.id + " has died;";
    if(sen.counter.num == 0 && sensor.length > 0){
      res.json({"msg":sen.message.msg});
    } else {
      res.json({"msg":"All sensors have died"})
    }
    sensors.splice(sensor_num, 1);
  });
}

function getData(frame){
  var sen = "";
  var idLong = frame.remote64;
  var data = frame.data[0];
  for(var i = 0; i < sensors.length; i++){
    sen = sensors[i];
    if(idLong == sen.idLong){
      sen.counter.num--;
      var dataItem = new mapData(curLocation);
      mapData.beacon1 = data;

      mapDatas.push(dataItem);
      break;
    }
  }
}

var server = app.listen(3000, '0.0.0.0', function(){
  console.log("listening on *:3000");
});

app.get('/startMapping', function(req, res){
  if(sensors.length == 0){
    res.json("msg":"No sensors to start mapping with");
  } else {
    var count = new counter(sensors.length);
    var msg = new message("");
    curLocation = req.query.loc;
    for(var i = 0; i < sensors.length; i++){
      startMapping(i, count, res, msg);
    }
    run = 1;
  }
});

app.get('/mapLoc', function(req, res){
  if(sensors.length == 0){
    res.json("msg":"No sensors to map with");
  } else {
    curLocation = req.query.loc;
    run = 1;
  }
});

app.get('/pauseMapping', function(req, res){
  run = 0;
});

app.get('/dumpData', function(req, res){
  if(mapData.length == 0){
    res.json("msg":"Nothing to write");
  } else {
    fs.writeFile(req.query.fileName, JSON.stringify(mapDatas), function(err){
      if(err){
        res.json("msg":"error writing to file!!");
      } else {
        res.json("msg":"Data was written sucessfully");
      }
    });
  }
});

xbeeAPI.on("frame_object", function(frame){
  console.log(frame); // for debug purposes
  if(frame.type == xbeeConst.FRAME_TYPE.NODE_IDENTIFICATION){
    console.log(frame.sender64);
    addSensor(frame.sender16, frame.sender64);
  } else if (frame.type == xbeeConst.FRAME_TYPE.ZIGBEE_TRANSMIT_STATUS){
    checkStatus(frame);
  } else if (frame.type == xbeeConst.FRAME_TYPE.ZIGBEE_RECEIVE_PACKET){
    if(run == 1){
      console.log("received mapping data");
      getData(frame);
    }
  }
});

sp.on("open",function(){
});
