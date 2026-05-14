let isBlockingEnabled = true;

(function() {
    const hostname = window.location.hostname;
    const url = window.location.href;
    const isTikTok = hostname.includes('tiktok.com');
    const isFB = hostname.includes('facebook.com') && !url.includes('/messages');
    
    if (isTikTok || isFB) {
        chrome.storage.local.get(['enabled', 'blockCount'], (data) => {
            if (data.enabled !== false) {
                const newCount = (data.blockCount || 0) + 1;
                chrome.storage.local.set({ blockCount: newCount });
                const style = document.createElement('style');
                style.id = 'hollow-early-hide';
                style.innerHTML = `html { background: #020617 !important; } body { visibility: hidden !important; pointer-events: none !important; }`;
                (document.head || document.documentElement).appendChild(style);
            }
        });
    }
})();

function updateSettings() {
    chrome.storage.local.get('enabled', (data) => {
        isBlockingEnabled = data.enabled !== false;
        handlePageLogic();
    });
}

function handlePageLogic() {
    const hostname = window.location.hostname;
    if (hostname.includes('youtube.com')) {
        if (isBlockingEnabled) hideShorts();
        else showAllShorts();
    } else if (hostname.includes('facebook.com') || hostname.includes('tiktok.com')) {
        if (isBlockingEnabled) runGlobalBlocker();
        else removeGlobalOverlay();
    }
}

function showAllShorts() {
    const selectors = ['ytd-rich-shelf-renderer[is-shorts]', 'ytd-reel-shelf-renderer', 'grid-shelf-view-model', 'ytd-guide-entry-renderer[entry-id="FEshorts"]', 'ytd-mini-guide-entry-renderer[entry-id="FEshorts"]', 'yt-tab-shape[tab-title="Shorts"]', 'ytd-guide-entry-renderer:has(a[title="Shorts"])'];
    selectors.forEach(selector => document.querySelectorAll(selector).forEach(el => el.style.setProperty('display', '', 'important')));
}

function hideShorts() {
    if (!isBlockingEnabled) return;
    const selectors = ['ytd-rich-shelf-renderer[is-shorts]', 'ytd-reel-shelf-renderer', 'grid-shelf-view-model', 'ytd-guide-entry-renderer[entry-id="FEshorts"]', 'ytd-mini-guide-entry-renderer[entry-id="FEshorts"]', 'yt-tab-shape[tab-title="Shorts"]', 'ytd-guide-entry-renderer:has(a[title="Shorts"])'];
    selectors.forEach(selector => document.querySelectorAll(selector).forEach(el => el.style.setProperty('display', 'none', 'important')));
}

const OVERLAY_COMMANDS = ['help', 'stats', 'sudo', 'status', 'clear', 'exit', 'disable'];
let overlayHistory = [];
let overlayHistoryIndex = -1;

