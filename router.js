const express = require("express");

const router = express.Router();

const mqtt = require("./mqtt");



// ========================================
// DASHBOARD DATA
// ========================================

router.get(
  "/dashboard",
  (req, res) => {

    res.json(
      mqtt.dashboard
    );

  }
);



// ========================================
// TELEMETRY
// ========================================

router.get(
  "/telemetry",
  (req, res) => {

    res.json({
      telemetry:
        mqtt.dashboard.telemetry,

      mqtt:
        mqtt.dashboard.deviceInfo
    });

  }
);



// ========================================
// SOLAR DATA
// ========================================

router.get(
  "/solar",
  (req, res) => {

    res.json(
      mqtt.dashboard.solar
    );

  }
);



// ========================================
// DIGITAL INPUTS
// ========================================

router.get(
  "/digital-inputs",
  (req, res) => {

    res.json(
      mqtt.dashboard.digitalInputs
    );

  }
);



// ========================================
// DIGITAL OUTPUTS
// ========================================

router.get(
  "/digital-outputs",
  (req, res) => {

    res.json(
      mqtt.dashboard.digitalOutputs
    );

  }
);



// ========================================
// REGISTERS
// ========================================

router.get(
  "/registers",
  (req, res) => {

    res.json(
      mqtt.dashboard.registers
    );

  }
);



// ========================================
// SINGLE REGISTER
// ========================================

router.get(
  "/register/:id",
  (req, res) => {

    const id =
      parseInt(req.params.id);

    const register =
      mqtt.dashboard.registers[id];

    res.json(register);

  }
);



// ========================================
// DEVICE INFO
// ========================================

router.get(
  "/device-info",
  (req, res) => {

    res.json(
      mqtt.dashboard.deviceInfo
    );

  }
);



// ========================================
// PUMP STATUS
// ========================================

router.get(
  "/pumps",
  (req, res) => {

    res.json(
      mqtt.dashboard.pumps
    );

  }
);



// ========================================
// PUMP 1 ON
// ========================================

router.post(
  "/pump1/on",
  (req, res) => {

    mqtt.pump1On();

    res.json({
      success: true,
      message:
        "Pump 1 Started"
    });

  }
);



// ========================================
// PUMP 1 OFF
// ========================================

router.post(
  "/pump1/off",
  (req, res) => {

    mqtt.pump1Off();

    res.json({
      success: true,
      message:
        "Pump 1 Stopped"
    });

  }
);



// ========================================
// PUMP 2 ON
// ========================================

router.post(
  "/pump2/on",
  (req, res) => {

    mqtt.pump2On();

    res.json({
      success: true,
      message:
        "Pump 2 Started"
    });

  }
);



// ========================================
// PUMP 2 OFF
// ========================================

router.post(
  "/pump2/off",
  (req, res) => {

    mqtt.pump2Off();

    res.json({
      success: true,
      message:
        "Pump 2 Stopped"
    });

  }
);



// ========================================
// ALL STATUS
// ========================================

router.get(
  "/status",
  (req, res) => {

    res.json({

      mqtt:
        mqtt.dashboard.deviceInfo
          .mqttStatus,

      online:
        mqtt.dashboard
          .telemetry.online,

      packets:
        mqtt.dashboard
          .telemetry.totalPackets,

      lastPID:
        mqtt.dashboard
          .telemetry.lastPID

    });

  }
);



// ========================================
// EXPORT
// ========================================

module.exports = router;