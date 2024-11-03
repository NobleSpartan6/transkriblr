let isRecording = false;

document.getElementById('startBtn').addEventListener('click', startRecording);
document.getElementById('stopBtn').addEventListener('click', stopRecording);
document.getElementById('exportBtn').addEventListener('click', exportTranscript);

function startRecording() {
  chrome.runtime.sendMessage({ action: 'startRecording' });
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
  document.getElementById('startBtn').disabled = isRecording;
  document.getElementById('stopBtn').disabled = !isRecording;
  document.getElementById('recordingIndicator').style.display = 
    isRecording ? 'inline' : 'none';
}

// Listen for transcript updates
chrome.runtime.onMessage.addListener((message) => {
  if (message.action === 'updateTranscript') {
    const transcriptArea = document.getElementById('transcriptArea');
    transcriptArea.textContent = message.transcript;
    if (message.interim) {
      transcriptArea.textContent += message.interim;
    }
  }
});
