const { createClient } = require("redis");
const etag = require("etag");
const { validatePlan } = require("../schema.js");
const { ajvErrorParser } = require("../utils/index.js");

const redisClient = createClient();
(async () => {
  redisClient.on("error", (err) => console.log("Redis Client Error", err));
  await redisClient.connect();
})();

const createPlan = async (req, res) => {
  const body = req.body;
  const isValid = await validatePlan(body);

  if (isValid) {
    const key = `plan:${body.objectId}`;
    return redisClient
      .exists(key)
      .then((result) => {
        if (result)
          return res.status(200).json({
            message: "Plan already exists.",
          });
        else
          return redisClient
            .set(key, JSON.stringify(body))
            .then(() => {
              return res.status(201).json({
                message: "Create plan successfully.",
                data: body,
              });
            })
            .catch((e) => {
              throw e;
            });
      })
      .catch((e) => {
        console.error(e);
        return res.status(503).json();
      });
  } else {
    const errors = await ajvErrorParser(validatePlan.errors);
    return res.status(400).json({
      message: "Bad Request",
      errors,
    });
  }
};

const getPlan = async (req, res) => {
  const id = req.params.id;
  const key = `plan:${id}`;
  const ETag = req.headers["if-none-match"];

  return redisClient
    .get(key)
    .then((data) => {
      if (!data)
        return res.status(404).json({
          message: "Plan not found.",
        });
      else {
        console.log("etag",ETag, etag(data))
        if (ETag === etag(data)) return res.status(304).json({});
        return res.status(200).json(JSON.parse(data));
      }
    })
    .catch((e) => {
      console.error(e);
      return res.status(503).json();
    });
};

const getPlans = async (req, res) => {
  return redisClient
    .keys("plan:*")
    .then((keys) => {
      return redisClient
        .mGet(keys)
        .then((data) => {
          if (!data)
            return res.status(404).json({
              message: "Plan not found.",
            });
          else {
            return res
              .status(200)
              .json({ plans: data.map((str) => JSON.parse(str || "")) });
          }
        })
        .catch((e) => {
          throw e;
        });
    })
    .catch((e) => {
      console.error(e);
      return res.status(503).json();
    });
};

const deletePlan = async (req, res) => {
  const id = req.params.id;
  const key = `plan:${id}`;
  return redisClient
    .exists(key)
    .then((result) => {
      if (!result)
        return res.status(404).json({
          message: "Plan not found.",
        });
      else
        return redisClient
          .del(key)
          .then(() => {
            return res.status(204).json({
              message: "Delete plan successfully.",
            });
          })
          .catch((e) => {
            throw e;
          });
    })
    .catch((e) => {
      console.error(e);
      return res.status(503).json();
    });
};

const deletePlans = async (req, res) => {
  return redisClient
    .keys("plan:*")
    .then((keys) => {
      if (!keys.length)
        return res.status(404).json({
          message: "No plan.",
        });
      else
        return redisClient
          .del(keys)
          .then(() => {
            return res.status(204).json({
              message: "Delete plan successfully.",
            });
          })
          .catch((e) => {
            throw e;
          });
    })
    .catch((e) => {
      console.error(e);
      return res.status(503).json();
    });
};

module.exports = { createPlan, getPlan, getPlans, deletePlan, deletePlans };
