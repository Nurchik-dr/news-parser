import fs from "fs";
import path from "path";
import { execSync } from "child_process";

import * as tf from "@tensorflow/tfjs-node";
import * as cocoSsd from "@tensorflow-models/coco-ssd";

import jpeg from "jpeg-js";
import audioService from "./audioService.js";

let model = null;

async function loadModel() {
  if (!model) model = await cocoSsd.load();
  return model;
}

function imageToTensor(imagePath) {
  const buf = fs.readFileSync(imagePath);
  const { data, width, height } = jpeg.decode(buf);

  const rgb = new Uint8Array(width * height * 3);

  for (let i = 0, j = 0; i < data.length; i += 4, j += 3) {
    rgb[j] = data[i];
    rgb[j + 1] = data[i + 1];
    rgb[j + 2] = data[i + 2];
  }

  return tf.tensor3d(rgb, [height, width, 3]);
}

class DownloadService {
  async processVideo(url) {
    console.log("[ProcessVideo] Starting download...");

    const videoPath = await this.download(url);

    console.log("[ProcessVideo] Download complete, starting analysis...");

    const analysis = await this.extractFrames(videoPath);

    console.log("[ProcessVideo] Cleanup...");

    fs.unlinkSync(videoPath);

    return analysis;
  }

  async download(url) {
    const tmpDir = path.resolve("tmp/videos");
    if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

    const filePath = path.join(tmpDir, `ig_${Date.now()}.mp4`);

    console.log("[Download] yt-dlp with cookies...");

    execSync(
      `python3 -m yt_dlp --cookies "./cookies.txt" -t mp4 -o "${filePath}" "${url}"`,
      { stdio: "inherit" }
    );

    return filePath;
  }

  async extractFrames(videoPath) {
    const framesDir = path.resolve("tmp/frames", path.parse(videoPath).name);
    fs.mkdirSync(framesDir, { recursive: true });

    execSync(`ffmpeg -i "${videoPath}" -vf fps=1 "${framesDir}/f_%03d.jpg" -y`);

    const frames = fs.readdirSync(framesDir);

    const model = await loadModel();

    const detections = [];

    for (const frame of frames) {
      const tensor = imageToTensor(path.join(framesDir, frame));
      const preds = await model.detect(tensor);

      detections.push(
        preds.map((p) => ({
          class: p.class,
          score: Math.round(p.score * 100),
        }))
      );

      tensor.dispose();
    }

    return {
      timeline: detections.slice(0, 3),
      audio: await audioService.analyzeAudio(),
    };
  }
}

export default new DownloadService();
