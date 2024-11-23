class AudioPlayer {
	constructor() {
        if (!this.checkElements()) {
            console.error('Some audio player elements are missing');
            return;
        }
        this.initializeElements();
        this.setupEventListeners();
        this.loadFirstTrack();
		this.tryAutoplay();
    }

    checkElements() {
        const elements = {
            audioPlayer: document.getElementById('audioPlayer'),
            playButton: document.getElementById('playButton'),
            prevButton: document.getElementById('prevButton'),
            nextButton: document.getElementById('nextButton')
        };

        return Object.values(elements).every(element => element !== null);
    }

    initializeElements() {
        this.audioPlayer = document.getElementById('audioPlayer');
        this.playButton = document.getElementById('playButton');
        this.prevButton = document.getElementById('prevButton');
        this.nextButton = document.getElementById('nextButton');
        
        this.playlist = [
            './assets/music/lo-fi1.mp3',
			'./assets/music/lo-fi2.mp3'
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;

        console.log('Audio player initialized with source:', this.playlist[0]);
    }

    setupEventListeners() {
        this.playButton.addEventListener('click', () => {
            console.log('Play button clicked');
            this.togglePlay();
        });
        
        this.prevButton.addEventListener('click', () => this.playPrevious());
        this.nextButton.addEventListener('click', () => this.playNext());
        
        this.audioPlayer.addEventListener('ended', () => this.playNext());
        
        this.audioPlayer.addEventListener('play', () => {
            console.log('Play event triggered');
            this.playButton.querySelector('img').src = 'assets/images/audio-controls/stop.png';
            this.isPlaying = true;
        });
        
        this.audioPlayer.addEventListener('pause', () => {
            console.log('Pause event triggered');
            this.playButton.querySelector('img').src = 'assets/images/audio-controls/play.png';
            this.isPlaying = false;
        });

        this.audioPlayer.addEventListener('error', (e) => {
            console.error('Audio error:', e);
            console.error('Error code:', this.audioPlayer.error.code);
            console.error('Error message:', this.audioPlayer.error.message);
        });
    }

	async tryAutoplay() {
        try {
            // First try playing muted
            this.audioPlayer.muted = true;
            await this.audioPlayer.play();
            
            // If successful, unmute and continue playing
            this.audioPlayer.muted = false;
            
            console.log('Autoplay successful');
        } catch (error) {
            console.log('Autoplay prevented. Click play to start music.');
            // Reset muted state if autoplay fails
            this.audioPlayer.muted = false;
        }
    }

    loadFirstTrack() {
        console.log('Loading first track...');
        this.audioPlayer.src = this.playlist[this.currentTrack];
        this.audioPlayer.load();
        
        this.audioPlayer.addEventListener('loadeddata', () => {
            console.log('Track loaded and ready');
        });
    }

    togglePlay() {
        console.log('Toggle play called. Current paused state:', this.audioPlayer.paused);
        if (this.audioPlayer.paused) {
            this.play();
        } else {
            this.pause();
        }
    }

    play() {
        console.log('Attempting to play...');
        const playPromise = this.audioPlayer.play();
        
        if (playPromise !== undefined) {
            playPromise
                .then(() => {
                    console.log('Playback started successfully');
                })
                .catch(error => {
                    console.error('Playback failed:', error);
                });
        }
    }

    pause() {
        console.log('Pausing playback');
        this.audioPlayer.pause();
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
    console.log('DOM loaded, initializing audio player');
    const player = new AudioPlayer();
});
