(() => {
  'use strict';
  let t,
    e = window.AudioContext || window.webkitAudioContext,
    s = (t) => {
      let e = new Event('error');
      return (e.data = new Error('Wrong state for ' + t)), e;
    };
  class i {
    constructor(t, e = null) {
      (this.stream = t),
        (this.config = e),
        (this.state = 'inactive'),
        (this.em = document.createDocumentFragment()),
        (this.encoder = ((t) => {
          let e = t
              .toString()
              .replace(/^(\(\)\s*=>|function\s*\(\))\s*{/, '')
              .replace(/}$/, ''),
            s = new Blob([e]);
          return new Worker(URL.createObjectURL(s));
        })(i.encoder));
      let s = this;
      this.encoder.addEventListener('message', (t) => {
        let e = new Event('dataavailable');
        (e.data = new Blob([t.data], { type: s.mimeType })),
          s.em.dispatchEvent(e),
          'inactive' === s.state && s.em.dispatchEvent(new Event('stop'));
      });
    }
    start(i) {
      if ('inactive' !== this.state) return this.em.dispatchEvent(s('start'));
      (this.state = 'recording'),
        t || (t = new e(this.config)),
        (this.clone = this.stream.clone()),
        (this.input = t.createMediaStreamSource(this.clone)),
        (this.processor = t.createScriptProcessor(2048, 1, 1)),
        this.encoder.postMessage(['init', t.sampleRate]),
        (this.processor.onaudioprocess = (t) => {
          'recording' === this.state &&
            this.encoder.postMessage([
              'encode',
              t.inputBuffer.getChannelData(0),
            ]);
        }),
        this.input.connect(this.processor),
        this.processor.connect(t.destination),
        this.em.dispatchEvent(new Event('start')),
        i &&
          (this.slicing = setInterval(() => {
            'recording' === this.state && this.requestData();
          }, i));
    }
    stop() {
      return 'inactive' === this.state
        ? this.em.dispatchEvent(s('stop'))
        : (this.requestData(),
          (this.state = 'inactive'),
          this.clone.getTracks().forEach((t) => {
            t.stop();
          }),
          this.processor.disconnect(),
          this.input.disconnect(),
          clearInterval(this.slicing));
    }
    pause() {
      return 'recording' !== this.state
        ? this.em.dispatchEvent(s('pause'))
        : ((this.state = 'paused'), this.em.dispatchEvent(new Event('pause')));
    }
    resume() {
      return 'paused' !== this.state
        ? this.em.dispatchEvent(s('resume'))
        : ((this.state = 'recording'),
          this.em.dispatchEvent(new Event('resume')));
    }
    requestData() {
      return 'inactive' === this.state
        ? this.em.dispatchEvent(s('requestData'))
        : this.encoder.postMessage(['dump', t.sampleRate]);
    }
    addEventListener(...t) {
      this.em.addEventListener(...t);
    }
    removeEventListener(...t) {
      this.em.removeEventListener(...t);
    }
    dispatchEvent(...t) {
      this.em.dispatchEvent(...t);
    }
  }
  (i.prototype.mimeType = 'audio/wav'),
    (i.isTypeSupported = (t) => i.prototype.mimeType === t),
    (i.notSupported = !navigator.mediaDevices || !e),
    (i.encoder = () => {
      let t = [];
      onmessage = (e) => {
        'encode' === e.data[0]
          ? (function (e) {
              let s = e.length,
                i = new Uint8Array(2 * s);
              for (let t = 0; t < s; t++) {
                let s = 2 * t,
                  n = e[t];
                n > 1 ? (n = 1) : n < -1 && (n = -1),
                  (n *= 32768),
                  (i[s] = n),
                  (i[s + 1] = n >> 8);
              }
              t.push(i);
            })(e.data[1])
          : 'dump' === e.data[0] &&
            (function (e) {
              let s = t.length ? t[0].length : 0,
                i = t.length * s,
                n = new Uint8Array(44 + i),
                a = new DataView(n.buffer);
              a.setUint32(0, 1380533830, !1),
                a.setUint32(4, 36 + i, !0),
                a.setUint32(8, 1463899717, !1),
                a.setUint32(12, 1718449184, !1),
                a.setUint32(16, 16, !0),
                a.setUint16(20, 1, !0),
                a.setUint16(22, 1, !0),
                a.setUint32(24, e, !0),
                a.setUint32(28, 2 * e, !0),
                a.setUint16(32, 2, !0),
                a.setUint16(34, 16, !0),
                a.setUint32(36, 1684108385, !1),
                a.setUint32(40, i, !0);
              for (let e = 0; e < t.length; e++) n.set(t[e], e * s + 44);
              (t = []), postMessage(n.buffer, [n.buffer]);
            })(e.data[1]);
      };
    });
  const n = i;
  console.log('using polyfill'), (window.MediaRecorder = n);
})();
