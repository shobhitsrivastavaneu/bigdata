const express = require("express");
const {
  createPlan,
  getPlan,
  getPlans,
  deletePlan,
  deletePlans,
} = require("../controller");

const router = express.Router();

router.post("/v1/plan", createPlan);
router.get("/v1/plan", getPlans);
router.get("/v1/plan/:id", getPlan);
router.delete("/v1/plan", deletePlans);
router.delete("/v1/plan/:id", deletePlan);

module.exports = router;
