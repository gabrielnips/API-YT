require("dotenv").config(); // Carregar variáveis de ambiente do arquivo .env
const Fastify = require("fastify");
const config = require("./config/config.json"); // Importar configuração
const path = require("path");
const fs = require("fs");

// Inicializar a aplicação Fastify
const app = Fastify({
  logger: true, // Habilitar logs detalhados
});

// Registrar plugins
const fastifyStatic = require("@fastify/static");
const loggerPlugin = require("./src/plugins/logger");
app.register(loggerPlugin);

// Registrar arquivos estáticos
app.register(fastifyStatic, {
  root: path.join(__dirname, "downloads"), // Diretório dos arquivos baixados
  prefix: "/downloads/", // Prefixo para acessar os arquivos
});

// Caminho para a pasta de rotas
const routesPath = path.join(__dirname, "src/routes");

// Registrar todas as rotas da pasta
fs.readdirSync(routesPath).forEach((file) => {
  const route = require(path.join(routesPath, file));
  app.register(route, { prefix: "/api" });
});

// Configuração de erro global
app.setErrorHandler((error, request, reply) => {
  app.log.error(error);
  reply.status(500).send({ error: "Internal Server Error" });
});

// Iniciar o servidor
const startServer = async () => {
  try {
    const port = process.env.PORT || config.port;
    const host = process.env.HOST || config.host;
    await app.listen({ port, host });
    app.log.info(`[+] Server running at http://${host}:${port}`);
  } catch (err) {
    app.log.error(err);
    process.exit(1);
  }
};

startServer();
