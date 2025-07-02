const esbuild = require("esbuild");
const fs = require("fs");
const path = require("path");
const CleanCSS = require("clean-css");

function copyFile(src, dest) {
  fs.mkdirSync(path.dirname(dest), { recursive: true });
  fs.copyFileSync(src, dest);
}

function copyFolderRecursive(src, dest) {
  if (!fs.existsSync(src)) return;
  fs.mkdirSync(dest, { recursive: true });
  for (const entry of fs.readdirSync(src, { withFileTypes: true })) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);
    if (entry.isDirectory()) {
      copyFolderRecursive(srcPath, destPath);
    } else {
      copyFile(srcPath, destPath);
    }
  }
}

esbuild
  .build({
    entryPoints: ["src/index.jsx"],
    bundle: true,
    outfile: "dist/bundle.js",
    minify: true,
    treeShaking: true,
    loader: { ".jsx": "jsx", ".css": "css" },
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    sourcemap: true,
    minify: true,
  })
  .then(() => {
    copyFile("public/index.html", "dist/index.html");
    copyFolderRecursive("assets", "dist/assets");

    const styles = fs.readFileSync("styles.css", "utf-8");
    const reset = fs.readFileSync("reset.css", "utf-8");

    fs.writeFileSync("dist/styles.css", new CleanCSS().minify(styles).styles);
    fs.writeFileSync("dist/reset.css", new CleanCSS().minify(reset).styles);

    console.log("Build complete with static assets.");
  })
  .catch(() => process.exit(1));
