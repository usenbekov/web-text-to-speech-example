class TextToSpeech {
  static get isSupported() { return 'speechSynthesis' in window; }

  get paused() { return this.synth.paused }
  get speaking() { return this.synth.speaking }

  constructor(opts) {
    this.onVoicesChanged = opts?.onVoicesChanged || function() {};
    this.onStatusChanged = opts?.onStatusChanged || function() {};

    this.synth = speechSynthesis;
    this.synth.onvoiceschanged = this.onVoicesChanged;

    if (this.getVoices().length > 0) setTimeout(this.onVoicesChanged);
    setTimeout(this.onStatusChanged);
  }

  getVoices() { return this.synth.getVoices() }
  pause() { this.synth.pause() }
  resume() { this.synth.resume() }

  cancel() {
    this.synth.cancel();
    this.onStatusChanged();
  }

  speak({voice, text, speed = 1, pitch = 1}) {
    this.cancel();
    
    const utter = new SpeechSynthesisUtterance();
    utter.rate = speed;
    utter.pitch = pitch;
    utter.text = text;
    utter.lang = voice.lang;
    utter.voice = voice;
    utter.onend = this.onStatusChanged;
    utter.onpause = this.onStatusChanged;
    utter.onresume = this.onStatusChanged;
    utter.onstart = this.onStatusChanged;
    utter.onboundary = this.onStatusChanged;
    this.synth.speak(utter);
  }
}
