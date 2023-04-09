!function() {
  const root = document.querySelector('#text-to-speech');
  if (!TextToSpeech.isSupported) {
    root.textContent = "This browser doesn't support Text-To-Speech.";
    root.style.color = 'red';
    return;
  }

  const comp = {
    txt: root.querySelector('#txt'),
    voices: root.querySelector('#voices'),
    speed: root.querySelector('#speed'),
    pitch: root.querySelector('#pitch'),
    speak: root.querySelector('#speak'),
    pause: root.querySelector('#pause'),
    cancel: root.querySelector('#cancel'),
  };

  const tts = new TextToSpeech({
    onVoicesChanged: () => {
      const voiceOpts = tts.getVoices().map(voice => {
        const opt = document.createElement('option');
        opt.textContent = `${voice.name} (${voice.lang})`;
        opt.setAttribute('value', voice.name);
        return opt;
      });
      comp.voices.replaceChildren(...voiceOpts);
    },
    onStatusChanged: (event) => {
      comp.voices.disabled = tts.speaking;
      comp.speed.disabled = tts.speaking;
      comp.pitch.disabled = tts.speaking;
      comp.speak.disabled = tts.speaking;
      comp.cancel.disabled = !tts.speaking;
      comp.pause.disabled = !tts.speaking;
      comp.pause.textContent = tts.paused ? 'Resume' : 'Pause';

      if (!tts.speaking) {
        comp.txt.blur();
      }

      if (event && event.name === 'word') {
        comp.txt.focus();
        comp.txt.setSelectionRange(
          event.charIndex,
          comp.txt.value.indexOf(' ', event.charIndex),
        );
      }
    },
  });

  comp.speak.onclick = () => {
    tts.speak({
      voice: tts.getVoices().find(voice => voice.name === comp.voices.selectedOptions[0].getAttribute("value")),
      speed: comp.speed.selectedOptions[0].getAttribute("value"),
      pitch: comp.pitch.selectedOptions[0].getAttribute("value"),
      text: comp.txt.value,
    });
  };

  comp.pause.onclick = () => {
    if (tts.paused) tts.resume();
    else tts.pause();
  };

  comp.cancel.onclick = () => {
    tts.cancel();
  };
}()
