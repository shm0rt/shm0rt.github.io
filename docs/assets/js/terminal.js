// Global variables
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

  // Listen for Enter key press
  commandInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      const command = commandInput.value.trim().toLowerCase();
      commandInput.value = '';
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

// Generic function for directory listings
function printDirectoryListing(format) {
  const pre = document.createElement("pre");
  pre.classList.add("tree");
  let output = "";
  
  switch(format) {
    case 'ls':
      // Basic ls output
      const dirs = Object.keys(dirStructure);
      dirs.forEach((dir, index) => {
        output += `<a href="#" class="dir nav-link" onclick="cdDir('${dir}'); return false;">${dir}</a>`;
        if (index < dirs.length - 1) {
          output += "       ";
        }
      });
      break;
      
    case 'la':
      // ls -a output (with hidden files)
      output += '<span class="dir">.</span>        ';
      output += '<span class="dir">..</span>       ';
      output += '<span class="hidden-file">.config</span>  ';
      output += '<span class="hidden-file">.bashrc</span>\n';
      
      Object.keys(dirStructure).forEach((dir) => {
        output += `<a href="#" class="dir nav-link" onclick="cdDir('${dir}'); return false;">${dir}</a>`;
        output += "       ";
      });
      break;
      
    case 'll':
      // ls -l output (detailed)
      const date = new Date();
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      const month = monthNames[date.getMonth()];
      const day = String(date.getDate()).padStart(2, " ");
      const time = `${String(date.getHours()).padStart(2, "0")}:${String(date.getMinutes()).padStart(2, "0")}`;
      
      output = `total ${Object.keys(dirStructure).length * 4}\n`;
      Object.keys(dirStructure).forEach((dir) => {
        output += `drwxr-xr-x  2 shm0rt  users  4096 ${month} ${day} ${time} `;
        output += `<a href="#" class="dir nav-link" onclick="cdDir('${dir}'); return false;">${dir}</a>\n`;
      });
      break;
      
    case 'tree':
      // tree output
      const treeNodes = Object.keys(dirStructure);
      output = `<span class="dir">.</span>\n`;
      treeNodes.forEach((dir, index) => {
        const prefix = index === treeNodes.length - 1 ? "└── " : "├── ";
        output += `<span>${prefix}</span><a href="#" class="dir nav-link" onclick="cdDir('${dir}'); return false;">${dir}</a>\n`;
      });
      break;
  }

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
  printDirectoryListing('ls');
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

  switch(c) {
    case "/help":
    case "help":
    case "?":
      printHelp();
      break;
    case "clear":
      clearOutput();
      break;
    case "home":
      window.scrollTo({ top: 0, behavior: 'smooth' });
      appendOutput('Navigating to top...');
      break;
    case "ls":
      printDirectoryListing('ls');
      break;
    case "ll":
      printDirectoryListing('ll');
      break;
    case "la":
      printDirectoryListing('la');
      break;
    case "tree":
      printDirectoryListing('tree');
      break;
    default:
      if (c.startsWith("cd ")) {
        const path = c.slice(3).trim().replace(/^\//, "");
        cdDir(path);
      } else {
        appendOutput(`Command not found: ${c}`, true);
      }
  }
}

// Make functions globally accessible
window.cdDir = cdDir;
window.processCommand = processCommand;
window.printIntro = printIntro;
window.appendOutput = appendOutput;