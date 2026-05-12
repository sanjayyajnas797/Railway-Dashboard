import { useEffect, useState } from "react";
import axios from "axios";
import { io } from "socket.io-client";
import pumpImage from "./assets/pumped.png";
import "./App.css";

const socket = io("http://localhost:5000");

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
          "http://localhost:5000/api/dashboard"
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

      `http://localhost:5000/api/${pumpName}/${action}`

    );

  }

  catch(err){

    console.log(err);

  }

};








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





        {/* HEADER */}

        <div className="top-header">

          <div>

            <h1>
              🚆 INDIAN RAILWAY SOLAR MONITORING SYSTEM
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





            <div className="time-box">

              {
                time.toLocaleTimeString()
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
    <span>MQTT STATUS</span>
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
    <span>LAST PACKET</span>
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

            <div className="section-title">
              ⚡ PUMP CONTROL CENTER
            </div>





            <div className="pump-grid">

              {

                Object.entries(dashboard.pumps).map(
                  ([key, pumpData]) => (

                    <div
                      key={key}
                      className={
                        pumpData.status === "ON"
                          ? "railway-pump-card active-pump"
                          : "railway-pump-card inactive-pump"
                      }
                    >

                      {/* TOP */}

                      <div className="pump-top-row">

                        <div>

                          <div className="pump-title">
                            {pumpData.name}
                          </div>





                          <div
                            className={
                              pumpData.status === "ON"
                                ? "live-status running-status"
                                : "live-status stopped-status"
                            }
                          >

                            <div className="status-dot"></div>

                            {
                              pumpData.status === "ON"
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
                            {
                              dashboard.solarPower
                            } W
                          </h3>

                        </div>

                      </div>








<div className="pipeline-layout">

  {/* SOLAR */}
  <div className="solar-source">
    ☀
  </div>

  {/* LEFT PIPE */}
  <div
    className={
      pumpData.status === "ON"
        ? "pipe-line flow-active"
        : "pipe-line"
    }
  ></div>

  <div
  className={
    pumpData.status === "ON"
      ? "ultra-pump ultra-running"
      : "ultra-pump ultra-stop"
  }
>

  {/* MOTOR */}

  <div className="ultra-motor-head">

    <div className="head-cap"></div>

    <div className="motor-grills"></div>

  </div>

  {/* BODY */}

  <div className="ultra-body">

   

    <div
      className={
        pumpData.status === "ON"
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

  {/* RIGHT PIPE */}
  <div
    className={
      pumpData.status === "ON"
        ? "pipe-line flow-active"
        : "pipe-line"
    }
  ></div>

  {/* TANK */}
  <div className="smart-tank">

    <div
      className={
        pumpData.status === "ON"
          ? "tank-water water-running"
          : "tank-water"
      }
    ></div>

  </div>

</div>








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
      {
        dashboard.solar?.power || 0
      } W
    </h4>

  </div>





  <div className="pump-info-card">

    <span>PUMP RUNTIME</span>

    <h4
      style={{
        color: "#00e5ff"
      }}
    >
      {
        pumpData.runtime || "0h 0m 0s"
      }
    </h4>

  </div>





  <div className="pump-info-card">

    <span>OUTPUT</span>

    <h4>
      {
        pumpData.status === "ON"
          ? "ACTIVE"
          : "OFFLINE"
      }
    </h4>

  </div>





  <div className="pump-info-card">

    <span>LAST UPDATE</span>

    <h4>
      {
        pumpData.lastUpdated || "--"
      }
    </h4>

  </div>

</div>







                      {/* BUTTONS */}

                      <div className="btn-row">

                        <button
                          className="start-btn"
                          onClick={() =>
                            controlPump(key, "on")
                          }
                        >
                          START
                        </button>





                        <button
                          className="stop-btn"
                          onClick={() =>
                            controlPump(key, "off")
                          }
                        >
                          STOP
                        </button>

                      </div>

                    </div>

                  )
                )

              }

            </div>

          </div>









          {/* DIGITAL INPUT */}

          <div className="section-card">

            <div className="section-title">
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

  <div className="section-title">
    🌞 SOLAR SENSOR REGISTERS
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

    </div>

  );

}