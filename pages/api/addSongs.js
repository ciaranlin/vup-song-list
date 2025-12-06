import fs from "fs";
import path from "path";
import pinyin from "pinyin";

export default function handler(req, res) {
  if (req.method !== "POST")
    return res.status(405).json({ message: "只支持 POST 请求" });

  const { song_name, artist, language, remarks, sticky_top, paid, BVID } = req.body;
  if (!song_name || !artist)
    return res.status(400).json({ message: "缺少歌曲名或歌手" });

  const filePath = path.join(process.cwd(), "public", "music_list.json");
  let songs = [];
  try {
    songs = JSON.parse(fs.readFileSync(filePath, "utf-8"));
  } catch {
    songs = [];
  }

  // 自动生成 index
  const index = songs.length > 0 ? Math.max(...songs.map(s => s.index)) + 1 : 1;

  // 中文首字母
  let initial = null;
  if (/[\u4e00-\u9fa5]/.test(song_name[0])) {
    const py = pinyin(song_name[0], { style: pinyin.STYLE_FIRST_LETTER })[0][0];
    initial = py ? py.toUpperCase() : null;
  }

  // 构造歌曲对象，只添加有效字段
  const newSong = {
    index,
    song_name,
    artist,
    language,
    ...(remarks ? { remarks } : {}),
    ...(initial ? { initial } : {}),
    ...(sticky_top ? { sticky_top } : {}),
    ...(paid ? { paid } : {}),
    ...(BVID && BVID !== "null" ? { BVID } : {})
  };

  songs.push(newSong);

  // 写入前清理 null 或 "null"
  songs = songs.map(song => {
    Object.keys(song).forEach(key => {
      if (song[key] === null || song[key] === "null") delete song[key];
    });
    return song;
  });

  fs.writeFileSync(filePath, JSON.stringify(songs, null, 2));
  res.status(200).json({ message: "添加成功", song: newSong });
}
