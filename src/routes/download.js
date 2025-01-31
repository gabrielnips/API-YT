const Validator = require("../models/Validator");
const downloadVideo = require("../services/getDownload");

async function downloadHandler(fastify, options) {
  fastify.get("/download", async (request, reply) => {
    const requestedUrl = request.query.url; // URL fornecida pelo cliente
    const requestedFormat = request.query.format; // Formato fornecida pelo cliente
    const requestedQuality = request.query.quality; // Qualidade fornecida pelo cliente
    const replyTime = reply.elapsedTime.toFixed(3); // Tempo de resposta em milissegundos limitado a 3 casas decimais
    const isValidUrl = Validator.isAllowedDomain(requestedUrl);
    const isValidFormat = Validator.isValidFormat(requestedFormat);
    const isValidQuality = Validator.isValidQuality(requestedQuality);

    if (
      !isValidUrl ||
      !isValidFormat ||
      !isValidQuality ||
      !requestedUrl ||
      !requestedFormat
    ) {
      return reply.status(400).send({
        timeElapsed: replyTime,
        error: "Invalid URL, URL not provided or format not provided",
      });
    }

    // Obtém o código de formato com base na qualidade amigável
    const formatCode = Validator.getFormatCode(requestedQuality);
    if (!formatCode) {
      return reply.status(400).send({
        timeElapsed: replyTime,
        error: "Invalid quality specified",
      });
    }

    try {
      const dwResponse = await downloadVideo(
        requestedUrl,
        requestedFormat,
        formatCode // Passa o código de formato para o download
      );

      return reply.status(200).send({
        timeElapsed: replyTime,
        data: dwResponse,
      });
    } catch (err) {
      return reply.status(400).send({
        error: err.code || "UnknownError",
        error_message: err.message || "Something went wrong",
      });
    }
  });
}

module.exports = downloadHandler;
