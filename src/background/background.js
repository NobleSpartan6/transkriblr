let audioContext;
let transcriber;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.action) {
    case 'startRecording':
      startCapture();
      break;
    case 'stopRecording':
      stopCapture();
      break;
  }
});

async function startCapture() {
  try {
    const stream = await chrome.tabCapture.capture({
      audio: true,
      video: false
    });
    
    if (!audioContext) {
      audioContext = new AudioContext();
    }
    
    const source = audioContext.createMediaStreamSource(stream);
    
    // Initialize transcriber
    transcriber = new SpeechTranscriber();
    transcriber.start();
    
    // Connect audio stream to transcriber
    source.connect(audioContext.destination);
    
  } catch (error) {
    console.error('Error starting capture:', error);
  }
}

function stopCapture() {
  if (transcriber) {
    const finalTranscript = transcriber.stop();
    if (audioContext) {
      audioContext.close();
      audioContext = null;
    }
  }
}
