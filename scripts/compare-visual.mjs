import { execFileSync } from "node:child_process";
import { mkdtempSync, rmSync, existsSync } from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";

const root = resolve(import.meta.dirname, "..");
const baselineRef = process.env.VISUAL_BASE_REF || "origin/main";
const temporary = mkdtempSync(join(tmpdir(), "iskcon-visual-"));
const existingBaseline = process.env.VISUAL_BASE_DIR;
const baseline = existingBaseline ? resolve(existingBaseline) : join(temporary, "baseline");
const selection = process.argv.slice(2);
const npm = process.platform === "win32" ? "npm.cmd" : "npm";
const playwright = join(root, "node_modules", "playwright", "cli.js");

function run(command, args, options = {}) {
  execFileSync(command, args, {
    cwd: root,
    stdio: "inherit",
    shell: process.platform === "win32" && command === npm,
    ...options,
  });
}

try {
  if (!existingBaseline) {
    run("git", ["worktree", "add", "--detach", baseline, baselineRef]);
    run(npm, ["ci"], { cwd: baseline });
    run(npm, ["run", "build"], { cwd: baseline });
  }
  if (!existsSync(join(baseline, ".next"))) throw new Error("Baseline build is missing");
  run(npm, ["run", "build"]);

  const env = { ...process.env, VISUAL_APP_DIR: baseline };
  run(process.execPath, [playwright, "test", "tests/e2e/visual.spec.ts", "--update-snapshots", ...selection], { env });
  run(process.execPath, [playwright, "test", "tests/e2e/visual.spec.ts", ...selection], {
    env: { ...process.env, VISUAL_APP_DIR: root },
  });
} finally {
  if (!existingBaseline && existsSync(baseline)) run("git", ["worktree", "remove", "--force", baseline]);
  rmSync(temporary, { recursive: true, force: true });
}
