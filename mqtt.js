// const mqtt = require("mqtt");
// const fs = require("fs");

// const client = mqtt.connect(
//   "mqtt://broker.emqx.io:1883"
// );



// // ========================================
// // RUNTIME FILE
// // ========================================

// const runtimeFile =
//   "./runtime.json";



// let runtimeData =
//   JSON.parse(
//     fs.readFileSync(runtimeFile)
//   );



// // ========================================
// // SAVE RUNTIME
// // ========================================

// const saveRuntime = () => {

//   fs.writeFileSync(
//     runtimeFile,
//     JSON.stringify(
//       runtimeData,
//       null,
//       2
//     )
//   );

// };



// // ========================================
// // FORMAT TIME
// // ========================================

// const formatRuntime = (ms) => {

//   const totalSeconds =
//     Math.floor(ms / 1000);

//   const hours =
//     Math.floor(totalSeconds / 3600);

//   const minutes =
//     Math.floor(
//       (totalSeconds % 3600) / 60
//     );

//   const seconds =
//     totalSeconds % 60;

//   return `${hours}h ${minutes}m ${seconds}s`;

// };



// // ========================================
// // DASHBOARD
// // ========================================

// let dashboard = {

//   pumps: {

//     pump1: {
//       name: "MAIN PUMP",
//       status: "OFF",
//       runtime: "0h 0m 0s",
//       lastUpdated: "--"
//     }

//   },



//   deviceInfo: {

//     signal: "--",
//     operator: "--",
//     ip: "--",
//     imei: "--",
//     firmware: "--",

//     live: "OFFLINE",

//     gprsTx: 0,
//     gprsRx: 0,

//     lived: 0,

//     mqttPackets: 0,
//     lastPacketTime: "--",

//     mqttStatus: "OFFLINE"

//   },



//   telemetry: {

//     online: false,

//     totalPackets: 0,

//     lastPID: "--"

//   },



//   solar: {

//     power: 0,

//     status: "OFFLINE"

//   },



//   digitalInputs: {

//     DI0: 0,
//     DI1: 0,
//     DI2: 0,
//     DI3: 0

//   },



//   digitalOutputs: {

//     DO0: 0,
//     DO1: 0,
//     DO2: 0,
//     DO3: 0

//   },



//   registers: Array.from(
//     { length: 32 },
//     () => ({
//       value: "--",
//       updated: "--"
//     })
//   )

// };



// // ========================================
// // MQTT CONNECT
// // ========================================

// client.on("connect", () => {

//   console.log("MQTT Connected");

//   dashboard.deviceInfo.mqttStatus =
//     "CONNECTED";

//   dashboard.telemetry.online =
//     true;

//   client.subscribe(
//     "CWT00004:JSON"
//   );

// });



// // ========================================
// // MQTT MESSAGE
// // ========================================

// client.on("message", (topic, message) => {

//   try {

//     const data = JSON.parse(
//       message.toString()
//     );

//     console.log("MQTT =>", data);





//     dashboard.telemetry.totalPackets++;

//     dashboard.deviceInfo.mqttPackets++;

//     dashboard.deviceInfo.lastPacketTime =
//       new Date().toLocaleTimeString();

//     dashboard.telemetry.lastPID =
//       data.PID || "--";





//     // ====================================
//     // DO21 / DO22
//     // ====================================

//     if (
//       data.PID === "DO21" ||
//       data.PID === "DO22"
//     ) {

//      // ====================================
// // DIGITAL OUTPUT UPDATE
// // ====================================

// dashboard.digitalInputs.DI0 =
//   data.DO0 ?? dashboard.digitalInputs.DI0;

// dashboard.digitalInputs.DI1 =
//   data.DO1 ?? dashboard.digitalInputs.DI1;

// dashboard.digitalInputs.DI2 =
//   data.DO2 ?? dashboard.digitalInputs.DI2;

// dashboard.digitalInputs.DI3 =
//   data.DO3 ?? dashboard.digitalInputs.DI3;





// dashboard.digitalOutputs.DO0 =
//   data.DO0 ?? dashboard.digitalOutputs.DO0;

