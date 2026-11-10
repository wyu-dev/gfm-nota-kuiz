import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const readJson = (file) =>
  JSON.parse(fs.readFileSync(path.join(root, file), "utf8"));

const notes = readJson("gfm_nota_lengkap.json");
const bank = readJson("gfm_bank_soalan.json");
const diagrams = readJson("gfm_gambarajah.json");

const TOPICS = [
  {
    id: "pengukuran",
    module: "Modul 1",
    title: "Pengukuran Asas",
    subtitle: "Unit, perimeter, luas dan isipadu",
    icon: "ruler",
    accent: "blue",
    noteKey: "1",
  },
  {
    id: "lukisan-berskala",
    module: "Modul 2",
    title: "Lukisan Berskala",
    subtitle: "Skala, pelan, peta dan model",
    icon: "map",
    accent: "emerald",
    noteKey: "2",
  },
  {
    id: "trigonometri",
    module: "Modul 3",
    title: "Trigonometri",
    subtitle: "Pythagoras, sin, kos dan tan",
    icon: "triangle",
    accent: "violet",
    noteKey: "3",
  },
  {
    id: "statistik-pengiraan",
    module: "Modul 4",
    title: "Statistik: Pengiraan",
    subtitle: "Min, median, mod, julat dan serakan",
    icon: "calculator",
    accent: "amber",
    noteKey: "4",
  },
  {
    id: "statistik-graf",
    module: "Modul 4",
    title: "Statistik: Graf",
    subtitle: "Carta, histogram, ogif dan poligon",
    icon: "chart",
    accent: "rose",
    noteKey: "5",
  },
];

const SOURCE_LABELS = {
  "Latihan 30 Soalan": "Latihan",
  "Kuiz Nota": "Kuiz Nota",
  "Latihan Penilaian": "Penilaian",
};

// Soalan 1-100 sudah disemak. Julat ini mengikut susunan asal bank soalan.
function topicForId(id) {
  if (id <= 7) return "pengukuran";
  if (id <= 15) return "lukisan-berskala";
  if (id <= 23) return "trigonometri";
  if (id <= 27) return "statistik-pengiraan";
  if (id <= 29) return "statistik-graf";
  if (id === 30) return "statistik-pengiraan";
  if (id <= 35) return "pengukuran";
  if (id <= 40) return "lukisan-berskala";
  if (id <= 45) return "trigonometri";
  if (id <= 48) return "statistik-pengiraan";
  if (id <= 50) return "statistik-graf";
  if (id <= 60) return "pengukuran";
  if (id <= 70) return "lukisan-berskala";
  if (id <= 80) return "trigonometri";
  if (id <= 90) return "statistik-pengiraan";
  return "statistik-graf";
}

const fixes = {
  8: (q) => ({
    ...q,
    explanation: q.explanation.replace(/\uFFFD\uFFFD/g, "×"),
  }),
  16: (q) => ({
    ...q,
    options: ["-0.700", "-0.707", "0.700", "0.707"],
    correct_answer: "A",
    explanation:
      "tan 145° ≈ -0.7002. Pastikan kalkulator dalam mod DEGREE. Sudut 145° berada di kuadran II, jadi nilai tan adalah negatif.",
  }),
  70: (q) => ({
    ...q,
    question:
      "Sebuah model berukuran 18 cm × 7 cm dilukis dengan skala 1:24. Berapakah luas sebenar model itu dalam m²?",
    options: ["7.26 m²", "0.73 m²", "75.6 m²", "1.26 m²"],
    correct_answer: "A",
    explanation:
      "Luas lukisan = 18 × 7 = 126 cm².\nSkala luas = 24² = 576.\nLuas sebenar = 126 × 576 = 72,576 cm².\nTukar ke m²: 72,576 ÷ 10,000 = 7.2576 m² ≈ 7.26 m².",
  }),
  90: (q) => ({
    ...q,
    options: ["32.33", "31.67", "30.50", "28.50"],
    correct_answer: "A",
    explanation:
      "Titik tengah kelas: 15, 25, 35, 45.\nΣfx = (15×5) + (25×8) + (35×7) + (45×10)\n= 75 + 200 + 245 + 450 = 970.\nMin = 970 ÷ 30 = 32.33.",
  }),
};

function cleanNoteHtml(raw) {
  let html = raw.trim();

  // Buang tajuk utama: UI memaparkan tajuk sendiri.
  html = html.replace(/^<h3[^>]*>[\s\S]*?<\/h3>/i, "").trim();

  // Keselamatan asas: kandungan asal tidak mengandungi script atau pautan luar.
  html = html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "");

  // Jadual lebar boleh di-scroll pada telefon.
  html = html.replace(
    /<table[\s\S]*?<\/table>/gi,
    (table) => `<div class="overflow-x-auto">${table}</div>`,
  );

  return html.replace(/\n{3,}/g, "\n\n");
}

