import puppeteer from "puppeteer";
import ffmpeg from "fluent-ffmpeg";
import fs from "fs/promises";
import path from "path";
import { v4 as uuidv4 } from "uuid";
import fetch from "node-fetch";

export async function convertReelToMp3(reelUrl) {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();

  await page.goto(reelUrl, { waitUntil: "networkidle2" });

  // Extract video URL from Instagram's page JSON data
  const videoUrl = await page.evaluate(() => {
    const nextData = document.querySelector('script#\\_\\_NEXT_DATA__');
    if (!nextData) return null;

    try {
      const data = JSON.parse(nextData.textContent);
      // For reels, path might be:
      const media = data.props.pageProps?.graphql?.shortcode_media;
      if (media) {
        return media.video_url || null;
      }
    } catch {
      return null;
    }
    return null;
  });

  await browser.close();

  if (!videoUrl) throw new Error("Failed to extract real video URL");

  // Paths for saving files
  const videoName = `${uuidv4()}.mp4`;
  const audioName = videoName.replace(".mp4", ".mp3");

  const videoPath = path.resolve("tmp", videoName);
  const audioPath = path.resolve("public/songs", audioName);

  // Download the video file
  const buffer = await fetch(videoUrl).then((res) => res.arrayBuffer());
  await fs.writeFile(videoPath, Buffer.from(buffer));

  // Convert video to mp3
  await new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .toFormat("mp3")
      .on("end", resolve)
      .on("error", reject)
      .save(audioPath);
  });

  // Delete the temp video file
  await fs.unlink(videoPath);

  return {
    filename: audioName,
    filepath: `/songs/${audioName}`,
    sourceUrl: reelUrl,
  };
}
