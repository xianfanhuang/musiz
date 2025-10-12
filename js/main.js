class SonoriaApp {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.visualizer = new AudioVisualizer(
            document.getElementById('visualizer-2d'),
            document.getElementById('visualizer-3d'),
            this.audioContext
        );
        this.audioProcessor = new AudioProcessor(this.audioContext);
        this.ui = new UIController();
        
        this.state = {
            isPlaying: false,
            currentTrack: null,
            playlist: [],
            settings: this.loadSettings()
        };
        
        this.initialize();
    }

    async initialize() {
        await this.loadLastSession();
        this.setupEventListeners();
        this.visualizer.start();
    }

    loadSettings() {
        // Load user settings from localStorage
        return {
            volume: 0.75,
            theme: 'aurora',
            equalizer: [0, 0, 0, 0, 0, 0],
            sensitivity: 0.75,
            smoothing: 0.85
        };
    }

    setupEventListeners() {
        // Global event handling
        window.addEventListener('resize', () => this.visualizer.resizeCanvases());
        
        // Handle media session
        if ('mediaSession' in navigator) {
            this.setupMediaSession();
        }
    }

    setupMediaSession() {
        navigator.mediaSession.setActionHandler('play', () => this.play());
        navigator.mediaSession.setActionHandler('pause', () => this.pause());
        navigator.mediaSession.setActionHandler('previoustrack', () => this.previousTrack());
        navigator.mediaSession.setActionHandler('nexttrack', () => this.nextTrack());
    }

    async loadTrack(file) {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);
            
            const source = this.audioContext.createBufferSource();
            source.buffer = audioBuffer;
            
            // Connect audio processing chain
            source.connect(this.audioProcessor.connectSource(source));
            source.connect(this.visualizer.analyser);
            
            return source;
        } catch (error) {
            this.ui.showNotification('无法加载音频文件', 'error');
            throw error;
        }
    }

    // Playback control methods
    play() {
        if (!this.state.currentTrack) return;
        
        this.state.currentTrack.start();
        this.state.isPlaying = true;
        this.ui.updatePlaybackState(true);
    }

    pause() {
        if (!this.state.currentTrack) return;
        
        this.state.currentTrack.stop();
        this.state.isPlaying = false;
        this.ui.updatePlaybackState(false);
    }

    // Settings and state management
    updateSettings(newSettings) {
        this.state.settings = { ...this.state.settings, ...newSettings };
        this.visualizer.updateSettings(this.state.settings);
        this.saveSettings();
    }

    saveSettings() {
        localStorage.setItem('sonoria-settings', JSON.stringify(this.state.settings));
    }
}

// Initialize application
document.addEventListener('DOMContentLoaded', () => {
    const app = new SonoriaApp();
    window.sonoriaApp = app; // For debugging purposes
});