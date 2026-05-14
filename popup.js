const terminal = document.getElementById('terminal');
const input = document.getElementById('cmd-input');
const suggestionHint = document.getElementById('suggestion-hint');
const clock = document.getElementById('clock');

const COMMANDS = ['help', 'guard', 'status', 'clear', 'exit'];
const GUARD_ARGS = ['on', 'off'];
let commandHistory = [];
let historyIndex = -1;

function updateClock() {
    const now = new Date();
    clock.innerText = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
}
setInterval(updateClock, 1000);
updateClock();

window.addEventListener('DOMContentLoaded', () => {
    printOutput('Hollow Guard OS online.', 'success');
});

document.addEventListener('click', () => input.focus());

input.addEventListener('input', () => updateSuggestion());

input.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const cmd = input.value.trim();
        if (cmd) {
            handleCommand(cmd);
            commandHistory.unshift(cmd);
            historyIndex = -1;
            input.value = '';
            suggestionHint.innerText = '';
        }
    } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
        const suggestion = getSuggestion();
        if (suggestion && input.selectionStart === input.value.length) {
            e.preventDefault();
            input.value = suggestion;
            updateSuggestion();
        }
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        if (historyIndex < commandHistory.length - 1) {
            historyIndex++;
            input.value = commandHistory[historyIndex];
            updateSuggestion();
        }
    } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        if (historyIndex > 0) {
            historyIndex--;
            input.value = commandHistory[historyIndex];
            updateSuggestion();
        } else if (historyIndex === 0) {
            historyIndex = -1;
            input.value = '';
            updateSuggestion();
        }
    }
});

function getSuggestion() {
    const val = input.value;
    if (!val) return '';
    const parts = val.toLowerCase().split(' ');
    if (parts.length === 1) {
        return COMMANDS.find(c => c.startsWith(parts[0])) || '';
    } 
    if (parts.length === 2 && parts[0] === 'guard') {
        const match = GUARD_ARGS.find(a => a.startsWith(parts[1]));
        return match ? `guard ${match}` : '';
    }
    return '';
}

function updateSuggestion() {
    const val = input.value;
    const suggestion = getSuggestion();
    if (suggestion && suggestion.startsWith(val.toLowerCase()) && val.length > 0) {
        suggestionHint.innerText = " ".repeat(val.length) + suggestion.slice(val.length);
    } else {
        suggestionHint.innerText = '';
    }
}

async function handleCommand(fullCmd) {
    const parts = fullCmd.toLowerCase().split(' ');
    const cmd = parts[0];
    const args = parts.slice(1);

    printEntry(fullCmd);

    switch (cmd) {
        case 'help':
            printOutput('guard [on|off] | status | clear | exit');
            break;
        case 'guard':
            if (args[0] === 'on') {
                await chrome.storage.local.set({ enabled: true });
                printOutput('guard -> active');
            } else if (args[0] === 'off') {
                await chrome.storage.local.set({ enabled: false });
                printOutput('guard -> paused', 'error');
            } else {
                printOutput('usage: guard [on|off]');
            }
            break;
        case 'status':
            const data = await chrome.storage.local.get('enabled');
            printOutput(`status: ${data.enabled !== false ? 'active' : 'paused'}`);
            break;
        case 'clear':
            terminal.innerHTML = '';
            break;
        case 'exit':
            window.close();
            break;
        default:
            printOutput(`sh: command not found: ${cmd}`, 'error');
    }
    terminal.scrollTop = terminal.scrollHeight;
}

function printEntry(cmd) {
    const now = new Date();
    const timeStr = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
    const line = document.createElement('div');
    line.className = 'line';
    line.innerHTML = `
        <div class="content"><span style="color: #7dcfff; font-weight: bold;">~</span><span style="color: #bb9af7; font-weight: bold;">❯</span><span>${cmd}</span></div>
        <div class="timestamp">${timeStr}</div>
    `;
    terminal.appendChild(line);
}

function printOutput(text, type = '') {
    const div = document.createElement('div');
    div.className = `output ${type}`;
    div.innerText = `  └─ ${text}`;
    terminal.appendChild(div);
}
