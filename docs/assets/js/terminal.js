// Global variables to be initialized when DOM is ready
let outputEl;
let commandInput;
let dirStructure = {
  'about': 'About section',
  'skills': 'Skills section',
  'projects': 'Projects section',
  'contact': 'Contact section'
};
let commandHistory = [];
let historyIndex = -1;

// Initialize terminal when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
  outputEl = document.getElementById('terminalOutput');
  commandInput = document.getElementById('commandInput');

  // Listen for the Enter key press in the command input.
  commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = commandInput.value.trim().toLowerCase();
      commandInput.value = ''; // Clear input after reading command.
      processCommand(command);
    }
  });

  // Initial terminal introduction
  printIntro();
});

// Terminal output functions
function appendOutput(content, isError = false) {
  const p = document.createElement("div");
  if (isError) p.classList.add("error");
  p.innerHTML = content;
  outputEl.appendChild(p);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function printLs() {
  const pre = document.createElement("pre");
  pre.classList.add("tree");

  const dirs = Object.keys(dirStructure);
  let output = "";

  dirs.forEach((dir, index) => {
    output += `<a href="#" class="dir nav-link" onclick="cdDir('${dir}'); return false;">${dir}</a>`;
    if (index < dirs.length - 1) {
      output += "       ";
    }
  });

  pre.innerHTML = output;
  outputEl.appendChild(pre);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function printLa() {
  const pre = document.createElement("pre");
  pre.classList.add("tree");

  let output = "";
  output += '<span class="dir">.</span>        ';
  output += '<span class="dir">..</span>       ';
  output += '<span class="hidden-file">.config</span>  ';
  output += '<span class="hidden-file">.bashrc</span>\n';

  Object.keys(dirStructure).forEach((dir) => {
    output += `<a href="#" class="dir nav-link" onclick="cdDir('${dir}'); return false;">${dir}</a>`;
    output += "       "; // Add consistent spacing
  });

  pre.innerHTML = output;
  outputEl.appendChild(pre);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function printLl() {
  const pre = document.createElement("pre");
  pre.classList.add("tree");

  const date = new Date();
  const monthNames = [
    "Jan", "Feb", "Mar", "Apr", "May", "Jun",
    "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
  ];
  const month = monthNames[date.getMonth()];
  const day = String(date.getDate()).padStart(2, " ");
  const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;

  // Create Unix-like ls -l output
  let output = `total ${Object.keys(dirStructure).length * 4}\n`;

  Object.keys(dirStructure).forEach((dir) => {
    output += `drwxr-xr-x  2 shm0rt  users  4096 ${month} ${day} ${time} `;
    output += `<a href="#" class="dir nav-link" onclick="cdDir('${dir}'); return false;">${dir}</a>\n`;
  });

  pre.innerHTML = output;
  outputEl.appendChild(pre);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function printTree() {
  const pre = document.createElement("pre");
  pre.classList.add("tree");

  const dirs = Object.keys(dirStructure);
  let output = `<span class="dir">.</span>\n`;
  dirs.forEach((dir, index) => {
    const prefix = index === dirs.length - 1 ? "└── " : "├── ";
    output += `<span>${prefix}</span><a href="#" class="dir nav-link" onclick="cdDir('${dir}'); return false;">${dir}</a>\n`;
  });

  pre.innerHTML = output;
  outputEl.appendChild(pre);
  outputEl.scrollTop = outputEl.scrollHeight;
}

function printFastfetch() {
  const pre = document.createElement("pre");
  pre.classList.add("tree");

  const sysInfo = [
    { label: "OS:", value: "Linux x86_64" },
    { label: "Host:", value: "Portfolio (v1.0)" },
    { label: "Kernel:", value: "6.6.30-minimal" },
    { label: "Shell:", value: "bash 5.2.15" },
    { label: "Terminal:", value: "web-term" },
  ];

  let output = `<span style="color:var(--primary-color)">shm0rt@portfolio</span>
<span style="color:var(--primary-color)">-----------------</span>

<span style="color:#FFA500">>(.)__</span> <span style="color:#8abeb7"><(.)__</span> <span style="color:#cc6666">=(.)__</span>
<span style="color:#FFA500"> (___/</span>  <span style="color:#8abeb7">(___/</span>  <span style="color:#cc6666">(___/</span>

`;

  sysInfo.forEach((info) => {
    output += `<span style="color:var(--primary-color)">${info.label}</span> ${info.value}\n`;
  });

  output += '\n<span style="background-color:#FF0000"> </span><span style="background-color:#FFFF00"> </span><span style="background-color:#00FF00"> </span><span style="background-color:#00FFFF"> </span><span style="background-color:#0000FF"> </span><span style="background-color:#FF00FF"> </span><span style="background-color:#FFFFFF"> </span>\n';

  pre.innerHTML = output;
  outputEl.appendChild(pre);
  outputEl.scrollTop = outputEl.scrollHeight;
}

// Command functions
function printIntro() {
  outputEl.innerHTML = ''; // Clear any existing content
  printFastfetch();
  appendOutput(
    'Press or type <span class="dir" onclick="processCommand(\'/help\')">/help</span> or <span class="dir" onclick="processCommand(\'?\')">?</span> for the help menu.'
  );
  printLs();
  commandInput.focus();
}

function printHelp() {
  appendOutput("Available commands:");
  appendOutput("cd &lt;dir&gt;   - move to directory");
  appendOutput("ls         - list directories");
  appendOutput("ll         - list directories (long format)");
  appendOutput("la         - list all directories including hidden");
  appendOutput("tree       - show directory structure as a tree");
  appendOutput("clear      - clear terminal");
  appendOutput("help, ?    - show this help menu");
}

function cdDir(dirId) {
  const target = document.getElementById(dirId);
  if (target) {
    target.scrollIntoView({ behavior: "smooth" });
    appendOutput(`Navigating to ${dirId} section...`);
  } else {
    appendOutput(`No such directory: ${dirId}`, true);
  }
}

function clearOutput() {
  outputEl.innerHTML = "";
  printIntro();
}

function processCommand(cmd) {
  const c = cmd.trim().toLowerCase();
  if (!c) return;

  appendOutput(`↪ ${c}`);

  if (c === "/help" || c === "help" || c === "?") printHelp();
  else if (c === "clear") clearOutput();
  else if (c === "home") {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    appendOutput('Navigating to top...');
  }
  else if (c === "ls") printLs();
  else if (c === "ll") printLl();
  else if (c === "la") printLa();
  else if (c === "tree") printTree();
  else if (c.startsWith("cd ")) {
    const path = c.slice(3).trim().replace(/^\//, "");
    cdDir(path);
  } else appendOutput(`Command not found: ${c}`, true);
}

// Make functions globally accessible for HTML onclick handlers
window.cdDir = cdDir;
window.processCommand = processCommand;
window.printIntro = printIntro;