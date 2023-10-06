const Ajv = require("ajv");

const planCostSharesSchema = {
  type: "object",
  properties: {
    deductible: { type: "integer", nullable: false },
    copay: { type: "integer", nullable: false },
    _org: { type: "string", nullable: false },
    objectId: { type: "string", nullable: false },
    objectType: { type: "string", nullable: false },
  },
  required: ["deductible", "copay", "_org", "objectId", "objectType"],
  additionalProperties: true,
};

const linkedPlanServicesSchema = {
  type: "array",
  items: {
    type: "object",
    properties: {
      linkedService: {
        type: "object",
        properties: {
          _org: { type: "string", nullable: false },
          objectId: { type: "string", nullable: false },
          objectType: { type: "string", nullable: false },
          name: { type: "string", nullable: false },
        },
        required: ["_org", "objectId", "objectType", "name"],
        additionalProperties: true,
      },
      planserviceCostShares: planCostSharesSchema,
      _org: { type: "string", nullable: false },
      objectId: { type: "string", nullable: false },
      objectType: { type: "string", nullable: false },
    },
    required: [
      "linkedService",
      "planserviceCostShares",
      "_org",
      "objectId",
      "objectType",
    ],
    additionalProperties: true,
  },
  uniqueItems: true,
  nullable: false,
};

const planSchema = {
  type: "object",
  properties: {
    planCostShares: planCostSharesSchema,
    linkedPlanServices: linkedPlanServicesSchema,
    planType: { type: "string", nullable: false },
    creationDate: { type: "string", nullable: false },
    _org: { type: "string", nullable: false },
    objectId: { type: "string", nullable: false },
    objectType: { type: "string", nullable: false },
  },
  required: [
    "planCostShares",
    "linkedPlanServices",
    "planType",
    "creationDate",
    "_org",
    "objectId",
    "objectType",
  ],
  additionalProperties: true,
  nullable: false,
};

const ajv = new Ajv({ allErrors: true });
const validatePlan = ajv.compile(planSchema);

module.exports = {
  validatePlan,
};
