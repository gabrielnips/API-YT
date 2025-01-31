const Validator = require("../models/Validator");
async function valid(fastify, options) {
  fastify.get("/valid", async (request, reply) => {
    // Validação de URLs
    const requestedUrl = request.query.url; // Limita a URL a 100 caracteres
    const replyTime = reply.elapsedTime.toFixed(3); // Tempo de resposta em milissegundos limitado a 3 casas decimais

    if (!requestedUrl) {
      return reply.status(400).send({
        timeElapsed: replyTime,
        error: "URL not provided",
      });
    }

    const isValid = Validator.isAllowedDomain(requestedUrl);
    return { timeElapsed: replyTime, url: requestedUrl, isValid }; // Retorna se e a URL é válida ou não
  });
}

module.exports = valid;
