// Debug mode
const DEBUG = true;

// Global variables
let audioContext;
let transcriber;
let currentTabId = null;

// Debug logging
function debugLog(...args) {
  if (DEBUG) {
    console.log('[Transcriber Debug]:', ...args);
  }
}

// Message listener
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  debugLog('Received message:', message);
  
  switch (message.action) {
    case 'startRecording':
      startCapture(message.tabId);
      break;
    case 'stopRecording':
      stopCapture();
      break;
    default:
      debugLog('Unknown message action:', message.action);
  }
});

// Audio capture function
async function startCapture(tabId) {
  try {
    debugLog('Starting audio capture for tab:', tabId);
    currentTabId = tabId;
    
    // Capture specific tab's audio
    const stream = await chrome.tabCapture.capture({
      audio: true,
      video: false,
      tabId: tabId
    });
    
    if (stream) {
      if (!audioContext) {
        audioContext = new AudioContext();
      }
      
      const source = audioContext.createMediaStreamSource(stream);
      
      // Initialize transcriber
      transcriber = new SpeechTranscriber();
      transcriber.start();
      
      // Connect audio stream to transcriber
      source.connect(audioContext.destination);
      
      debugLog('Recording started for tab:', tabId);
    }
    
  } catch (error) {
    console.error('Error starting capture:', error);
  }
}

// Stop capture function
function stopCapture() {
  debugLog('Stopping capture...');
  
  if (transcriber) {
    const finalTranscript = transcriber.stop();
    debugLog('Final transcript:', finalTranscript);
    
    // Send transcript to popup
    chrome.runtime.sendMessage({
      action: 'updateTranscript',
      transcript: finalTranscript
    });
  }
  
  if (audioContext) {
    audioContext.close();
    audioContext = null;
    debugLog('Audio context closed');
  }
}

// Initialize on install
chrome.runtime.onInstalled.addListener(() => {
  debugLog('Extension installed/updated');
});
