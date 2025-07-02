const esbuild = require("esbuild");
const fs = require("fs");

esbuild
  .build({
    entryPoints: ["src/index.jsx"],
    bundle: true,
    outfile: "dist/bundle.js",
    loader: { ".jsx": "jsx" },
    define: {
      "process.env.NODE_ENV": '"production"',
    },
    sourcemap: true,
    minify: true,
  })
  .then(() => {
    fs.copyFileSync("public/index.html", "dist/index.html");
    console.log("✅ Build complete.");
  })
  .catch(() => process.exit(1));
