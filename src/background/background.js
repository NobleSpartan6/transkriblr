// Debug mode
const DEBUG = true;

// Global variables
let audioContext;
let transcriber;

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
      startCapture();
      break;
    case 'stopRecording':
      stopCapture();
      break;
    default:
      debugLog('Unknown message action:', message.action);
  }
});

// Audio capture function
async function startCapture() {
  try {
    debugLog('Starting audio capture...');
    const stream = await chrome.tabCapture.capture({
      audio: true,
      video: false
    });
    
    if (stream) {
      debugLog('Audio stream captured successfully');
      
      if (!audioContext) {
        audioContext = new AudioContext();
      }
      
      const source = audioContext.createMediaStreamSource(stream);
      
      // Initialize transcriber if needed
      if (!transcriber) {
        transcriber = new SpeechTranscriber();
      }
      
      transcriber.start();
      source.connect(audioContext.destination);
      
      debugLog('Recording started');
    } else {
      debugLog('Failed to capture audio stream');
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
