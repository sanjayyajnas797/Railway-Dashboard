import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import pumpImage from "./assets/pumped.png";
import "./App.css";

const socket = io(
  "https://railway-dashboard-rdii.onrender.com"
);

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
  dashboard.digitalOutputs?.DO0 === 1 &&
  dashboard.digitalOutputs?.DO1 !== 1;




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
    <span>SIGNAL</span>
    <h2>
      {dashboard.deviceInfo.signal}
    </h2>
  </div>



  {/* NEW */}

  <div className="info-card">
    <span>MQTT </span>
    <h2>
      {
        dashboard.deviceInfo.mqttStatus || "OFFLINE"
      }
    </h2>
  </div>

 

  <div className="info-card">
    <span>LAST PID</span>
    <h2>
      {
        dashboard.telemetry?.lastPID || "--"
      }
    </h2>
  </div>

  <div className="info-card">
    <span> PACKET</span>
    <h2>
      {
        dashboard.deviceInfo.lastPacketTime || "--"
      }
    </h2>
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

  <button className="view-btn">
    View All
  </button>

</div>





            <div className="pump-grid">

             

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
        {dashboard.solar?.power || 0} W
      </h3>

    </div>

  </div>





  {/* PIPELINE */}

  <div className="pipeline-layout">

    <div className="solar-source">
      ☀
    </div>

    <div
      className={
        isPumpRunning
          ? "pipe-line flow-active"
          : "pipe-line"
      }
    ></div>

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

    <div className="smart-tank">

      <div
        className={
          isPumpRunning
            ? "tank-water water-running"
            : "tank-water"
        }
      ></div>

    </div>

  </div>





  {/* INFO */}

  <div className="pump-info-grid">

    <div className="pump-info-card">

      <span>SOLAR POWER</span>

      <h4
        style={{
          color:
            dashboard.solar?.status === "ONLINE"
              ? "#00ff95"
              : "#ff3355"
        }}
      >
        {dashboard.solar?.power || 0} W
      </h4>

    </div>





    <div className="pump-info-card">

      <span>PUMP RUNTIME</span>

      <h4 style={{ color:"#00e5ff" }}>

        {
          dashboard.pumps.pump1.runtime
            || "0h 0m 0s"
        }

      </h4>

    </div>





    <div className="pump-info-card">

      <span>OUTPUT</span>

      <h4>

        {
          isPumpRunning
            ? "ACTIVE"
            : "OFFLINE"
        }

      </h4>

    </div>





    <div className="pump-info-card">

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

                

            </div>

          </div>









          {/* DIGITAL INPUT */}

          <div className="section-card">

            <div className="title-row">

  <div className="section-title">
    📡 DIGITAL INPUT STATUS
  </div>

  <button className="view-btn">
    View All
  </button>

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

                      <span>
                        {key}
                      </span>

                      <h2>
                        {value}
                      </h2>

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








      {/* REGISTERS */}

<div className="section-card">

  <div className="title-row">

  <div className="section-title">
    🌞 SOLAR SENSOR REGISTERS
  </div>

  <button className="view-btn">
    View All
  </button>

</div>
  <div className="register-grid">

    {
      dashboard.registers.map(
        (item, index) => (

          <div
            key={index}
            className="register-box"
          >

            <span>
              RG{index}
            </span>

            <h2>
              {item.value}
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


  