function cleanDiagram(raw, questionId) {
  let svg = String(raw).trim();
  if (!/^<svg[\s\S]*<\/svg>$/i.test(svg)) {
    throw new Error(`Gambarajah soalan ${questionId} bukan SVG yang sah`);
  }

  svg = svg
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/\son\w+\s*=\s*"[^"]*"/gi, "")
    .replace(/\son\w+\s*=\s*'[^']*'/gi, "");

  // Elakkan ID berganda apabila beberapa gambarajah dipaparkan serentak
  // (contohnya dalam senarai semak jawapan).
  const prefix = `q${questionId}-`;
  svg = svg
    .replace(/\bid="([^"]+)"/g, (_match, name) => `id="${prefix}${name}"`)
    .replace(/url\(#([^)]+)\)/g, (_match, name) => `url(#${prefix}${name})`)
    .replace(/href="#([^"]+)"/g, (_match, name) => `href="#${prefix}${name}"`);

  return svg;
}

const seenIds = new Set();
const questions = bank.map((original) => {
  const q = fixes[original.id] ? fixes[original.id](original) : original;

  if (seenIds.has(q.id)) throw new Error(`ID soalan berulang: ${q.id}`);
  seenIds.add(q.id);

  if (!q.question?.trim()) throw new Error(`Soalan ${q.id} kosong`);
  if (!Array.isArray(q.options) || q.options.length !== 4) {
    throw new Error(`Soalan ${q.id} mesti ada 4 pilihan`);
  }
  if (!Array.isArray(q.options) || q.options.some((o) => !String(o).trim())) {
    throw new Error(`Soalan ${q.id} ada pilihan kosong`);
  }
  if (!["A", "B", "C", "D"].includes(q.correct_answer)) {
    throw new Error(`Soalan ${q.id} ada kunci jawapan tidak sah`);
  }

  const answerIndex = "ABCD".indexOf(q.correct_answer);
  const topicId = topicForId(q.id);
  const text = [q.question, ...q.options, q.explanation].join(" ");
  if (text.includes("\uFFFD")) {
    throw new Error(`Soalan ${q.id} masih mengandungi aksara rosak (U+FFFD)`);
  }

  const diagram = diagrams[q.id];

  return {
    id: q.id,
    topicId,
    source: q.source,
    sourceLabel: SOURCE_LABELS[q.source] ?? q.source,
    question: q.question.trim(),
    options: q.options.map((o) => String(o).trim()),
    answerIndex,
    explanation: (q.explanation ?? "").trim(),
    ...(diagram ? { diagram: cleanDiagram(diagram, q.id) } : {}),
  };
});

for (const key of Object.keys(diagrams)) {
  if (!seenIds.has(Number(key))) {
    throw new Error(`Gambarajah untuk soalan ${key} tidak mempunyai soalan`);
  }
}

const topics = TOPICS.map((t) => {
  const note = notes[t.noteKey];
  if (!note) throw new Error(`Nota untuk ${t.id} tidak dijumpai`);

  return {
    id: t.id,
    module: t.module,
    title: t.title,
    subtitle: t.subtitle,
    icon: t.icon,
    accent: t.accent,
    note: cleanNoteHtml(note.content),
  };
});

const counts = Object.fromEntries(topics.map((t) => [t.id, 0]));
for (const q of questions) counts[q.topicId] = (counts[q.topicId] ?? 0) + 1;

const output = {
  version: 1,
  topics,
  questions,
  meta: {
    totalQuestions: questions.length,
    counts,
  },
};

const outDir = path.join(root, "src", "data");
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(
  path.join(outDir, "content.json"),
  `${JSON.stringify(output, null, 2)}\n`,
  "utf8",
);

const distribution = { A: 0, B: 0, C: 0, D: 0 };
for (const q of questions) distribution["ABCD"[q.answerIndex]] += 1;

console.log("Kandungan dijana: src/data/content.json");
console.log(`Topik: ${topics.length}, soalan: ${questions.length}`);
for (const t of topics) {
  console.log(`  - ${t.title}: ${counts[t.id]} soalan`);
}
console.log(`Gambarajah: ${Object.keys(diagrams).length} soalan`);
console.log("Taburan kunci asal:", distribution);
console.log(
  "Nota: pilihan jawapan akan diacak semasa kuiz, jadi taburan ini tidak memberi petunjuk kepada pelajar.",
);
