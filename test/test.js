// Add this to your project for basic testing
class TranscriberTester {
  static async runTests() {
    console.group('Running Transcriber Tests');
    
    try {
      // Test text processing
      this.testTextFormatting();
      
      // Test audio capture
      await this.testAudioCapture();
      
      // Test transcription
      await this.testTranscription();
      
      console.log('✅ All tests completed successfully');
    } catch (error) {
      console.error('❌ Test failed:', error);
    }
    
    console.groupEnd();
  }

  static testTextFormatting() {
    const testCases = [
      {
        input: 'hello world this is a test',
        expected: 'Hello world this is a test.'
      },
      {
        input: 'mr smith went to dr brown',
        expected: 'Mr. Smith went to Dr. Brown.'
      }
    ];

    testCases.forEach(({input, expected}) => {
      const result = TextProcessor.addPunctuation(input);
      console.assert(
        result === expected,
        `Text formatting failed: Expected "${expected}", got "${result}"`
      );
    });
  }

  static async testAudioCapture() {
    return new Promise((resolve, reject) => {
      chrome.tabCapture.capture(
        { audio: true, video: false },
        (stream) => {
          if (stream) {
            stream.getTracks().forEach(track => track.stop());
            console.log('✅ Audio capture test passed');
            resolve();
          } else {
            reject(new Error('Failed to capture audio stream'));
          }
        }
      );
    });
  }

  static async testTranscription() {
    const transcriber = new SpeechTranscriber();
    
    // Test transcriber initialization
    console.assert(
      transcriber.recognition instanceof (window.SpeechRecognition || window.webkitSpeechRecognition),
      'Speech recognition not properly initialized'
    );
    
    // Test start/stop functionality
    transcriber.start();
    console.assert(transcriber.isRecording === true, 'Recording failed to start');
    
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    transcriber.stop();
    console.assert(transcriber.isRecording === false, 'Recording failed to stop');
  }
}
