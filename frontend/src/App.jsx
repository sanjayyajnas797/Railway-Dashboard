import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import grid from './assets/sanj.png';
import sun from './assets/sol.webp';
import signal from './assets/signal.png';
import pid from './assets/pid.webp'
import "./App.css";

const socket = io(
  "https://railway-dashboard-rdii.onrender.com",
  {
    transports:["websocket"],

    reconnection:true,

    reconnectionAttempts:999999,

    reconnectionDelay:1000
  }
);

const registerNames = {

  RG0:  "PV1 Voltage (V)",
  RG1:  "PV1 Current (A)",
  RG2:  "PV1 Power (W)",

  RG3:  "R Phase Voltage (V)",
  RG4:  "R Phase Current (A)",
  RG5:  "R Frequency (Hz)",

  RG6:  "AC Output Power (W)",
  RG7:  "Cumulative Production (kWh)",
  RG8:  "Daily Production (kWh)",

  RG9:  "Grid Status",

  RG10: "Heat Sink Temp (°C)",

  RG11: "Grid-Tied Runtime",

  RG12: "Inverter Status",

  RG13: "Serial Number",
  RG14: "Serial Number",
  RG15: "Serial Number",
  RG16: "Serial Number",
  RG17: "Serial Number",

 RG18: "General Setting",

RG19: "MPPT Number",

RG20: "Inverter Type",

RG21: "Frequency (Hz)",

RG22: "Output Voltage (Vout)",

RG23: "Input Current (Ipv)",

RG24: "Input Power (Ppv)",

RG25: "Input Voltage (Vpv)",

RG26: "Energy kWH",

RG27: "Motor Power",

RG28: "DR_trip",

RG29: "Energy & Time Reset",

RG30: "Runtime",

RG31: "Temperature"

};

