// Voice and Text-to-Speech Service
class VoiceService {
  constructor() {
    this.synthesis = window.speechSynthesis;
    this.recognition = null;
    this.isListening = false;
    this.isSpeaking = false;
    this.onResult = null;
    this.onError = null;
    this.onStart = null;
    this.onEnd = null;
    
    // Initialize Speech Recognition if available
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
      const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
      this.recognition = new SpeechRecognition();
      this.setupRecognition();
    }
  }

  setupRecognition() {
    if (!this.recognition) return;

    this.recognition.continuous = false;
    this.recognition.interimResults = false;
    this.recognition.maxAlternatives = 1;

    this.recognition.onstart = () => {
      this.isListening = true;
      if (this.onStart) this.onStart();
    };

    this.recognition.onresult = (event) => {
      const transcript = event.results[0][0].transcript;
      if (this.onResult) this.onResult(transcript);
    };

    this.recognition.onerror = (event) => {
      this.isListening = false;
      if (this.onError) this.onError(event.error);
    };

    this.recognition.onend = () => {
      this.isListening = false;
      if (this.onEnd) this.onEnd();
    };
  }

  // Set language for speech recognition
  setLanguage(language) {
    if (this.recognition) {
      this.recognition.lang = this.getLanguageCode(language);
    }
  }

  // Get proper language code for speech recognition
  getLanguageCode(language) {
    const langCodes = {
      'en': 'en-US',
      'hi': 'hi-IN',
      'pa': 'pa-IN',
      'te': 'te-IN',
      'ta': 'ta-IN',
      'bn': 'bn-IN',
      'gu': 'gu-IN',
      'mr': 'mr-IN',
      'kn': 'kn-IN',
      'ml': 'ml-IN',
      'or': 'or-IN'
    };
    return langCodes[language] || 'en-US';
  }

  // Start voice recognition
  startListening(callbacks = {}) {
    if (!this.recognition) {
      if (callbacks.onError) callbacks.onError('Speech recognition not supported');
      return false;
    }

    if (this.isListening) {
      this.stopListening();
      return false;
    }

    this.onResult = callbacks.onResult;
    this.onError = callbacks.onError;
    this.onStart = callbacks.onStart;
    this.onEnd = callbacks.onEnd;

    try {
      this.recognition.start();
      return true;
    } catch (error) {
      if (callbacks.onError) callbacks.onError(error.message);
      return false;
    }
  }

  // Stop voice recognition
  stopListening() {
    if (this.recognition && this.isListening) {
      this.recognition.stop();
    }
  }

  // Text-to-Speech functionality
  speak(text, options = {}) {
    if (this.isSpeaking) {
      this.stopSpeaking();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    
    // Set voice properties
    utterance.rate = options.rate || 1;
    utterance.pitch = options.pitch || 1;
    utterance.volume = options.volume || 1;
    
    // Set language-specific voice
    const voice = this.getVoiceForLanguage(options.language || 'en');
    if (voice) utterance.voice = voice;

    // Event handlers
    utterance.onstart = () => {
      this.isSpeaking = true;
      if (options.onStart) options.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (options.onEnd) options.onEnd();
    };

    utterance.onerror = (event) => {
      this.isSpeaking = false;
      if (options.onError) options.onError(event.error);
    };

    this.synthesis.speak(utterance);
    return utterance;
  }

  // Get available voices for a language
  getVoiceForLanguage(language) {
    const voices = this.synthesis.getVoices();
    const langCode = this.getLanguageCode(language);
    
    // Try to find a voice that matches the language
    const matchingVoice = voices.find(voice => 
      voice.lang.startsWith(langCode.split('-')[0])
    );
    
    return matchingVoice || voices[0];
  }

  // Stop speaking
  stopSpeaking() {
    if (this.synthesis.speaking) {
      this.synthesis.cancel();
      this.isSpeaking = false;
    }
  }

  // Get available voices
  getAvailableVoices() {
    return this.synthesis.getVoices();
  }

  // Check if voice features are supported
  isVoiceSupported() {
    return !!(this.recognition && this.synthesis);
  }

  // Check if currently listening
  getIsListening() {
    return this.isListening;
  }

  // Check if currently speaking
  getIsSpeaking() {
    return this.isSpeaking;
  }

  // Auto-speak text with language detection
  autoSpeak(text, language = 'en') {
    if (!text || !this.synthesis) return;
    
    this.speak(text, {
      language,
      rate: 0.9,
      onError: (error) => console.warn('TTS Error:', error)
    });
  }

  // Quick voice commands setup
  setupVoiceCommands(commands = {}) {
    this.startListening({
      onResult: (transcript) => {
        const command = transcript.toLowerCase().trim();
        
        // Check for matching commands
        for (const [key, action] of Object.entries(commands)) {
          if (command.includes(key.toLowerCase())) {
            action(transcript);
            break;
          }
        }
      },
      onError: (error) => console.warn('Voice command error:', error)
    });
  }
}

// Create and export a singleton instance
export const voiceService = new VoiceService();
export default VoiceService;
