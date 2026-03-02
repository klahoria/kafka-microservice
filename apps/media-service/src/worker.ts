import ffmpeg from "fluent-ffmpeg";
import fs from "fs";
import path from "path";

export async function encodeToHLS(inputPath: string, outputDir: string) {
  if (!fs.existsSync(outputDir)) fs.mkdirSync(outputDir, { recursive: true });

  return new Promise((resolve, reject) => {
    ffmpeg(inputPath)
      .outputOptions([
        "-preset veryfast",
        "-g 48",
        "-sc_threshold 0",
        "-map 0:0",
        "-map 0:1",
        "-s:v:0 1280x720",
        "-c:v:0 libx264",
        "-b:v:0 3000k",
        "-c:a copy",
        "-f hls",
        "-hls_time 6",
        "-hls_playlist_type vod"
      ])
      .output(path.join(outputDir, "index.m3u8"))
      .on("end", resolve)
      .on("error", reject)
      .run();
  });
}