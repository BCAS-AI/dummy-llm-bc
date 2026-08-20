// Static/randomized canned answers. No LLM is ever called — this only
// picks from fixed pools so behavior is realistic-looking but deterministic
// to reason about in tests.

const ANSWER_POOL = {
  'vllm-text-generation': [
    'Ini adalah jawaban simulasi dari BCA LLM Gateway. Tidak ada model bahasa sungguhan yang dipanggil; teks ini dipilih secara acak dari kumpulan respons statis untuk keperluan pengujian integrasi.',
    'Berdasarkan permintaan Anda, berikut ringkasan simulasi: layanan ini meniru struktur request/response API asli tanpa memproses isi prompt menggunakan model AI apa pun.',
    'Halo! Ini adalah respons contoh dari simulator. Gunakan endpoint ini untuk menguji alur autentikasi, signature, dan skema response tanpa biaya pemanggilan model sungguhan.',
  ],
  'vllm-coder': [
    '```python\ndef simulate_response():\n    # Contoh cuplikan kode statis dari simulator.\n    return "Tidak ada kode nyata yang dihasilkan oleh model."\n```',
    '```javascript\nfunction dummyHandler(req, res) {\n  // Respons contoh dari BCA LLM Gateway simulator.\n  return res.json({ ok: true });\n}\n```',
  ],
  'vllm-vision': [
    'Simulasi analisis gambar: gambar yang diunggah tampak berisi elemen visual umum. Ini adalah deskripsi contoh, bukan hasil analisis gambar sebenarnya.',
    'Deskripsi simulasi: file gambar diterima dengan format valid. Simulator ini tidak benar-benar memproses piksel gambar.',
  ],
  'vllm-omni': [
    'Transkripsi simulasi: "ini adalah contoh transkripsi audio yang dihasilkan secara statis oleh simulator, bukan hasil pemrosesan audio sungguhan."',
  ],
};

const RECOMMENDATION_POOL = [
  {
    longPrompt: 'Jelaskan lebih detail mengenai topik sebelumnya dengan menambahkan contoh nyata dan langkah implementasi.',
    shortPrompt: 'Jelaskan lebih detail',
  },
  {
    longPrompt: 'Buatkan ringkasan singkat dari jawaban di atas dalam bentuk poin-poin yang mudah dibaca.',
    shortPrompt: 'Ringkas dalam poin-poin',
  },
  {
    longPrompt: 'Berikan alternatif pendekatan lain untuk menyelesaikan permasalahan yang sama.',
    shortPrompt: 'Berikan alternatif lain',
  },
  {
    longPrompt: 'Terjemahkan jawaban di atas ke dalam Bahasa Inggris secara natural.',
    shortPrompt: 'Terjemahkan ke Inggris',
  },
];

function pickAnswer(task) {
  const pool = ANSWER_POOL[task] || ANSWER_POOL['vllm-text-generation'];
  return pool[Math.floor(Math.random() * pool.length)];
}

function pickRecommendations(count = 2) {
  const shuffled = [...RECOMMENDATION_POOL].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, count);
}

function estimateTokens(text) {
  if (!text) return 0;
  return Math.max(1, Math.round(String(text).length / 4));
}

module.exports = { pickAnswer, pickRecommendations, estimateTokens };
