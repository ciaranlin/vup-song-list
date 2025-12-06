import fs from "fs";
import path from "path";

export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "只支持 POST 请求" });

  const { index } = req.body;
  if (index == null) return res.status(400).json({ message: "缺少 index" });

  const filePath = path.join(process.cwd(), "public", "music_list.json");
  let songs = [];
  try {
    songs = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    songs = [];
  }

  const newSongs = songs.filter(song => song.index !== index);

  // 写入前清理 null 或 "null"
  const cleanedSongs = newSongs.map(song => {
    Object.keys(song).forEach(key => {
      if (song[key] === null || song[key] === "null") delete song[key];
    });
    return song;
  });

  fs.writeFileSync(filePath, JSON.stringify(cleanedSongs, null, 2));
  res.status(200).json({ message: `删除成功: index ${index}` });
}
