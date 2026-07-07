/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

class SoundEngine {
  private ctx: AudioContext | null = null;
  private isMuted: boolean = false;

  toggleMute() {
    this.isMuted = !this.isMuted;
    return this.isMuted;
  }

  private initCtx() {
    if (!this.ctx) {
      this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    }
    if (this.ctx.state === "suspended") {
      this.ctx.resume();
    }
  }

  private playTone(freq: number, duration: number, type: OscillatorType = "sine", gainVal: number = 0.1, slideToFreq?: number) {
    try {
      if (this.isMuted) return;
      this.initCtx();
      if (!this.ctx) return;
      
      const osc = this.ctx.createOscillator();
      const gainNode = this.ctx.createGain();
      
      osc.type = type;
      osc.frequency.setValueAtTime(freq, this.ctx.currentTime);
      if (slideToFreq) {
        osc.frequency.exponentialRampToValueAtTime(slideToFreq, this.ctx.currentTime + duration);
      }
      
      gainNode.gain.setValueAtTime(gainVal, this.ctx.currentTime);
      gainNode.gain.exponentialRampToValueAtTime(0.0001, this.ctx.currentTime + duration);
      
      osc.connect(gainNode);
      gainNode.connect(this.ctx.destination);
      
      osc.start();
      osc.stop(this.ctx.currentTime + duration);
    } catch (e) {
      console.warn("Audio synthesis unavailable:", e);
    }
  }

  // Double chime for notifications
  playNotification() {
    this.playTone(587.33, 0.12, "sine", 0.05); // D5
    setTimeout(() => {
      this.playTone(880.00, 0.25, "sine", 0.05); // A5
    }, 100);
  }

  // Quick ascending digital blip for scans
  playBarcodeScanned() {
    this.playTone(1320, 0.04, "sine", 0.08);
    setTimeout(() => {
      this.playTone(1975, 0.08, "sine", 0.08);
    }, 40);
  }

  // Soft sci-fi swoop for AI Completion
  playAIComplete() {
    this.playTone(660, 0.1, "sine", 0.04);
    setTimeout(() => {
      this.playTone(987.77, 0.1, "sine", 0.04);
    }, 80);
    setTimeout(() => {
      this.playTone(1318.51, 0.35, "sine", 0.04, 1800);
    }, 160);
  }

  // Smooth sliding upload swoop
  playUpload() {
    this.playTone(330, 0.4, "triangle", 0.06, 880);
  }

  // Crisp micro feedback click
  playClick() {
    this.playTone(1000, 0.02, "sine", 0.03);
  }
}

export const sound = new SoundEngine();
export default sound;
