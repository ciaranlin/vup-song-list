import fs from "fs";
import path from "path";
import pinyin from "pinyin";

export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "只支持 POST 请求" });

  const { index, song_name, artist, language, remarks, sticky_top, paid, BVID } = req.body;
  if (index == null) return res.status(400).json({ message: "缺少 index" });

  const filePath = path.join(process.cwd(), "public", "music_list.json");
  let songs = [];
  try {
    songs = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    songs = [];
  }

  const song = songs.find(s => s.index === index);
  if (!song) return res.status(404).json({ message: "未找到歌曲" });

  // 更新字段，仅更新有值的字段
  if (song_name) song.song_name = song_name;
  if (artist) song.artist = artist;
  if (language) song.language = language;
  if (remarks !== undefined) song.remarks = remarks;
  if (sticky_top !== undefined) song.sticky_top = sticky_top;
  if (paid !== undefined) song.paid = paid;
  if (BVID !== undefined && BVID !== null && BVID !== "" && BVID !== "null") song.BVID = BVID;
  else if (!BVID || BVID === "null") delete song.BVID;

  // 中文首字母
  if (song.song_name && /[\u4e00-\u9fa5]/.test(song.song_name[0])) {
    const py = pinyin(song.song_name[0], { style: pinyin.STYLE_FIRST_LETTER })[0][0];
    song.initial = py ? py.toUpperCase() : undefined;
  } else {
    delete song.initial;
  }

  // 写入前清理 null 或 "null"
  songs = songs.map(song => {
    Object.keys(song).forEach(key => {
      if (song[key] === null || song[key] === "null") delete song[key];
    });
    return song;
  });

  fs.writeFileSync(filePath, JSON.stringify(songs, null, 2));
  res.status(200).json({ message: "修改成功", song });
}
