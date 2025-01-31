const Validator = require("../models/Validator");
const downloadVideo = require("../services/getDownload");

async function downloadHandler(fastify, options) {
  fastify.get("/download", async (request, reply) => {
    const requestedUrl = request.query.url; // URL fornecida pelo cliente
    const requestedFormat = request.query.format; // Formato fornecido pelo cliente
    const requestedQuality = request.query.quality; // Qualidade fornecida pelo cliente
    const replyTime = reply.elapsedTime.toFixed(3); // Tempo de resposta em milissegundos limitado a 3 casas decimais

    // Valida se a URL fornecida é permitida
    const isValidUrl = Validator.isAllowedDomain(requestedUrl);
    // Valida se o formato fornecido é válido
    const isValidFormat = Validator.isValidFormat(requestedFormat);
    // Valida se a qualidade fornecida é válida
    const isValidQuality = Validator.isValidQuality(requestedQuality);

    // Verifica se a URL, formato ou qualidade são inválidos ou não fornecidos
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
      // Tenta fazer o download do vídeo com os parâmetros fornecidos
      const dwResponse = await downloadVideo(
        requestedUrl,
        requestedFormat,
        formatCode // Passa o código de formato para o download
      );

      // Retorna a resposta de sucesso com os dados do download
      return reply.status(200).send({
        timeElapsed: replyTime,
        data: dwResponse,
      });
    } catch (err) {
      // Retorna a resposta de erro caso ocorra uma exceção
      return reply.status(400).send({
        error: err.code || "UnknownError",
        error_message: err.message || "Something went wrong",
      });
    }
  });
}

module.exports = downloadHandler;
