const Validator = require("../models/Validator");
const getInfo = require("../services/getInfo");

async function getInfoHandler(fastify, options) {
  fastify.get("/info", async (request, reply) => {
    const requestedUrl = request.query.url; // URL fornecida pelo cliente
    const replyTime = reply.elapsedTime.toFixed(3); // Tempo de resposta em milissegundos limitado a 3 casas decimais

    // Valida se a URL fornecida é permitida
    const isValid = Validator.isAllowedDomain(requestedUrl);

    // Verifica se a URL é inválida ou não fornecida
    if (!isValid || !requestedUrl) {
      return reply.status(400).send({
        timeElapsed: replyTime,
        error: "Invalid URL or URL not provided",
      });
    }

    try {
      // Tenta obter as informações com a URL fornecida
      const infoResponse = await getInfo(requestedUrl);

      // Retorna a resposta de sucesso com os dados das informações
      return reply.status(200).send({
        timeElapsed: replyTime,
        data: infoResponse,
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

module.exports = getInfoHandler;
