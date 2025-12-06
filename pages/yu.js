import { useState, useEffect } from "react";
import Head from "next/head";

export default function SongManager() {
  const [songs, setSongs] = useState([]);
  const [songName, setSongName] = useState("");
  const [artist, setArtist] = useState("");
  const [language, setLanguage] = useState("国语");
  const [BVID, setBVID] = useState("");

  const fetchSongs = async () => {
    const res = await fetch("/api/getSongs");
    const data = await res.json();
    setSongs(data.songs);
  };

  useEffect(() => {
    fetchSongs();
  }, []);

  const addSong = async () => {
    if (!songName || !artist) return alert("请输入歌曲名和歌手");
    const res = await fetch("/api/addSong", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ song_name: songName, artist, language, BVID })
    });
    const data = await res.json();
    alert(data.message);
    setSongName(""); setArtist(""); setBVID(""); setLanguage("国语");
    fetchSongs();
  };

  const deleteSong = async (index) => {
    if (!confirm("确定删除吗？")) return;
    const res = await fetch("/api/deleteSong", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ index })
    });
    const data = await res.json();
    alert(data.message);
    fetchSongs();
  };

  const updateSong = async (song) => {
    if (!song.song_name || !song.artist) return alert("歌曲名和歌手不能为空");
    const res = await fetch("/api/updateSong", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        index: song.index,
        song_name: song.song_name,
        artist: song.artist,
        language: song.language,
        BVID: song.BVID || null
      })
    });
    const data = await res.json();
    alert(data.message);
    fetchSongs();
  };

  const handleChange = (index, key, value) => {
    setSongs(prev => prev.map(song => song.index === index ? { ...song, [key]: value } : song));
  };

  return (
    <>
      <Head>
        <title>歌单管理</title>
        <link rel="icon" href="/public/favicon.ico" />
      </Head>

      <main style={{
        minHeight: "100vh",
        background: "linear-gradient(135deg, #a6b9c2 0%, #d3dde0 100%)",
        padding: "50px 20px",
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center"
      }}>
        <h1 style={{ textAlign: "center", marginBottom: "30px", color: "#2e3a45" }}>VUP 歌单管理</h1>

        {/* 添加歌曲 */}
        <div style={{
          marginBottom: "30px",
          display: "flex",
          justifyContent: "center",
          flexWrap: "wrap",
          gap: "10px"
        }}>
          <input
            placeholder="歌曲名" value={songName} onChange={e => setSongName(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "150px" }}
          />
          <input
            placeholder="歌手" value={artist} onChange={e => setArtist(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "150px" }}
          />
          <select value={language} onChange={e => setLanguage(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc" }}>
            <option value="国语">国语</option>
            <option value="日语">日语</option>
            <option value="英语">英语</option>
          </select>
          <input
            placeholder="BVID" value={BVID} onChange={e => setBVID(e.target.value)}
            style={{ padding: "8px", borderRadius: "6px", border: "1px solid #ccc", width: "120px" }}
          />
          <button onClick={addSong}
            style={{
              padding: "8px 15px",
              borderRadius: "6px",
              border: "none",
              backgroundColor: "#4CAF50",
              color: "#fff",
              cursor: "pointer",
              boxShadow: "0 2px 5px rgba(0,0,0,0.2)"
            }}>
            添加
          </button>
        </div>

        {/* 歌曲列表 */}
        <table style={{
          width: "100%",
          maxWidth: "900px",
          borderCollapse: "separate",
          borderSpacing: "0",
          boxShadow: "0 6px 12px rgba(0,0,0,0.1)",
          borderRadius: "10px",
          overflow: "hidden",
          backgroundColor: "#ffffff"
        }}>
          <thead style={{ backgroundColor: "#c1d0d9" }}>
            <tr>
              {["Index", "歌曲名", "歌手", "语言", "BVID", "操作"].map((th, idx) => (
                <th key={idx} style={{ padding: "12px", borderBottom: "1px solid #ddd", color: "#2e3a45" }}>{th}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {songs.map((song, idx) => (
              <tr key={song.index} style={{ backgroundColor: idx % 2 === 0 ? "#f9fafd" : "#eef4f7" }}>
                <td style={{ padding: "8px" }}>{song.index}</td>
                <td style={{ padding: "8px" }}>
                  <input
                    value={song.song_name} onChange={e => handleChange(song.index, "song_name", e.target.value)}
                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                  />
                </td>
                <td style={{ padding: "8px" }}>
                  <input
                    value={song.artist} onChange={e => handleChange(song.index, "artist", e.target.value)}
                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                  />
                </td>
                <td style={{ padding: "8px" }}>
                  <select value={song.language} onChange={e => handleChange(song.index, "language", e.target.value)}
                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc', width: '100%" }}>
                    <option value="国语">国语</option>
                    <option value="日语">日语</option>
                    <option value="英语">英语</option>
                  </select>
                </td>
                <td style={{ padding: "8px" }}>
                  <input
                    value={song.BVID || ""} onChange={e => handleChange(song.index, "BVID", e.target.value)}
                    style={{ padding: "6px", borderRadius: "4px", border: "1px solid #ccc", width: "100%" }}
                  />
                </td>
                <td style={{ padding: "8px", display: "flex", justifyContent: "center", gap: "5px" }}>
                  <button onClick={() => updateSong(song)}
                    style={{ padding: "6px 12px", borderRadius: "4px", border: "none", backgroundColor: "#2196F3", color: "#fff", cursor: "pointer" }}>
                    修改
                  </button>
                  <button onClick={() => deleteSong(song.index)}
                    style={{ padding: "6px 12px", borderRadius: "4px", border: "none", backgroundColor: "#f44336", color: "#fff", cursor: "pointer" }}>
                    删除
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </main>
    </>
  );
}