// dashboard.digitalOutputs.DO1 =
//   data.DO1 ?? dashboard.digitalOutputs.DO1;

// dashboard.digitalOutputs.DO2 =
//   data.DO2 ?? dashboard.digitalOutputs.DO2;

// dashboard.digitalOutputs.DO3 =
//   data.DO3 ?? dashboard.digitalOutputs.DO3;





// // ====================================
// // MAIN PUMP START
// // ====================================

// if (data.DO0 === 1) {

//   dashboard.pumps.pump1.status =
//     "ON";



//   dashboard.digitalOutputs.DO1 = 0;



//   if (
//     runtimeData.pump1.startTime === null
//   ) {

//     runtimeData.pump1.startTime =
//       Date.now();

//   }

// }





// // ====================================
// // MAIN PUMP STOP
// // ====================================

// if (data.DO1 === 1) {

//   dashboard.pumps.pump1.status =
//     "OFF";



//   dashboard.digitalOutputs.DO0 = 0;



//   if (
//     runtimeData.pump1.startTime
//   ) {

//     runtimeData.pump1.totalRuntime +=
//       Date.now() -
//       runtimeData.pump1.startTime;

//     runtimeData.pump1.startTime =
//       null;

//     saveRuntime();

//   }

// }




//       dashboard.pumps.pump1.lastUpdated =
//         new Date().toLocaleTimeString();

//     }





//     // ====================================
//     // DC03
//     // ====================================

//     if (data.PID === "DC03") {

//       dashboard.solar.power =
//         data.Power || 0;

//       dashboard.solar.status =
//         "ONLINE";

//     }





//     // ====================================
//     // RG80
//     // ====================================

//     if (data.PID === "RG80") {

//       const ch = data.CH;

//       const value =
//         data[`RGV${ch}`];

//       if (value !== undefined) {

//         dashboard.registers[ch] = {

//           value,

//           updated:
//             new Date().toLocaleTimeString()

//         };

//       }

//     }





//     // ====================================
//     // LIVE RUNTIME
//     // ====================================

//     let pump1Ms =
//       runtimeData.pump1.totalRuntime;

//     if (
//       runtimeData.pump1.startTime
//     ) {

//       pump1Ms +=
//         Date.now() -
//         runtimeData.pump1.startTime;

//     }



//     dashboard.pumps.pump1.runtime =
//       formatRuntime(pump1Ms);





//     // ====================================
//     // SOCKET
//     // ====================================

//     if (global.io) {

//       global.io.emit(
//         "dashboardData",
//         dashboard
//       );

//     }

//   }

//   catch (err) {

//     console.log(err);

//   }

// });



// // ========================================
// // AUTO SAVE
// // ========================================

// setInterval(() => {

//   saveRuntime();

// }, 5000);



// // ========================================
// // PUMP ON
// // ========================================

// const pump1On = () => {

//   // DO0 HIGH
//   client.publish(
//     "CWT00004:CWTIO-SVR",
//     "$%%IOOH0$"
//   );

//   console.log(
//     "Pump ON Command Sent"
//   );



//   // DO0 LOW RESET
//   setTimeout(() => {

//     client.publish(
//       "CWT00004:CWTIO-SVR",
//       "$%%IOOL0$"
//     );

//     console.log(
//       "DO0 LOW Reset Sent"
//     );

//   }, 1000);

// };



// // ========================================
// // PUMP OFF
// // ========================================

// const pump1Off = () => {

//   // DO1 HIGH
//   client.publish(
//     "CWT00004:CWTIO-SVR",
//     "$%%IOOH1$"
//   );

//   console.log(
//     "Pump OFF Command Sent"
//   );



//   // DO1 LOW RESET
//   setTimeout(() => {

//     client.publish(
//       "CWT00004:CWTIO-SVR",
//       "$%%IOOL1$"
//     );

//     console.log(
//       "DO1 LOW Reset Sent"
//     );

//   }, 1000);

// };



// // ========================================
// // EXPORT
// // ========================================

// module.exports = {

//   dashboard,

//   pump1On,
//   pump1Off

// };