function runGlobalBlocker() {
    const hostname = window.location.hostname;
    const url = window.location.href;
    if (hostname.includes('facebook.com') && url.includes('/messages')) {
        removeGlobalOverlay();
        return;
    }
    if (!document.getElementById('hollow-global-overlay')) {
        const overlay = document.createElement('div');
        overlay.id = 'hollow-global-overlay';
        overlay.style.all = 'initial';
        const isTikTok = hostname.includes('tiktok');
        const platform = isTikTok ? "tiktok.com" : "facebook.com";

        overlay.innerHTML = `
            <div id="hollow-overlay-container" style="position: fixed; inset: 0; background: #020617; z-index: 2147483647; display: flex; align-items: center; justify-content: center; font-family: 'JetBrains Mono', monospace; color: #c0caf5; visibility: visible !important; pointer-events: auto !important;">
                <div id="hollow-term-window" style="width: 600px; background: #000000; border: 1px solid #1a1b26; border-radius: 4px; overflow: hidden; box-shadow: 0 30px 60px rgba(0,0,0,0.8); position: absolute; display: flex; flex-direction: column;">
                    <div id="hollow-term-header" style="background: #1a1b26; padding: 10px 15px; display: flex; align-items: center; justify-content: space-between; cursor: move; user-select: none;">
                        <div style="font-size: 11px; color: #565f89; font-weight: bold; letter-spacing: 0.05em;">HOLLOW-TERMINAL — ${platform.toUpperCase()}</div>
                        <button id="hollow-deactivate-btn" style="background: rgba(247, 118, 142, 0.1); border: 1px solid #f7768e; color: #f7768e; font-size: 10px; padding: 2px 8px; border-radius: 4px; cursor: pointer; font-family: inherit;">DEACTIVATE</button>
                    </div>
                    <div id="hollow-term-content" style="padding: 20px; font-size: 13px; line-height: 1.5; height: 250px; overflow-y: auto; scrollbar-width: none; pointer-events: auto;">
                        <div style="color: #f7768e; margin-bottom: 10px;">[SECURITY ALERT] UNTRUSTED DOMAIN DETECTED</div>
                        ${isTikTok ? '<div style="color: #7aa2f7; margin-top: 10px;">Wait... who are you? I will never enter TikTok.</div>' : '<div style="color: #565f89;">Access restricted. Only Messenger is allowed for communication.</div>'}
                        ${!isTikTok && hostname.includes('facebook.com') ? '<div style="margin-top: 20px;"><a href="https://www.facebook.com/messages/" style="color: #38bdf8; text-decoration: none;">> Open Messenger</a></div>' : ''}
                    </div>
                    <div style="padding: 10px 20px; border-top: 1px solid #1a1b26; display: flex; align-items: center; gap: 8px; pointer-events: auto; position: relative;">
                        <span style="color: #7dcfff; font-weight: bold;">~</span> <span style="color: #bb9af7; font-weight: bold;">❯</span>
                        <div style="position: relative; flex-grow: 1; display: flex; align-items: center;">
                            <input type="text" id="hollow-term-input" autocomplete="off" spellcheck="false" style="background: transparent; border: none; color: #c0caf5; font-family: inherit; font-size: 13px; outline: none; width: 100%; position: relative; z-index: 2;">
                            <span id="hollow-suggestion-hint" style="position: absolute; left: 0; color: #565f89; z-index: 1; pointer-events: none; white-space: pre;"></span>
                        </div>
                    </div>
                    <div style="background: #7aa2f7; color: #1a1b26; font-size: 11px; padding: 4px 12px; font-weight: bold; display: flex; justify-content: space-between;">
                        <div><span style="background: #3d59a1; color: white; padding: 0 6px; margin-right: 8px;">LOCKED</span>jmy@hollow-guard</div>
                        <div id="hollow-term-clock">00:00</div>
                    </div>
                </div>
            </div>
            <style>#hollow-term-content::-webkit-scrollbar { display: none; } #hollow-term-input:focus { outline: none; }</style>
        `;
        document.documentElement.appendChild(overlay);

        const termWindow = document.getElementById('hollow-term-window');
        const termHeader = document.getElementById('hollow-term-header');
        const termInput = document.getElementById('hollow-term-input');
        const termContent = document.getElementById('hollow-term-content');
        const termClock = document.getElementById('hollow-term-clock');
        const suggestionHint = document.getElementById('hollow-suggestion-hint');
        const deactivateBtn = document.getElementById('hollow-deactivate-btn');

        termInput.focus();
        document.addEventListener('click', () => { if (document.getElementById('hollow-global-overlay')) termInput.focus(); });

        const updateClock = () => {
            const now = new Date();
            termClock.innerText = now.getHours().toString().padStart(2, '0') + ':' + now.getMinutes().toString().padStart(2, '0');
        };
        setInterval(updateClock, 1000); updateClock();

        let isDragging = false; let offsetX, offsetY;
        termHeader.addEventListener('mousedown', (e) => {
            if (e.target === deactivateBtn) return;
            isDragging = true;
            const rect = termWindow.getBoundingClientRect();
            offsetX = e.clientX - rect.left; offsetY = e.clientY - rect.top;
        });
        document.addEventListener('mousemove', (e) => {
            if (!isDragging) return;
            termWindow.style.left = (e.clientX - offsetX) + 'px'; termWindow.style.top = (e.clientY - offsetY) + 'px';
            termWindow.style.right = 'auto'; termWindow.style.bottom = 'auto'; termWindow.style.margin = '0';
        });
        document.addEventListener('mouseup', () => isDragging = false);

        const getSuggestion = (val) => OVERLAY_COMMANDS.find(c => c.startsWith(val.toLowerCase())) || '';
        const updateHint = () => {
            const val = termInput.value;
            const match = getSuggestion(val);
            suggestionHint.innerText = (val && match && match !== val.toLowerCase()) ? " ".repeat(val.length) + match.slice(val.length) : '';
        };

        termInput.addEventListener('input', updateHint);
        termInput.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') {
                const fullCmd = termInput.value.trim();
                if (fullCmd) {
                    overlayHistory.unshift(fullCmd); overlayHistoryIndex = -1;
                    termInput.value = ''; suggestionHint.innerText = '';
                    handleOverlayCommand(fullCmd, termContent);
                }
            } else if (e.key === 'Tab' || e.key === 'ArrowRight') {
                const suggestion = getSuggestion(termInput.value);
                if (suggestion && termInput.selectionStart === termInput.value.length) {
                    e.preventDefault(); termInput.value = suggestion; updateHint();
                }
            } else if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (overlayHistoryIndex < overlayHistory.length - 1) {
                    overlayHistoryIndex++; termInput.value = overlayHistory[overlayHistoryIndex]; updateHint();
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (overlayHistoryIndex > 0) {
                    overlayHistoryIndex--; termInput.value = overlayHistory[overlayHistoryIndex]; updateHint();
                } else if (overlayHistoryIndex === 0) {
                    overlayHistoryIndex = -1; termInput.value = ''; updateHint();
                }
            }
        });

        deactivateBtn.addEventListener('click', () => chrome.storage.local.set({ enabled: false }));
        const earlyHide = document.getElementById('hollow-early-hide');
        if (earlyHide) earlyHide.remove();
    }
}

