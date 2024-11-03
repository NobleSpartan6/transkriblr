class SpeechTranscriber {
  constructor() {
    this.recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    this.recognition.continuous = true;
    this.recognition.interimResults = true;
    this.recognition.maxAlternatives = 3;
    this.transcript = '';
    this.confidenceThreshold = 0.8;
    this.processingQueue = [];
    this.isProcessing = false;
    
    this.setupRecognition();
  }

  setupRecognition() {
    this.recognition.onresult = (event) => {
      let interimTranscript = '';
      let finalTranscript = '';

      for (let i = event.resultIndex; i < event.results.length; ++i) {
        const result = event.results[i];
        const transcript = result[0].transcript;
        const confidence = result[0].confidence;

        if (result.isFinal && confidence > this.confidenceThreshold) {
          this.processingQueue.push(transcript);
          this.processQueue();
        } else {
          interimTranscript += transcript;
        }
      }

      // Send update message
      chrome.runtime.sendMessage({
        action: 'updateTranscript',
        transcript: this.transcript,
        interim: interimTranscript
      });
    };

    // Handle errors and automatic restart
    this.recognition.onerror = (event) => {
      console.error('Speech recognition error:', event.error);
      if (event.error === 'network') {
        setTimeout(() => this.restart(), 1000);
      }
    };

    this.recognition.onend = () => {
      if (this.isRecording) {
        this.restart();
      }
    };
  }

  async processQueue() {
    if (this.isProcessing || this.processingQueue.length === 0) return;
    
    this.isProcessing = true;
    
    while (this.processingQueue.length > 0) {
      const text = this.processingQueue.shift();
      const processed = TextProcessor.addPunctuation(text);
      const formatted = TextProcessor.formatTranscript(processed);
      
      this.transcript += formatted + ' ';
      
      // Identify keywords periodically
      if (this.processingQueue.length % 5 === 0) {
        const keywords = TextProcessor.identifyKeywords(this.transcript);
        chrome.runtime.sendMessage({
          action: 'updateKeywords',
          keywords
        });
      }
    }
    
    this.isProcessing = false;
  }

  start() {
    this.isRecording = true;
    this.transcript = '';
    this.processingQueue = [];
    this.recognition.start();
  }

  stop() {
    this.isRecording = false;
    this.recognition.stop();
    return this.transcript;
  }
}
