const youtubedl = require("youtube-dl-exec");

async function get(URL) {
  try {
    const output = await youtubedl(URL, {
      dumpSingleJson: true,
      noCheckCertificates: true,
      noWarnings: true,
      preferFreeFormats: true,
      addHeader: ["referer:youtube.com", "user-agent:googlebot"],
    });

    const data = [
      {
        video: {
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
          nerd_info: [
            {
              format: output.format,
              format_id: output.format_id,
              format_note: output.format_note,
              asr: output.asr,
              filesize: output.filesize,
              source_preference: output.source_preference,
              fps: output.fps,
              audio_channels: output.audio_channels,
              height: output.height,
              quality: output.quality,
              has_drm: output.has_drm,
              tbr: output.tbr,
              filesize_approx: output.filesize_approx,
              url: output.url,
              width: output.width,
              language: output.language,
              language_preference: output.language_preference,
              preference: output.preference,
              ext: output.ext,
              vcodec: output.vcodec,
              acodec: output.acodec,
              dynamic_range: output.dynamic_range,
              http_chunk_size: output.http_chunk_size,
              protocol: output.protocol,
              video_ext: output.video_ext,
              audio_ext: output.audio_ext,
              vbr: output.vbr,
              abr: output.abr,
              resolution: output.resolution,
              aspect_ratio: output.aspect_ratio,
            },
          ],
        },
        uploader: [
          {
            uploader: output.uploader,
            uploader_id: output.uploader_id,
            uploader_url: output.uploader_url,
            upload_date: output.upload_date,
          },
        ],
        channel: [
          {
            channel: output.channel,
            channel_id: output.channel_id,
            channel_url: output.channel_url,
            channel_follower_count: output.channel_follower_count,
          },
        ],
      },
    ];

    return data;
  } catch (err) {
    throw new Error(err.message || "Something went wrong");
  }
}

module.exports = get;
