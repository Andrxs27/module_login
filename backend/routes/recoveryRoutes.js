const express = require("express");
const router = express.Router();

const recoveryController = require("../controllers/recoveryController");

router.post("/recovery", recoveryController.enviarRecovery);
router.post("/nueva-password", recoveryController.guardarNuevaPassword);

module.exports = router;