const Validator = require("../models/Validator");
async function valid(fastify, options) {
  fastify.get("/valid", async (request, reply) => {
    // Validação de URLs
    const requestedUrl = request.query.url; // URL fornecida pelo cliente
    const replyTime = reply.elapsedTime.toFixed(3); // Tempo de resposta em milissegundos limitado a 3 casas decimais

    // Verifica se a URL não foi fornecida
    if (!requestedUrl) {
      return reply.status(400).send({
        timeElapsed: replyTime,
        error: "URL not provided",
      });
    }

    // Valida se a URL fornecida é permitida
    const isValid = Validator.isAllowedDomain(requestedUrl);

    // Retorna se a URL é válida ou não
    return { timeElapsed: replyTime, url: requestedUrl, isValid };
  });
}

module.exports = valid;
