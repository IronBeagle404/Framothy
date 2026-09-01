import * as readline from "readline";
import * as fs from "fs";
import * as path from "path";
import { execSync } from "child_process";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

function prompt(question: string): Promise<string> {
  return new Promise((resolve) => rl.question(question, resolve));
}

function confirm(question: string): Promise<boolean> {
  return new Promise((resolve) =>
    rl.question(question, (answer) =>
      resolve(/^(y|yes)$/i.test(answer.trim()) || answer.trim() === ""),
    ),
  );
}

function getTemplates(projectName: string) {
  const version = "0.2.1";

  const indexHtml = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${projectName}</title>
  <link rel="apple-touch-icon" sizes="180x180" href="/apple-touch-icon.png">
  <link rel="icon" type="image/png" sizes="32x32" href="/favicon-32x32.png">
  <link rel="icon" type="image/png" sizes="16x16" href="/favicon-16x16.png">
  <link rel="manifest" href="/site.webmanifest">
</head>
<body>
  <div id="app"></div>
  <script type="module" src="./src/main.ts"></script>
</body>
</html>`;

  const mainTs = `import { createElement, render, StateManager } from "framothy";

const state = new StateManager({ count: 0 });

function App() {
  return createElement("div", {},
    createElement("h1", {}, "${projectName}"),
    createElement("p", {}, "Count: " + state.getState().count),
    createElement("button", { onclick: () => state.setState({ count: state.getState().count + 1 }) }, "+1")
  );
}

state.subscribe(() => render(App(), document.getElementById("app")!));

render(App(), document.getElementById("app")!);`;

  const packageJson = `{
  "name": "${projectName}",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "scripts": {
    "dev": "npx vite",
    "build": "npx vite build"
  },
  "dependencies": {
    "framothy": "^${version}"
  },
  "devDependencies": {
    "vite": "^6.0.0",
    "typescript": "^6.0.0"
  }
}`;

  const tsconfigJson = `{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "Bundler",
    "strict": true,
    "skipLibCheck": true
  },
  "include": ["src"]
}`;

  const gitignore = `node_modules
dist
.DS_Store
*.log`;

  return { indexHtml, mainTs, packageJson, tsconfigJson, gitignore };
}

async function init() {
  console.log(" framothy - project init\n");

  const name = await prompt("Project name: ");
  if (!name.trim()) {
    console.error("Project name is required.");
    rl.close();
    process.exit(1);
  }

  const initGit = await prompt("Initialize git repo ? (y/n) ");
  const runInstall = await prompt(
    "Run npm install && npm run dev now ? (y/n) ",
  );

  const dir = path.resolve(process.cwd(), name.trim());

  if (fs.existsSync(dir)) {
    console.error(`Directory "${name}" already exists.`);
    rl.close();
    process.exit(1);
  }

  const templates = getTemplates(name.trim());

  fs.mkdirSync(dir, { recursive: true });
  fs.mkdirSync(path.join(dir, "src"), { recursive: true });

  fs.writeFileSync(path.join(dir, "index.html"), templates.indexHtml);
  fs.writeFileSync(path.join(dir, "src/main.ts"), templates.mainTs);
  fs.writeFileSync(path.join(dir, "package.json"), templates.packageJson);
  fs.writeFileSync(path.join(dir, "tsconfig.json"), templates.tsconfigJson);

  const publicDir = path.join(dir, "public");
  fs.mkdirSync(publicDir, { recursive: true });
  const faviconSource = path.join(__dirname, "..", "assets", "favicon");
  fs.cpSync(faviconSource, publicDir, { recursive: true });

  if (/^(y|yes)$/i.test(initGit.trim()) || initGit.trim() === "") {
    execSync("git init", { cwd: dir, stdio: "ignore" });
    fs.writeFileSync(path.join(dir, ".gitignore"), templates.gitignore);
  }

  rl.close();

  if (/^(y|yes)$/i.test(runInstall.trim()) || runInstall.trim() === "") {
    console.log("\nInstalling dependencies...");
    execSync("npm install", { cwd: dir, stdio: "inherit" });
    console.log("\nStarting dev server...");
    execSync("npm run dev", { cwd: dir, stdio: "inherit" });
  }

  console.log(`\nDone! Created ${name}/`);
  console.log("\nNext steps:");
  console.log(`  cd ${name}`);
  if (!/^(y|yes)$/i.test(runInstall.trim()) && runInstall.trim() !== "") {
    console.log("  npm install");
    console.log("  npm run dev");
  }
}

init().catch((err) => {
  console.error(err);
  process.exit(1);
});
