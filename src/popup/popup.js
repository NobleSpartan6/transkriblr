let selectedTabId = null;
let isRecording = false;

document.addEventListener('DOMContentLoaded', async () => {
    await updateTabList();
    setupEventListeners();
});

async function updateTabList() {
    const tabSelect = document.getElementById('tabSelect');
    const tabs = await chrome.tabs.query({ audible: true });
    
    while (tabSelect.options.length > 1) {
        tabSelect.remove(1);
    }
    
    tabs.forEach(tab => {
        const option = document.createElement('option');
        option.value = tab.id;
        option.textContent = tab.title;
        tabSelect.appendChild(option);
    });
}

function setupEventListeners() {
    const tabSelect = document.getElementById('tabSelect');
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const exportBtn = document.getElementById('exportBtn');

    tabSelect.addEventListener('change', (e) => {
        selectedTabId = parseInt(e.target.value);
        startBtn.disabled = !selectedTabId;
    });

    startBtn.addEventListener('click', startRecording);
    stopBtn.addEventListener('click', stopRecording);
    exportBtn.addEventListener('click', exportTranscript);

    setInterval(updateTabList, 5000);
}

function startRecording() {
    if (!selectedTabId) return;
    
    chrome.runtime.sendMessage({ 
        action: 'startRecording',
        tabId: selectedTabId
    });
    
    isRecording = true;
    updateUI();
}

function stopRecording() {
    chrome.runtime.sendMessage({ action: 'stopRecording' });
    isRecording = false;
    updateUI();
}

function exportTranscript() {
    const transcriptText = document.getElementById('transcriptArea').textContent;
    const blob = new Blob([transcriptText], { type: 'text/plain' });
    const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
    
    chrome.downloads.download({
        url: URL.createObjectURL(blob),
        filename: `transcript-${timestamp}.txt`,
        saveAs: true
    });
}

function updateUI() {
    const startBtn = document.getElementById('startBtn');
    const stopBtn = document.getElementById('stopBtn');
    const tabSelect = document.getElementById('tabSelect');
    const recordingIndicator = document.getElementById('recordingIndicator');

    startBtn.disabled = isRecording || !selectedTabId;
    stopBtn.disabled = !isRecording;
    tabSelect.disabled = isRecording;
    recordingIndicator.style.display = isRecording ? 'inline' : 'none';
}

chrome.runtime.onMessage.addListener((message) => {
    if (message.action === 'updateTranscript') {
        const transcriptArea = document.getElementById('transcriptArea');
        transcriptArea.textContent = message.transcript;
        if (message.interim) {
            transcriptArea.textContent += message.interim;
        }
    }
});