async function handleOverlayCommand(fullCmd, container) {
    const cmdLine = document.createElement('div');
    cmdLine.style.marginTop = '8px';
    cmdLine.innerHTML = `<span style="color: #7dcfff;">~</span> <span style="color: #bb9af7;">❯</span> ${fullCmd}`;
    container.appendChild(cmdLine);

    const output = document.createElement('div');
    output.style.color = '#9ece6a'; output.style.marginLeft = '18px'; output.style.whiteSpace = 'pre-wrap';

    const cmd = fullCmd.toLowerCase().split(' ')[0];
    if (cmd === 'help') output.innerText = "Available: stats, sudo, status, clear, disable, exit";
    else if (cmd === 'sudo') { output.innerText = "jmy is not in the sudoers file. This incident will be reported to your conscience."; output.style.color = '#f7768e'; }
    else if (cmd === 'stats') {
        const data = await chrome.storage.local.get('blockCount');
        output.innerText = `[DEFENSE METRICS]\nTikTok/FB blocks: ${data.blockCount || 0}\nEstimated time saved: ${(data.blockCount || 0) * 5} minutes`;
    } else if (cmd === 'disable') { chrome.storage.local.set({ enabled: false }); output.innerText = "System deactivated. Protection offline."; }
    else if (cmd === 'status') output.innerText = "System: ACTIVE\nLayer: STRICT_PROTECTION";
    else if (cmd === 'clear') { container.innerHTML = ''; return; }
    else if (cmd === 'exit') { window.location.href = "https://www.google.com"; return; }
    else { output.innerText = `sh: command not found: ${cmd}`; output.style.color = '#f7768e'; }
    
    container.appendChild(output);
    container.scrollTop = container.scrollHeight;
}

function removeGlobalOverlay() {
    const overlay = document.getElementById('hollow-global-overlay');
    if (overlay) overlay.remove();
    document.body && (document.body.style.visibility = '');
    const earlyHide = document.getElementById('hollow-early-hide');
    if (earlyHide) earlyHide.remove();
}

updateSettings();
chrome.storage.onChanged.addListener((changes) => {
    if (changes.enabled) {
        isBlockingEnabled = changes.enabled.newValue !== false;
        handlePageLogic();
    }
});
const observer = new MutationObserver(() => handlePageLogic());
observer.observe(document.documentElement, { childList: true, subtree: true });
setInterval(handlePageLogic, 500);
