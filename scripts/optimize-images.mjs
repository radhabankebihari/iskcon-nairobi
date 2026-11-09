// Keep full-resolution originals outside public/ and publish bounded WebP copies.
// Run after adding source photos; update code references for changed extensions.
import { copyFileSync, existsSync, mkdirSync, readdirSync, renameSync, statSync, unlinkSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";

const root = path.resolve("public/images");
const archive = path.resolve("assets/original-images");
const maxBytes = 400 * 1024;
const maxWidth = 1800;

function walk(directory, files = []) {
  for (const name of readdirSync(directory)) {
    const file = path.join(directory, name);
    if (statSync(file).isDirectory()) walk(file, files);
    else if (/\.(jpe?g|png|webp)$/i.test(name)) files.push(file);
  }
  return files;
}

let saved = 0;
for (const source of walk(root)) {
  const before = statSync(source).size;
  if (before <= maxBytes) continue;

  const relative = path.relative(root, source);
  const original = path.join(archive, relative);
  const output = source.replace(/\.(jpe?g|png|webp)$/i, ".webp");
  const temporary = `${output}.optimized`;
  if (existsSync(original)) throw new Error(`Original already archived: ${relative}`);
  if (output !== source && existsSync(output)) {
    // A converted copy already exists (for example the 404 illustration).
    if (statSync(output).size > maxBytes) throw new Error(`Existing copy is too large: ${output}`);
    mkdirSync(path.dirname(original), { recursive: true });
    renameSync(source, original);
    saved += before;
    console.log(`${relative}: archived original; optimized copy already exists`);
    continue;
  }

  let after = 0;
  for (const width of [maxWidth, 1600, 1400, 1200]) {
    for (const quality of [82, 76, 70]) {
      await sharp(source).rotate().resize({ width, withoutEnlargement: true })
        .webp({ quality, effort: 6 }).toFile(temporary);
      after = statSync(temporary).size;
      if (after <= maxBytes) break;
      unlinkSync(temporary);
    }
    if (after <= maxBytes) break;
  }
  if (after > maxBytes) throw new Error(`Could not meet image target: ${relative}`);

  mkdirSync(path.dirname(original), { recursive: true });
  try {
    renameSync(source, original);
  } catch (error) {
    if (error.code !== "EBUSY" && error.code !== "EPERM") throw error;
    const alternate = source.replace(/\.webp$/i, "-optimized.webp");
    if (alternate === source || existsSync(alternate)) throw error;
    copyFileSync(source, original);
    renameSync(temporary, alternate);
    console.warn(`${relative}: source is locked; use ${path.basename(alternate)} until it can be archived`);
    saved += before - after;
    continue;
  }
  try {
    renameSync(temporary, output);
  } catch (error) {
    renameSync(original, source);
    throw error;
  }
  saved += before - after;
  console.log(`${relative}: ${(before / 1024).toFixed(0)} KB -> ${(after / 1024).toFixed(0)} KB`);
}
console.log(`Public image payload reduced by ${(saved / 1048576).toFixed(1)} MB`);
