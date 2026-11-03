// ROUTE: memetakan alamat ke fungsi controller
const express = require("express");
const router = express.Router();
const controller = require("../controllers/courseController");
const cekApiKey = require("../middlewares/cekApiKey");

router.get("/", controller.getAll);
router.get("/:id", controller.getOne);
router.post("/", cekApiKey, controller.create);
router.put("/:id", cekApiKey, controller.update);
router.delete("/:id", cekApiKey, controller.remove);

module.exports = router;
