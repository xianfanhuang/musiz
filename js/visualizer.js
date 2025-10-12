class AudioVisualizer {
    constructor(canvas2d, canvas3d, audioContext) {
        this.canvas2d = canvas2d;
        this.canvas3d = canvas3d;
        this.ctx2d = canvas2d.getContext('2d');
        
        // Three.js setup
        this.scene = new THREE.Scene();
        this.camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
        this.renderer = new THREE.WebGLRenderer({ canvas: canvas3d, alpha: true });
        
        this.audioContext = audioContext;
        this.analyser = this.audioContext.createAnalyser();
        this.setupAnalyser();
        
        this.mode = 'aurora';
        this.settings = {
            sensitivity: 0.75,
            smoothing: 0.85
        };
        
        this.initializeVisuals();
        this.setupEventListeners();
    }

    setupAnalyser() {
        this.analyser.fftSize = 2048; // Increased for better frequency resolution
        this.analyser.smoothingTimeConstant = this.settings.smoothing;
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.waveformArray = new Uint8Array(this.analyser.frequencyBinCount);
    }

    initializeVisuals() {
        // Initialize 2D visualizations
        this.particles = this.createParticles();
        this.waves = this.createWaves();
        
        // Initialize 3D visualizations
        this.init3DGeometry();
        
        this.resizeCanvases();
    }

    init3DGeometry() {
        // Setup 3D geometries based on mode
        switch(this.mode) {
            case 'cosmic':
                this.setupCosmicGeometry();
                break;
            case 'neural':
                this.setupNeuralGeometry();
                break;
            // Add other modes...
        }
    }

    animate() {
        this.analyser.getByteFrequencyData(this.dataArray);
        this.analyser.getByteTimeDomainData(this.waveformArray);

        const audioData = this.processAudioData();
        
        // Update visualizations based on mode
        switch(this.mode) {
            case 'aurora':
                this.renderAurora(audioData);
                break;
            case 'cosmic':
                this.renderCosmic(audioData);
                break;
            case 'neural':
                this.renderNeural(audioData);
                break;
            case 'liquid':
                this.renderLiquid(audioData);
                break;
            case 'quantum':
                this.renderQuantum(audioData);
                break;
        }

        requestAnimationFrame(() => this.animate());
    }

    processAudioData() {
        const bass = this.getFrequencyRangeValue(20, 140);
        const mid = this.getFrequencyRangeValue(140, 2000);
        const treble = this.getFrequencyRangeValue(2000, 16000);
        const volume = this.getAverageVolume();
        
        return { bass, mid, treble, volume };
    }

    // Visualization mode renderers
    renderAurora({ bass, mid, treble, volume }) {
        // Aurora-specific rendering logic
    }

    renderCosmic({ bass, mid, treble, volume }) {
        // Cosmic-specific rendering logic
    }

    // ... other rendering methods for each mode

    // Utility methods
    getFrequencyRangeValue(startFreq, endFreq) {
        // Convert frequencies to FFT bins and calculate average magnitude
    }

    getAverageVolume() {
        return this.dataArray.reduce((acc, val) => acc + val, 0) / this.dataArray.length;
    }

    // Event handlers
    setMode(mode) {
        this.mode = mode;
        this.init3DGeometry();
    }

    updateSettings({ sensitivity, smoothing }) {
        this.settings.sensitivity = sensitivity;
        this.settings.smoothing = smoothing;
        this.analyser.smoothingTimeConstant = smoothing;
    }

    resizeCanvases() {
        // Handle canvas resizing
    }

    connectAudio(source) {
        // Connect audio source to analyser
    }
}