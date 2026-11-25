// Entry validator for make.fun bounty post-x-promote-make-your-own-bounty-01.
// The entry itself is one public X post: a quote of (or a link to) make.fun's
// make-your-own-bounty post, with a photo of its own, whose text carries
// make.fun or @makefunai plus this account's play code. This program checks
// every part of that post that can be checked locally, before the post goes
// up, and writes the verdict to /output so the gate can read it alongside
// POST.json. Standard library only, no network access.
//
//   mkdir -p out && MAKEFUN_BOT_DIR=. MAKEFUN_OUTPUT_DIR=out node main.ts

import { copyFileSync, existsSync, mkdirSync, readFileSync, statSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const BOT_DIR = process.env.MAKEFUN_BOT_DIR ?? "/bot";
const OUTPUT_DIR = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

const PLAY_CODE = "makefun-pouch-cub-cattail";
const MAKEFUN_POST_URL = "https://x.com/makefunai/status/2124915864336236646";
const SPONSOR_URL = "https://make.fun/sponsor/new";
const POST_PLACEHOLDER = "https://x.com/<handle>/status/<id>";
const PHOTO_PATH = join("assets", "post-image.png");
const POST_TEXT_PATH = "POST_TEXT.txt";

const STATUS_URL_RE = /^https:\/\/(x\.com|twitter\.com)\/[A-Za-z0-9_]+\/status\/[0-9]+$/;

type Check = { name: string; pass: boolean; detail: string };
const checks: Check[] = [];

function check(name: string, pass: boolean, detail: string): void {
  checks.push({ name, pass, detail });
  console.log(`${pass ? "pass" : "FAIL"}  ${name}: ${detail}`);
}

function readText(name: string): string | null {
  try {
    return readFileSync(join(BOT_DIR, name), "utf8");
  } catch {
    return null;
  }
}

// 1. POST.json exists, parses, and carries the post's address.
const postRaw = readText("POST.json");
let postUrl = "";
if (postRaw === null) {
  check("post_json_present", false, "POST.json is missing from the repository root.");
} else {
  try {
    const parsed: unknown = JSON.parse(postRaw);
    if (typeof parsed === "object" && parsed !== null && typeof (parsed as { url?: unknown }).url === "string") {
      postUrl = (parsed as { url: string }).url;
      check("post_json_present", true, "POST.json parses and carries a url string.");
    } else {
      check("post_json_present", false, "POST.json parses but has no url string.");
    }
  } catch (err) {
    check("post_json_present", false, `POST.json does not parse: ${(err as Error).message}`);
  }
}

// 2. The post address. The placeholder means "not posted yet": that is a
//    pending state, not a failure. Anything else must be a real X status URL.
let pending = false;
if (postUrl === "") {
  check("post_url_shape", false, "No post address to check.");
} else if (postUrl === POST_PLACEHOLDER) {
  pending = true;
  check("post_url_shape", true, "Placeholder address: the post has not been published yet.");
} else if (STATUS_URL_RE.test(postUrl)) {
  check("post_url_shape", true, `Well-formed X status URL: ${postUrl}`);
} else {
  check("post_url_shape", false, `Not a well-formed X status URL: ${postUrl}`);
}

// 3. The exact text to publish, and the three things it must carry.
const text = readText(POST_TEXT_PATH);
if (text === null) {
  check("post_text_present", false, `${POST_TEXT_PATH} is missing.`);
} else {
  check("post_text_present", true, `${POST_TEXT_PATH} found (${text.length} characters).`);
  const hasCode = text.split(/\s+/).includes(PLAY_CODE);
  check("play_code_in_text", hasCode, hasCode ? `Play code ${PLAY_CODE} present as its own token.` : `Play code ${PLAY_CODE} is missing from the text.`);
  const lower = text.toLowerCase();
  const hasMakefun = lower.includes("make.fun") || lower.includes("@makefunai");
  check("makefun_in_text", hasMakefun, hasMakefun ? "make.fun / @makefunai present in the text." : "Neither make.fun nor @makefunai appears in the text.");
  const hasSponsorLink = text.includes(SPONSOR_URL);
  check("sponsor_link_in_text", hasSponsorLink, hasSponsorLink ? `Link to ${SPONSOR_URL} present.` : `Link to ${SPONSOR_URL} is missing from the text.`);
  check("text_length", text.length <= 280, `Post text is ${text.length} characters (X limit 280).`);
}

// 4. The photo of its own, attached to the post.
const photoFull = join(BOT_DIR, PHOTO_PATH);
if (!existsSync(photoFull)) {
  check("photo_present", false, `${PHOTO_PATH} is missing from the repository.`);
} else {
  const size = statSync(photoFull).size;
  check("photo_present", size > 0, size > 0 ? `${PHOTO_PATH} present (${size} bytes).` : `${PHOTO_PATH} is empty.`);
}

// 5. Write the verdict and hand POST.json to the gate.
mkdirSync(OUTPUT_DIR, { recursive: true });
const failures = checks.filter((c) => !c.pass);
const report = {
  competition: "post-x-promote-make-your-own-bounty-01",
  status: failures.length === 0 ? (pending ? "pending_post" : "ready") : "invalid",
  quote_target: MAKEFUN_POST_URL,
  quote_instruction: "In X, use Repost then Quote on the post above (or link to it in a new post), attach assets/post-image.png, and paste POST_TEXT.txt as the text.",
  scoring: "Places go by replies + reposts + quotes; views and likes move nothing. Keep the post public until the results are out.",
  checks,
};
writeFileSync(join(OUTPUT_DIR, "validation.json"), `${JSON.stringify(report, null, 2)}\n`);
if (postRaw !== null) {
  copyFileSync(join(BOT_DIR, "POST.json"), join(OUTPUT_DIR, "POST.json"));
}
console.log(`\nverdict: ${report.status} (${checks.length - failures.length}/${checks.length} checks pass)`);
if (failures.length > 0) process.exit(1);
