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
            'assets/music/lo-fi1.mp3',
			'assets/music/lo-fi2.mp3'
            // 'assets/music/lo-fi3.mp3',
        ];
        
        this.currentTrack = 0;
        this.isPlaying = false;
    }

    setupEventListeners() {
        this.playButton.addEventListener('click', () => this.togglePlay());
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
        this.audioPlayer.src = this.playlist[this.currentTrack];
        this.audioPlayer.load();
        
        // Add event listener for when the track is loaded
        this.audioPlayer.addEventListener('loadeddata', () => {
            console.log('Track loaded and ready to play');
        });
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
