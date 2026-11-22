// main.ts — entry program for the gta6-meme-x-01 make.fun submission.
//
// What this does: the file POST.json lives next to this script and holds the
// link to the meme post on X. This program copies that file into an output
// folder so the bounty harness can pick it up from a known place. The folder
// defaults to /output; pass a different path as the first argument to use
// that instead (handy for local test runs).

import { copyFileSync, mkdirSync, readFileSync } from "node:fs";
import { dirname, join, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const scriptDir = dirname(fileURLToPath(import.meta.url));
const sourcePath = join(scriptDir, "POST.json");

// Sanity-check POST.json before handing it over: it must be valid JSON and
// its "url" field must look like the address of a post on X. If anything is
// off, say so on stderr and bail out with a failure code instead of copying
// a broken file.
function checkPostFile(path) {
  let parsed;
  try {
    parsed = JSON.parse(readFileSync(path, "utf8"));
  } catch (err) {
    console.error(`error: ${path} is not valid JSON (${err.message})`);
    process.exit(1);
  }
  const url = parsed?.url;
  if (typeof url !== "string" || !url.includes("x.com/") || !url.includes("/status/")) {
    console.error(`error: ${path} has no usable X post url (got: ${JSON.stringify(url)})`);
    process.exit(1);
  }
}

checkPostFile(sourcePath);

const outputDir = resolve(process.argv[2] ?? "/output");
const destinationPath = join(outputDir, "POST.json");

mkdirSync(outputDir, { recursive: true });
copyFileSync(sourcePath, destinationPath);

console.log(`Copied ${sourcePath} -> ${destinationPath}`);
