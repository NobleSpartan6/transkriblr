class TextProcessor {
  static addPunctuation(text) {
    // Split into sentences based on natural pauses and patterns
    const sentences = text.split(/(?<=[.!?])\s+|\n+/);
    
    return sentences.map(sentence => {
      // Skip empty sentences
      if (!sentence.trim()) return '';
      
      let processed = sentence
        // Capitalize first letter of each sentence
        .replace(/^\w/, c => c.toUpperCase())
        // Add periods to sentences that don't end with punctuation
        .replace(/([a-z])$/i, '$1.');
      
      // Common abbreviations
      const abbreviations = {
        'mr': 'Mr.',
        'mrs': 'Mrs.',
        'dr': 'Dr.',
        'vs': 'vs.',
        'etc': 'etc.',
        'eg': 'e.g.',
        'ie': 'i.e.',
      };

      Object.entries(abbreviations).forEach(([abbr, full]) => {
        const regex = new RegExp(`\\b${abbr}\\b`, 'gi');
        processed = processed.replace(regex, full);
      });

      return processed;
    }).join(' ');
  }

  static formatTranscript(text) {
    return text
      // Add paragraph breaks on longer pauses (detected by multiple spaces)
      .replace(/\s{4,}/g, '\n\n')
      // Add commas for natural pauses
      .replace(/(\w+)\s+(?:and|or|but|nor|for|so|yet)\s+/g, '$1, $2 ')
      // Fix common formatting issues
      .replace(/\s+([.,!?])/g, '$1')
      // Fix spacing after punctuation
      .replace(/([.,!?])\s*(\w)/g, '$1 $2')
      // Remove duplicate spaces
      .replace(/\s+/g, ' ')
      .trim();
  }

  static identifyKeywords(text) {
    const commonWords = new Set(['the', 'be', 'to', 'of', 'and', 'a', 'in', 'that', 'have']);
    const words = text.toLowerCase().match(/\b\w+\b/g) || [];
    const wordFrequency = {};
    
    words.forEach(word => {
      if (!commonWords.has(word)) {
        wordFrequency[word] = (wordFrequency[word] || 0) + 1;
      }
    });

    return Object.entries(wordFrequency)
      .sort(([,a], [,b]) => b - a)
      .slice(0, 5)
      .map(([word]) => word);
  }
} 