async function loggerPlugin(fastify, options) {
  fastify.addHook("onRequest", async (request, reply) => {
    // Loga a URL da requisição recebida
    fastify.log.info({ url: request.url }, "Request received");
  });
}

module.exports = loggerPlugin;
