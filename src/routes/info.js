const Validator = require("../models/Validator");
const getInfo = require("../services/getInfo");

async function getInfoHandler(fastify, options) {
  fastify.get("/info", async (request, reply) => {
    const requestedUrl = request.query.url;
    const replyTime = reply.elapsedTime.toFixed(3);
    const isValid = Validator.isAllowedDomain(requestedUrl);

    if (!isValid || !requestedUrl) {
      return reply.status(400).send({
        timeElapsed: replyTime,
        error: "Invalid URL or URL not provided",
      });
    }

    try {
      const infoResponse = await getInfo(requestedUrl);
      return reply.status(200).send({
        timeElapsed: replyTime,
        data: infoResponse,
      });
    } catch (err) {
      return reply.status(400).send({
        error: err.code || "UnknownError",
        error_message: err.message || "Something went wrong",
      });
    }
  });
}

module.exports = getInfoHandler;
