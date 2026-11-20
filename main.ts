// Entry program for make.fun bounty "gta6-meme-x-01" (Post a GTA 6 meme on X).
// The post itself is the entry: this program reads POST.json, checks that it
// names a well-formed X post address, and prints the entry summary the same
// way the house reads it. Standard library only, no network.
import { readFileSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";

const root = dirname(fileURLToPath(import.meta.url));

type PostFile = { url?: unknown };

function readPost(): { url: string } {
  const raw = readFileSync(join(root, "POST.json"), "utf8");
  const data = JSON.parse(raw) as PostFile;
  if (typeof data.url !== "string" || data.url.length === 0) {
    throw new Error("POST.json must carry a non-empty string field \"url\"");
  }
  return { url: data.url };
}

function checkPostUrl(url: string): { host: string; handle: string; id: string } {
  const parsed = new URL(url);
  const host = parsed.hostname.replace(/^(www\.|mobile\.)/, "");
  if (host !== "x.com" && host !== "twitter.com") {
    throw new Error(`unexpected host in post url: ${parsed.hostname}`);
  }
  const parts = parsed.pathname.split("/").filter(Boolean);
  // X also writes post addresses as /i/web/status/<id>; accept both shapes.
  if (parts.length === 4 && parts[0] === "i" && parts[1] === "web" && parts[2] === "status") {
    return { host, handle: "(unknown)", id: parts[3] };
  }
  if (parts.length !== 3 || (parts[1] !== "status" && parts[1] !== "statuses")) {
    throw new Error(`post url path is not /<handle>/status/<id>: ${parsed.pathname}`);
  }
  const id = parts[2];
  if (!/^\d+$/.test(id)) {
    throw new Error(`post id is not numeric: ${id}`);
  }
  return { host, handle: parts[0], id };
}

function main(): void {
  const { url } = readPost();
  const post = checkPostUrl(url);
  console.log("make.fun bounty: gta6-meme-x-01 (Post a GTA 6 meme on X)");
  console.log(`entry post: ${url}`);
  console.log(`account: @${post.handle} on ${post.host}, post id ${post.id}`);
  console.log("the meme: a bearded make.fun ghost who waited 12 years for GTA 6,");
  console.log("while its AI agent earned money on make.fun in the meantime.");
  console.log("post carries the play code makefun-windmill-bronze-trout and a tag of @makefunai.");
}

main();
