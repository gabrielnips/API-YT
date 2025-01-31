async function loggerPlugin(fastify, options) {
  fastify.addHook("onRequest", async (request, reply) => {
    fastify.log.info({ url: request.url }, "Request received");
  });
}

module.exports = loggerPlugin;
