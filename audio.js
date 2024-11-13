class AudioPlayer {
    constructor() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playButton = document.getElementById('playButton');
        this.stopButton = document.getElementById('stopButton');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        
        this.playlist = [
            'assets/music/lo-fi1.mp3',
            'assets/music/lo-fi2.mp3',
            // Add all your .mp3 files here
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;
        
        this.initializePlayer();
        this.setupEventListeners();
    }

    initializePlayer() {
        this.audioPlayer.src = this.playlist[this.currentTrack];
        this.audioPlayer.load();
        this.play(); // Auto-play first track
    }

    setupEventListeners() {
        this.playButton.addEventListener('click', () => this.togglePlay());
        this.stopButton.addEventListener('click', () => this.stop());
        this.prevButton.addEventListener('click', () => this.playPrevious());
        this.nextButton.addEventListener('click', () => this.playNext());
        
        // Handle track ending
        this.audioPlayer.addEventListener('ended', () => this.playNext());
        
        // Update play button image based on state
        this.audioPlayer.addEventListener('play', () => {
            this.playButton.querySelector('img').src = 'assets/images/audio-controls/stop.png';
        });
        
        this.audioPlayer.addEventListener('stop', () => {
            this.playButton.querySelector('img').src = 'assets/images/audio-controls/play.png';
        });
    }

    togglePlay() {
        if (this.audioPlayer.stopped) {
            this.play();
        } else {
            this.syop();
        }
    }

    play() {
        this.audioPlayer.play();
        this.isPlaying = true;
    }

    pause() {
        this.audioPlayer.pause();
        this.isPlaying = false;
    }

    stop() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
        this.isPlaying = false;
    }

    playNext() {
        this.currentTrack = (this.currentTrack + 1) % this.playlist.length;
        this.audioPlayer.src = this.playlist[this.currentTrack];
        this.play();
    }

    playPrevious() {
        this.currentTrack = (this.currentTrack - 1 + this.playlist.length) % this.playlist.length;
        this.audioPlayer.src = this.playlist[this.currentTrack];
        this.play();
    }
}

// Initialize player when document is loaded
document.addEventListener('DOMContentLoaded', () => {
    const player = new AudioPlayer();
});
