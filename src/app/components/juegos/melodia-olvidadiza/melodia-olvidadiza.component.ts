import { Component } from '@angular/core';
import { HeaderComponent } from "../../header/header.component";

@Component({
  selector: 'app-melodia-olvidadiza',
  imports: [HeaderComponent],
  templateUrl: './melodia-olvidadiza.component.html',
  styleUrl: './melodia-olvidadiza.component.css'
})
export class MelodiaOlvidadizaComponent {
  notes = ['C', 'D', 'E', 'F', 'G', 'A', 'B', 'C2'];
  frequencies: { [key: string]: number } = {
    C: 261.63,
    D: 293.66,
    E: 329.63,
    F: 349.23,
    G: 392.00,
    A: 440.00,
    B: 493.88,
    C2: 523.25,
  };

  sequence: string[] = [];
  playedNotes: string[] = [];

  generateSequence(length: number): void {
    this.sequence = Array.from({ length }, () => this.notes[Math.floor(Math.random() * this.notes.length)]);
    console.log('Generated sequence:', this.sequence);
  }

  playNote(note: string): void {
    console.log(`Playing note: ${note}`);
    const oscillator = audioContext.createOscillator();
    const gainNode = audioContext.createGain();
    
    oscillator.frequency.value = this.frequencies[note];
    oscillator.type = 'sine';
    oscillator.connect(gainNode);
    gainNode.connect(audioContext.destination);
    gainNode.gain.setValueAtTime(0.5, audioContext.currentTime);
    
    oscillator.start();
    setTimeout(() => {
      oscillator.stop();
    }, 300);
    
    this.playedNotes.push(note);
    this.checkSequence();
  }
  
  checkSequence(): void {
    if (this.playedNotes.length === this.sequence.length) {
      const isCorrect = this.playedNotes.every((note, index) => note === this.sequence[index]);
      console.log(isCorrect ? 'Correct sequence!' : 'Incorrect sequence. Try again.');
      this.playedNotes = [];
      this.generateSequence(this.sequence.length + 1);
    }
  }
}
const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
