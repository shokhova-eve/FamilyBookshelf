class AudioPlayer {
	constructor() {
        this.initializeElements();
        this.setupEventListeners();
        this.loadFirstTrack();
    }

    initializeElements() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playButton = document.getElementById('playButton');
        this.stopButton = document.getElementById('stopButton');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        
        this.playlist = [
            'assets/music/lo-fi1.mp3',
			'assets/music/lo-fi2.mp3'
            // Add other tracks here
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;
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
            this.isPlaying = true;
        });
        
        this.audioPlayer.addEventListener('pause', () => {
            this.playButton.querySelector('img').src = 'assets/images/audio-controls/play.png';
            this.isPlaying = false;
        });
    }

    loadFirstTrack() {
        this.audioPlayer.src = this.playlist[this.currentTrack];
        this.audioPlayer.load();
    }

    togglePlay() {
        if (this.audioPlayer.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        const playPromise = this.audioPlayer.play();
        if (playPromise !== undefined) {
            playPromise.catch(error => {
                console.log("Playback was prevented. Waiting for user interaction.");
            });
        }
    }

    pause() {
        this.audioPlayer.pause();
    }

    stop() {
        this.audioPlayer.pause();
        this.audioPlayer.currentTime = 0;
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
