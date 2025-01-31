const youtubedl = require("youtube-dl-exec");
const path = require("path");
const fs = require("fs").promises;

require("dotenv").config();
const config = require("../../config/config.json");

async function checkFileExists(filePath) {
  try {
    await fs.access(filePath);
    return true;
  } catch {
    return false;
  }
}

async function downloadVideo(URL, Format, FormatCode) {
  try {
    const port = process.env.PORT || config.port;
    const host = process.env.HOST || config.host;

    // Etapa 1: Obtenha os metadados
    const output = await youtubedl(URL, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });

    // Nome e caminho do arquivo
    const uniqueFileName = `${output.id}.${Format}`;
    const uniqueFilePath = path.resolve(`./downloads/${uniqueFileName}`);

    // Etapa 2: Baixe o vídeo com o código de formato especificado
    await youtubedl(URL, {
      format: FormatCode, // Usa o código de formato mapeado
      output: uniqueFilePath,
      noCheckCertificates: true,
      noWarnings: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });

    // Verifica se o arquivo foi criado
    if (!(await checkFileExists(uniqueFilePath))) {
      throw new Error(`Failed to download video: ${uniqueFilePath}`);
    }

    // Constrói a URL acessível pelo servidor
    const videoOutputURL = `http://${host}:${port}/downloads/${uniqueFileName}`;

    // Dados de retorno
    const data = [
      {
        videoOutput: videoOutputURL,
        general: [
          {
            id: output.id,
            title: output.fulltitle,
            view_count: output.view_count,
            like_count: output.like_count,
            comment_count: output.comment_count,
            duration: output.duration_string,
            duration_raw: output.duration,
            thumbnail: output.thumbnail,
            playable_in_embed: output.playable_in_embed,
            live_status: output.live_status,
            availability: output.availability,
            playlist: output.playlist,
          },
        ],
      },
    ];

    return data;
  } catch (err) {
    throw new Error(err.message || "Failed to download video");
  }
}
module.exports = downloadVideo;