export default function App() {
  const [commandPopup,setCommandPopup] =
useState("");

const [showPasswordPopup,setShowPasswordPopup] =
useState(false);

const [password,setPassword] =
useState("");

const [pendingAction,setPendingAction] =
useState(null);


  const [dashboard, setDashboard] = useState({

    pumps: {

      pump1: {
        name: "PUMP 1",
        status: "OFF"
      },

      pump2: {
        name: "PUMP 2",
        status: "OFF"
      }

    },

    deviceInfo: {

      signal: "--",
      operator: "--",
      ip: "--",
      imei: "--",
      firmware: "--",
      live: "OFFLINE",

      gprsTx: 0,
      gprsRx: 0,
      lived: 0

    },

    solarPower: 0,

    digitalInputs: {

      DI0: 0,
      DI1: 0,
      DI2: 0,
      DI3: 0

    },

    registers: Array(32).fill(0)

  });





  const [time, setTime] = useState(new Date());





  useEffect(() => {

    const interval = setInterval(() => {

      setTime(new Date());

    }, 1000);

    return () => clearInterval(interval);

  }, []);









  const getDashboard = async () => {

    try {

      const res =
        await axios.get(
  "https://railway-dashboard-rdii.onrender.com/api/dashboard"
);

      setDashboard(res.data);

    }

    catch (err) {

      console.log(err);

    }

  };



  useEffect(() => {

  // initial dashboard
  getDashboard();

  // socket connected
  socket.on("connect", () => {

    console.log(
      "Socket Connected:",
      socket.id
    );

  });

  // realtime data
  socket.on(
    "dashboardData",
    (data) => {

      console.log(
        "Realtime MQTT Data:",
        data
      );

      setDashboard(data);

    }
  );

  // disconnected
  socket.on(
    "disconnect",
    () => {

      console.log(
        "Socket Disconnected"
      );

    }
  );

  return () => {

    socket.off("connect");

    socket.off("dashboardData");

    socket.off("disconnect");

  };

}, []);














const controlPump =
async (pumpName, action) => {

  try {

    setCommandPopup(

      action === "on"

      ? `✅ ${pumpName.toUpperCase()} RUNNING STARTED`

      : `🛑 ${pumpName.toUpperCase()} STOPPED`

    );

    setTimeout(() => {

      setCommandPopup("");

    },5000);

    await axios.post(
  `https://railway-dashboard-rdii.onrender.com/api/${pumpName}/${action}`
);

  }

  catch(err){

    console.log(err);

  }

};



const isPumpRunning =
  dashboard.pumps?.pump1?.status === "ON";



  const verifyAndSendCommand = async () => {

  // PASSWORD CHECK

  if(password !== "1234"){

    alert("Invalid Password");

    return;
  }

  try{

    await controlPump(
      pendingAction.pump,
      pendingAction.action
    );

    setShowPasswordPopup(false);

    setPassword("");

    setPendingAction(null);

  }

  catch(err){

    console.log(err);

  }

};



  return (

    

  <div className="app-layout">

    {/* SIDEBAR */}


  












      {/* MAIN */}

      <div className="main-container">





       <div className="top-header">

  <div className="mobile-menu">
    ☰
  </div>

  <div className="mobile-logo">
    ⚡
  </div>

  <div className="mobile-header-content">

    <h1>
      INDIAN RAILWAY SOLAR MONITORING SYSTEM
    </h1>

    <p>
      Real Time Solar Pump & Telemetry Dashboard
    </p>

  </div>

  <div className="header-right">

    <div
      className={
        dashboard.deviceInfo.mqttStatus === "CONNECTED"
        ? "live-box online"
        : "live-box offline"
      }
    >

      <div className="live-dot"></div>

      {
        dashboard.deviceInfo.mqttStatus || "OFFLINE"
      }

    </div>

  </div>

    {
  showPasswordPopup && (

    <div className="password-popup-overlay">

      <div className="password-popup-box">

        <h2>
          AUTHORIZATION REQUIRED
        </h2>

        <p>
          Enter Control Password
        </p>

        <input
          type="password"
          placeholder="Enter Password"
          value={password}
          onChange={(e)=>
            setPassword(e.target.value)
          }
        />

        <div className="password-popup-btns">

          <button
            className="popup-cancel-btn"
            onClick={()=>{
              setShowPasswordPopup(false);
              setPassword("");
            }}
          >
            CANCEL
          </button>

          <button
            className="popup-confirm-btn"
            onClick={verifyAndSendCommand}
          >
            CONFIRM
          </button>

        </div>

      </div>

    </div>

  )
}

</div>





{
  commandPopup && (

    <div className="top-command-popup">

      ⚡ {commandPopup}

    </div>

  )
}


       {/* DEVICE INFO */}

<div className="info-grid">

 <div className="info-card">

  <div className="info-icon-wrap">
    <img
      src={signal}
      alt=""
      className="info-animated-icon"
    />
  </div>

  <div className="info-content">

    <span>SIGNAL</span>

    <h2>
      {dashboard.deviceInfo.signal}
    </h2>

  </div>

</div>



  {/* NEW */}

  <div className="info-card">

  <div className="info-icon-wrap mqtt-glow">
    📶
  </div>

  <div className="info-content">

    <span>MQTT</span>

    <h2>
      {
        dashboard.deviceInfo.mqttStatus || "OFFLINE"
      }
    </h2>

  </div>

</div>

 

 <div className="info-card">

  <div className="info-icon-wrap pid-glow">
    ⚙️
  </div>

  <div className="info-content">

   <span>LAST PID</span>

<h2>
  {
    dashboard.telemetry?.lastPID
    || "--"
  }
</h2>

  </div>

</div>

 <div className="info-card">

  <div className="info-icon-wrap clock-glow">
    ⏱️
  </div>

  <div className="info-content">

  <span>PACKET</span>

<h2>
  {
    dashboard.telemetry?.lastPacketTime
    || "--"
  }
</h2>

  </div>

</div>

</div>




        {/* TOP GRID */}

        <div className="top-grid">





          {/* PUMP SECTION */}

          <div className="section-card">

            <div className="title-row">

  <div className="section-title">
    ⚡ PUMP CONTROL CENTER
  </div>

  

</div>





           <div className="pump-layout-wrapper">

             

                  <div
  className={
    isPumpRunning
      ? "railway-pump-card active-pump"
      : "railway-pump-card inactive-pump"
  }
>

  {/* TOP */}

  <div className="pump-top-row">

    <div>

      <div className="pump-title">
        MAIN PUMP
      </div>

      <div
        className={
          isPumpRunning
            ? "live-status running-status"
            : "live-status stopped-status"
        }
      >

        <div className="status-dot"></div>

        {
          isPumpRunning
            ? "RUNNING"
            : "STOPPED"
        }

      </div>

    </div>

    <div className="rpm-box">

      <span>
        SOLAR POWER
      </span>

      <h3>
       {dashboard.registers?.[2]?.value || 0} W
      </h3>

    </div>

  </div>





 <div className="advanced-energy-layout">

  {/* SOLAR */}

  <div className="energy-side solar-side">

    <div
      className={
        isPumpRunning
          ? "solar-panel-box active-solar"
          : "solar-panel-box"
      }
    >

      <img
        src={sun}
        alt=""
        className={
          isPumpRunning
            ? "solar-panel-img solar-active"
            : "solar-panel-img"
        }
      />

    </div>

    <div className="energy-register-box solar-register-box">

      <div className="energy-register-item">
        <span>VOLTAGE</span>
        <h4>
          {dashboard.registers?.[0]?.value || "--"} V
        </h4>
      </div>

      <div className="energy-register-item">
        <span>CURRENT</span>
        <h4>
          {dashboard.registers?.[1]?.value || "--"} A
        </h4>
      </div>

      

    </div>

  </div>



  {/* PIPE */}

  <div
    className={
      isPumpRunning
        ? "main-energy-line flow-active"
        : "main-energy-line"
    }
  ></div>



  {/* PUMP */}

  <div
    className={
      isPumpRunning
        ? "ultra-pump ultra-running"
        : "ultra-pump ultra-stop"
    }
  >

    <div className="ultra-motor-head">

      <div className="motor-grills"></div>

    </div>

    <div className="ultra-body">

      <div
        className={
          isPumpRunning
            ? "ultra-fan ultra-spin"
            : "ultra-fan"
        }
      >

        <div className="fan-core"></div>

        <div className="fan-blade blade1"></div>
        <div className="fan-blade blade2"></div>
        <div className="fan-blade blade3"></div>
        <div className="fan-blade blade4"></div>
        <div className="fan-blade blade5"></div>

      </div>

    </div>

  </div>



  {/* PIPE */}

  <div
    className={
      isPumpRunning
        ? "main-energy-line flow-active"
        : "main-energy-line"
    }
  ></div>



  {/* GRID */}

  <div className="energy-side grid-side">

    <div
      className={
        isPumpRunning
          ? "grid-box active-grid"
          : "grid-box"
      }
    >

      <img
        src={grid}
        alt=""
        className={
          isPumpRunning
            ? "grid-img grid-active"
            : "grid-img"
        }
      />

      <div className="grid-energy-ring"></div>

      <div className="grid-pulse"></div>

    </div>

   

      
      <div className="energy-register-box grid-register-box">

  {/* GRID STATUS */}

  <div className="energy-register-item grid-status-item">

    <span>GRID STATUS</span>

    <h4
      className={
        dashboard.registers?.[9]?.value == 1
          ? "grid-online-text"
          : "grid-offline-text"
      }
    >

      {
        dashboard.registers?.[9]?.value == 1
          ? "ONLINE"
          : "OFFLINE"
      }

    </h4>

  </div>



  {/* GRID RUNTIME */}

  <div className="energy-register-item grid-runtime-item">

    <span>GRID-TIED RUNTIME</span>

    <h4>

      {
        dashboard.registers?.[11]?.value
        || "--"
      }

    </h4>

  </div>


      

      

     

    </div>

  </div>

</div>


     {/* INFO */}

<div className="pump-info-grid">

  {/* PUMP RUNTIME */}

  <div className="pump-info-card runtime-main-card">

  <span>PUMP RUNTIME</span>

  <h4 style={{ color:"#00e5ff" }}>

    {
      dashboard.registers?.[30]?.value
        || "--"
    }

  </h4>

</div>

<div className="pump-info-card power-main-card">

  <span>MOTOR POWER</span>

  <h4 style={{ color:"#00ff88" }}>

    {
      dashboard.registers?.[27]?.value || "--"
    }

  </h4>

</div>

  {/* MOTOR TEMP */}

  <div className="pump-info-card temp-main-card">

    <span>MOTOR TEMP</span>

    <h4 style={{ color:"#ffb347" }}>

      {
        dashboard.registers?.[10]?.value || 0
      } °C

    </h4>

  </div>

    <div className="pump-info-card energy-main-card">

  <span>ENERGY kWH</span>

  <h4 style={{ color:"#00ff88" }}>

    {
      dashboard.registers?.[26]?.value || "--"
    }

  </h4>

</div>

 





</div>







  
  




  {/* BUTTON */}

  <div className="btn-row">

    <button
      className="start-btn"
      onClick={() => {

  setPendingAction({
    pump:"pump1",
    action:"on"
  });

  setShowPasswordPopup(true);

}}
    >
      START
    </button>





    <button
      className="stop-btn"
      onClick={() => {

  setPendingAction({
    pump:"pump1",
    action:"off"
  });

  setShowPasswordPopup(true);

}}
    >
      STOP
    </button>

  </div>

</div>
         
                

            </div>

          </div>









        

        </div>








      {/* REGISTERS */}


      {/* =======================================
SOLAR INPUT STATUS
======================================= */}

<div className="section-card register-section">

  <div className="title-row">

    <div className="section-title">
      🌞 SOLAR INVERTER PARAMETER
    </div>

  </div>

  <div className="register-grid">

    {
      dashboard.registers
        .slice(0,13)
        .map((item,index)=>(

          <div
            key={index}
            className={`
              register-box

              ${index === 0 || index === 3
                ? "voltage-card" : ""}

              ${index === 1 || index === 4
                ? "current-card" : ""}

              ${index === 2 || index === 6 || index === 7 || index === 8
                ? "power-card" : ""}

              ${index === 10
                ? "temp-card" : ""}

              ${index === 9 || index === 12
                ? "status-card" : ""}

              ${index === 11
                ? "runtime-card" : ""}
            `}
          >

            <span>
              {
                registerNames[`RG${index}`]
              }
            </span>

            <h2 className="register-value">
              {item.value ?? "--"}
            </h2>

            <p className="rg-update">
              {item.updated || "--"}
            </p>

          </div>

        ))
    }

  </div>

</div>

    {/* =======================================
VFD STATUS
======================================= */}

<div className="section-card register-section">

  <div className="title-row">

    <div className="section-title">
      ⚙️ VFD PARAMETER
    </div>

  </div>

  <div className="register-grid">

    {
      dashboard.registers
        .slice(21,32)
        .map((item,index)=>{

          const actualIndex = index + 21;

          return(

            <div
              key={actualIndex}
              className="register-box"
            >

              <span>
                {
                  registerNames[`RG${actualIndex}`]
                }
              </span>

              <h2 className="register-value">

                {item.value ?? "--"}

              </h2>

              <p className="rg-update">

                {item.updated || "--"}

              </p>

            </div>

          )

        })
    }

  </div>

</div>

      </div>
              


      

      {/* MOBILE BOTTOM NAV */}

      <div className="mobile-bottom-nav">

        <div className="bottom-nav-item active-bottom">
          <span>⌂</span>
          <p>Dashboard</p>
        </div>

        <div className="bottom-nav-item">
          <span>⚙</span>
          <p>Pump</p>
        </div>

        <div className="bottom-nav-item">
          <span>📈</span>
          <p>Sensor</p>
        </div>

        <div className="bottom-nav-item">
          <span>🔔</span>
          <p>Alerts</p>
        </div>

        <div className="bottom-nav-item">
          <span>☰</span>
          <p>Settings</p>
        </div>

      </div>

    </div>

  );

}


  

