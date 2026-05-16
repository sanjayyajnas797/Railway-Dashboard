import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import grid from './assets/sanj.png';
import sun from './assets/sol.webp';
import signal from './assets/signal.png';
import pid from './assets/pid.webp'
import "./App.css";

const socket = io(
  "https://railway-dashboard-rdii.onrender.com"
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

  RG21: "Reserved",
  RG22: "Reserved",
  RG23: "Reserved",
  RG24: "Reserved",
  RG25: "Reserved",
  RG26: "Reserved",
  RG27: "Reserved",
  RG28: "Reserved",
  RG29: "Reserved",
  RG30: "Reserved",
  RG31: "Reserved"

};

export default function App() {
  const [commandPopup,setCommandPopup] =
useState("");
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

    getDashboard();

    socket.on(
      "dashboardData",
      (data) => {

        setDashboard({ ...data });

      }
    );





    return () => {

      socket.off("dashboardData");

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



  return (

    

  <div className="app-layout">

    {/* SIDEBAR */}

    <div className="sidebar">

      <div className="logo-box">
        ⚡
      </div>

      <div className="menu-list">

        <div className="menu-item active-menu">
          Dashboard
        </div>

        <div className="menu-item">
          Pump Control
        </div>

        <div className="menu-item">
          Sensor Data
        </div>

        <div className="menu-item">
          Telemetry
        </div>

        <div className="menu-item">
          Alerts
        </div>

        <div className="menu-item">
          Reports
        </div>

        <div className="menu-item">
          Settings
        </div>

      </div>

    </div>

   

  












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
        dashboard.telemetry?.lastPID || "--"
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
        dashboard.deviceInfo.lastPacketTime || "--"
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





  <div className="pipeline-layout">

  {/* SOLAR IMAGE */}

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



  <div
    className={
      isPumpRunning
        ? "pipe-line flow-active"
        : "pipe-line"
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

      <div className="head-cap"></div>

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



  <div
    className={
      isPumpRunning
        ? "pipe-line flow-active"
        : "pipe-line"
    }
  ></div>



  {/* GRID POWER */}

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

</div>


     {/* INFO */}

<div className="pump-info-grid">

  {/* PUMP RUNTIME */}

  <div className="pump-info-card runtime-main-card">

    <span>PUMP RUNTIME</span>

    <h4 style={{ color:"#00e5ff" }}>

      {
        dashboard.pumps.pump1.runtime
          || "0h 0m 0s"
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



  {/* INVERTER STATUS */}

  <div className="pump-info-card status-main-card">

    <span>INVERTER STATUS</span>

    <h4
      style={{
        color:
          dashboard.registers?.[12]?.value === 59
            ? "#00ff88"
            : "#ff3355"
      }}
    >

      {
        dashboard.registers?.[12]?.value === 59
          ? "RUNNING"
          : "STOPPED"
      }

    </h4>

  </div>



  {/* LAST UPDATE */}

  <div className="pump-info-card update-main-card">

    <span>LAST UPDATE</span>

    <h4>

      {
        dashboard.pumps.pump1.lastUpdated
          || "--"
      }

    </h4>

  </div>

</div>







  
  




  {/* BUTTON */}

  <div className="btn-row">

    <button
      className="start-btn"
      onClick={() =>
        controlPump("pump1", "on")
      }
    >
      START
    </button>





    <button
      className="stop-btn"
      onClick={() =>
        controlPump("pump1", "off")
      }
    >
      STOP
    </button>

  </div>

</div>
          <div className="digital-floating-panel">

  <div className="digital-floating-title">
    📡 DIGITAL INPUT STATUS
  </div>

  <div className="digital-grid">

    {
      Object.entries(
        dashboard.digitalInputs
      ).map(
        ([key, value]) => (

          <div
            key={key}
            className={
              value === 1
                ? "digital-box green-box"
                : "digital-box red-box"
            }
          >

            <span>{key}</span>

            <h2>{value}</h2>

            <p>
              {
                value === 1
                  ? "ACTIVE"
                  : "INACTIVE"
              }
            </p>

          </div>

        )
      )
    }

  </div>

</div>
                

            </div>

          </div>









        

        </div>








      {/* REGISTERS */}

<div className="section-card">

  <div className="title-row">

  <div className="section-title">
    🌞 SOLAR SENSOR REGISTERS
  </div>

 

</div>
  <div className="register-grid">

   {
  dashboard.registers
    .slice(0, 21)
    .map(
      (item, index) => (

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
              || `RG${index}`
            }
          </span>

          <h2 className="register-value">

{
  index === 0 || index === 3
    ? `${(Number(item.value || 0) / 1000).toFixed(1)} kV`

  : index === 1 || index === 4
    ? `${Number(item.value || 0)} A`

  : index === 2 || index === 6
    ? `${(Number(item.value || 0) / 1000).toFixed(1)} kW`

  : index === 5
    ? `${(Number(item.value || 0) / 1000).toFixed(1)} kHz`

  : index === 10
    ? `${(Number(item.value || 0) / 10).toFixed(1)} °C`

  : index === 11
    ? `${Number(item.value || 0)} Hrs`

  : index === 9
    ? item.value === 194
      ? "CONNECTED"
      : "DISCONNECTED"

  : index === 12
    ? item.value === 59
      ? "RUNNING"
      : "STOPPED"

  : Number(item.value || 0).toLocaleString()
}

</h2>

          <p className="rg-update">
            {
              item.updated || "--"
            }
          </p>

        </div>

      )
    )
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


  

