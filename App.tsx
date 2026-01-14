import { useState } from "react";

function App() {
  const [prompt, setPrompt] = useState("");
  const [result, setResult] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const GEMINI_API_KEY = import.meta.env.VITE_GEMINI_API_KEY?.trim();

  if (!GEMINI_API_KEY || GEMINI_API_KEY.length < 20) {
    return (
      <div style={{ padding: 20, color: "red" }}>
        ❌ GEMINI API KEY TIDAK TERBACA
      </div>
    );
  }

  const generate = async () => {
    try {
      setLoading(true);
      setError("");
      setResult("");

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1/models/gemini-1.5-flash:generateContent?key=${GEMINI_API_KEY}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            contents: [
              {
                role: "user",
                parts: [{ text: prompt }],
              },
            ],
          }),
        }
      );

      const data = await res.json();
      console.log("GEMINI RESPONSE:", data);

      if (!res.ok) {
        throw new Error(data?.error?.message || "Gemini error");
      }

      const text =
        data?.candidates?.[0]?.content?.parts?.[0]?.text ||
        "❌ Tidak ada respon dari Gemini";

      setResult(text);
    } catch (e: any) {
      setError("❌ Gagal generate dari Gemini");
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ padding: 20, maxWidth: 600 }}>
      <h2>Gemini AI (FIXED)</h2>

      <textarea
        rows={4}
        style={{ width: "100%", padding: 10 }}
        placeholder="Tulis prompt..."
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
      />

      <button
        onClick={generate}
        disabled={loading || !prompt}
        style={{ marginTop: 10 }}
      >
        {loading ? "Loading..." : "Generate"}
      </button>

      {error && <p style={{ color: "red" }}>{error}</p>}
      {result && (
        <pre style={{ whiteSpace: "pre-wrap", marginTop: 20 }}>
          {result}
        </pre>
      )}
    </div>
  );
}

export default App;
