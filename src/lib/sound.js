// src/lib/sound.js
class NotificationSound {
  constructor() {
    this.audio = null;
    this.isEnabled = localStorage.getItem('notificationSound') !== 'false';
    this.init();
  }

  init() {
    try {
      // Create audio element
      this.audio = new Audio();
      
      // Use multiple formats for better compatibility
      this.audio.src = '/public/notification.mp3'; // Place in public/sounds/
      // OR use base64 sound (see Method 2 below)
      
      this.audio.volume = 0.5; // 50% volume
      this.audio.preload = 'auto';
    } catch (error) {
      console.error('Failed to initialize notification sound:', error);
    }
  }

  play() {
    if (!this.isEnabled) return;
    
    try {
      // Reset audio to start
      if (this.audio) {
        this.audio.currentTime = 0;
        this.audio.play().catch(error => {
          // Autoplay was prevented - user interaction needed
          console.log('Sound autoplay prevented:', error);
        });
      }
    } catch (error) {
      console.error('Failed to play notification sound:', error);
    }
  }

  toggle() {
    this.isEnabled = !this.isEnabled;
    localStorage.setItem('notificationSound', this.isEnabled);
    return this.isEnabled;
  }

  setVolume(volume) {
    if (this.audio) {
      this.audio.volume = Math.max(0, Math.min(1, volume));
    }
  }
}

export const notificationSound = new NotificationSound();