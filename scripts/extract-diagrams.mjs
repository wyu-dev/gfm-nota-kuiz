import fs from "node:fs";

const source = fs.readFileSync("rujukan/gfm latihan.txt", "utf8");
const block = source.match(/const diagrams = \{([\s\S]*?)\n\s*\};/);
if (!block) throw new Error("Blok diagrams tidak dijumpai");

const GRID_DEFS = `<defs>
                        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
                            <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#e5e7eb" stroke-width="1"/>
                        </pattern>
                    </defs>`;

function makeSelfContained(svg, id) {
  for (const name of new Set(
    [...svg.matchAll(/url\(#([^)]+)\)/g)].map((match) => match[1]),
  )) {
    if (new RegExp(`id="${name}"`).test(svg)) continue;
    if (name === "grid") {
      svg = svg.replace(/<svg([^>]*)>/, `<svg$1>\n${GRID_DEFS}`);
      continue;
    }
    throw new Error(`Soalan ${id}: rujukan #${name} tiada definisi`);
  }
  return svg;
}

const diagrams = {};
const pattern = /(\d+):\s*`(<svg[\s\S]*?<\/svg>)`/g;
for (const match of block[1].matchAll(pattern)) {
  const id = Number(match[1]);
  let svg = match[2]
    .split("\n")
    .map((line) => line.trimEnd())
    .join("\n")
    .trim();
  svg = makeSelfContained(svg, id);
  diagrams[id] = svg;
}

const ids = Object.keys(diagrams).map(Number).sort((a, b) => a - b);
if (ids.length !== 10) throw new Error(`Dijangka 10 gambarajah, dijumpai ${ids.length}`);

fs.writeFileSync(
  "gfm_gambarajah.json",
  `${JSON.stringify(diagrams, null, 2)}\n`,
  "utf8",
);
console.log("Gambarajah diekstrak:", ids.join(", "));
for (const id of ids) console.log(`  #${id}: ${diagrams[id].length} aksara`);
