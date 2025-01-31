const FormatEXTEnum = {
  M4A: "m4a",
  Mp4: "mp4",
  Webm: "webm",
};

const FormatNote = {
  The1080P: "1080p",
  The144P: "144p",
  The240P: "240p",
  The360P: "360p",
  The480P: "480p",
  The720P: "720p",
};

// Mapeamento de qualidade amigável para códigos de formato do YouTube
const QualityToFormatCode = {
  "1080p": "248", // Código para 1080p (formato mp4)
  "720p": "247", // Código para 720p (formato mp4)
  "480p": "244", // Código para 480p (formato mp4)
  "360p": "18", // Código para 360p (formato mp4)
  "240p": "242", // Código para 240p (formato mp4)
  "144p": "278", // Código para 144p (formato mp4)
};

class Validator {
  static isValidFormat(format) {
    return Object.values(FormatEXTEnum).includes(format);
  }

  // Verifica se a qualidade fornecida é válida
  static isValidQuality(quality) {
    return Object.values(FormatNote).includes(quality);
  }

  // Obtém o código de formato com base na qualidade amigável
  static getFormatCode(quality) {
    return QualityToFormatCode[quality] || null;
  }

  constructor(url) {
    this.url = url;
  }

  // Validar se a URL tem o formato correto
  static isValidUrl(url) {
    try {
      const parsedUrl = new URL(url); // Valida o formato básico da URL
      return !!parsedUrl; // Retorna true se for válida
    } catch (err) {
      return false; // Retorna false se a URL não for válida
    }
  }

  // Validar se a URL pertence a domínios permitidos
  static isAllowedDomain(url) {
    const allowedDomains = [
      "youtu.be",
      "www.youtu.be",
      "youtube.com",
      "www.youtube.com",
      "m.youtube.com",
      "www.m.youtube.com",
      "music.youtube.com",
      "www.music.youtube.com",
      "gaming.youtube.com",
      "www.gaming.youtube.com",
    ];

    try {
      const parsedUrl = new URL(url); // Analisa a URL
      return allowedDomains.includes(parsedUrl.hostname); // Verifica se o domínio está na lista permitida
    } catch (err) {
      return false; // Retorna false se a URL for inválida
    }
  }
}

module.exports = Validator;
