// 国际化文本
const i18n = {
    'zh-CN': {
        title: 'Sonoria',
        slogan: '沉浸式音乐可视化体验',
        waiting: '等待音乐输入',
        instruction: '上传文件或使用麦克风开始旅程',
        welcome: '欢迎使用 Sonoria - 开启您的音乐可视化之旅',
        playing: '正在播放',
        microphone: '麦克风输入',
        playlist: '播放列表',
        themes: '可视化主题',
        upload: '上传音乐',
        shuffle: '随机播放',
        loop: '循环播放',
        clear: '清空列表',
        performance: '性能模式',
        share: '分享',
        previous: '上一首',
        next: '下一首',
        play: '播放',
        pause: '暂停',
        close: '关闭',
        aurora: '极光',
        cosmic: '宇宙',
        neural: '神经',
        liquid: '液态',
        quantum: '量子',
        fractal: '分形',
        orbital: '轨道',
        crystal: '水晶',
        settings: '高级设置'
    },
    'en-US': {
        title: 'Sonoria',
        slogan: 'Immersive Music Visualization',
        waiting: 'Waiting for audio input',
        instruction: 'Upload files or use microphone to begin',
        welcome: 'Welcome to Sonoria - Start your music visualization journey',
        playing: 'Playing',
        microphone: 'Microphone',
        playlist: 'Playlist',
        themes: 'Visual Themes',
        upload: 'Upload Music',
        shuffle: 'Shuffle',
        loop: 'Loop',
        clear: 'Clear All',
        performance: 'Performance Mode',
        share: 'Share',
        previous: 'Previous',
        next: 'Next',
        play: 'Play',
        pause: 'Pause',
        close: 'Close',
        aurora: 'Aurora',
        cosmic: 'Cosmic',
        neural: 'Neural',
        liquid: 'Liquid',
        quantum: 'Quantum',
        fractal: 'Fractal',
        orbital: 'Orbital',
        crystal: 'Crystal',
        settings: 'Advanced Settings'
    }
};

// 高级音频可视化引擎
class PremiumAudioVisualizer {
    constructor(canvas2d, container3d, audioContext) {
        this.canvas2d = canvas2d;
        this.ctx2d = canvas2d.getContext('2d');
        this.container3d = container3d;
        this.audioContext = audioContext;

        // 高级音频分析设置
        this.analyser = this.audioContext.createAnalyser();
        this.analyser.fftSize = 4096; // 更高精度的频域分析
        this.analyser.smoothingTimeConstant = 0.7; // 更平滑的过渡
        this.dataArray = new Uint8Array(this.analyser.frequencyBinCount);
        this.bufferLength = this.analyser.frequencyBinCount;

        // 可视化参数
        this.mode = 'aurora';
        this.isPlaying = false;
        this.use3D = this.detectWebGLSupport();
        this.performanceMode = this.shouldEnablePerformanceMode();
        this.hue = 0;
        this.saturation = 85;
        this.brightness = 70;
        this.intensity = 75;
        this.particleCount = 150;

        // 高级音频分析
        this.beatHistory = [];
        this.lastBeatTime = 0;
        this.bpm = 120;
        this.beatIntervals = [];
        this.energyHistory = [];
        this.HISTORY_SIZE = 60;
        this.BEAT_THRESHOLD = 1.25;
        this.BPM_HISTORY = 15;

        // 可视化元素
        this.particles = [];
        this.waves = [];
        this.fractals = [];

        // 3D 场景
        this.scene3d = null;
        this.camera3d = null;
        this.renderer3d = null;
        this.mesh3d = null;
        this.particleSystem3d = null;

        // 性能优化
        this.animationId = null;
        this.lastUpdateTime = 0;
        this.updateInterval = this.performanceMode ? 1000 / 30 : 1000 / 60;

        // 初始化
        this.resizeCanvas();
        this.init3D();
        this.initParticles();
        this.initWaves();
        this.initFractals();

        window.addEventListener('resize', this.resizeCanvas.bind(this));
    }

    detectWebGLSupport() {
        try {
            const canvas = document.createElement('canvas');
            return !!(window.WebGLRenderingContext &&
                (canvas.getContext('webgl') || canvas.getContext('experimental-webgl')));
        } catch (e) {
            return false;
        }
    }

    shouldEnablePerformanceMode() {
        return navigator.hardwareConcurrency < 6 ||
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    resizeCanvas() {
        this.canvas2d.width = window.innerWidth;
        this.canvas2d.height = window.innerHeight;

        if (this.renderer3d) {
            this.camera3d.aspect = window.innerWidth / window.innerHeight;
            this.camera3d.updateProjectionMatrix();
            this.renderer3d.setSize(window.innerWidth, window.innerHeight);
        }
    }

    init3D() {
        if (!this.use3D) return;

        try {
            // 创建高级 3D 场景
            this.scene3d = new THREE.Scene();
            this.scene3d.background = null;

            // 透视相机
            this.camera3d = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            this.camera3d.position.z = 8;
            this.camera3d.position.y = 2;

            // 高级渲染器
            this.renderer3d = new THREE.WebGLRenderer({
                antialias: !this.performanceMode,
                alpha: true,
                powerPreference: "high-performance"
            });
            this.renderer3d.setSize(window.innerWidth, window.innerHeight);
            this.renderer3d.setClearColor(0x000000, 0);
            this.renderer3d.shadowMap.enabled = true;
            this.renderer3d.shadowMap.type = THREE.PCFSoftShadowMap;
            this.container3d.appendChild(this.renderer3d.domElement);

            // 环境光
            const ambientLight = new THREE.AmbientLight(0x404040, 0.6);
            this.scene3d.add(ambientLight);

            // 定向光
            const directionalLight = new THREE.DirectionalLight(0xffffff, 1);
            directionalLight.position.set(5, 5, 5);
            directionalLight.castShadow = true;
            this.scene3d.add(directionalLight);

            // 点光源
            const pointLight = new THREE.PointLight(0x667eea, 1, 100);
            pointLight.position.set(0, 0, 10);
            this.scene3d.add(pointLight);

            // 创建主几何体
            this.createMainGeometry();
            this.createParticleSystem();

        } catch (error) {
            console.warn('3D initialization failed, falling back to 2D:', error);
            this.use3D = false;
        }
    }

    createMainGeometry() {
        // 复杂几何体组合
        const geometry1 = new THREE.IcosahedronGeometry(2, 2);
        const geometry2 = new THREE.TorusKnotGeometry(1.5, 0.4, 100, 16);

        const material1 = new THREE.MeshPhongMaterial({
            color: 0x667eea,
            shininess: 100,
            transparent: true,
            opacity: 0.8,
            wireframe: false
        });

        const material2 = new THREE.MeshPhongMaterial({
            color: 0xf093fb,
            shininess: 80,
            transparent: true,
            opacity: 0.6,
            wireframe: true
        });

        this.mesh1 = new THREE.Mesh(geometry1, material1);
        this.mesh2 = new THREE.Mesh(geometry2, material2);

        this.scene3d.add(this.mesh1);
        this.scene3d.add(this.mesh2);
    }

    createParticleSystem() {
        const particleCount = this.performanceMode ? 500 : 2000;
        const particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            positions[i3] = (Math.random() - 0.5) * 20;
            positions[i3 + 1] = (Math.random() - 0.5) * 20;
            positions[i3 + 2] = (Math.random() - 0.5) * 20;

            colors[i3] = Math.random();
            colors[i3 + 1] = Math.random();
            colors[i3 + 2] = Math.random();
        }

        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const particleMaterial = new THREE.PointsMaterial({
            size: 0.1,
            vertexColors: true,
            transparent: true,
            opacity: 0.8
        });

        this.particleSystem = new THREE.Points(particles, particleMaterial);
        this.scene3d.add(this.particleSystem);
    }

    connectAudio(source) {
        const audioSource = typeof source === 'string' ? new Audio(source) : source;
        const mediaSource = this.audioContext.createMediaElementSource(audioSource);
        mediaSource.connect(this.analyser);
        this.analyser.connect(this.audioContext.destination);
    }

    connectStream(stream) {
        const streamSource = this.audioContext.createMediaStreamSource(stream);
        streamSource.connect(this.analyser);
    }

    setMode(mode) {
        this.mode = mode;
        this.initParticles();
        this.initWaves();
        this.initFractals();
    }

    setVisualParams({ saturation, brightness, intensity, particleCount }) {
        this.saturation = saturation || this.saturation;
        this.brightness = brightness || this.brightness;
        this.intensity = intensity || this.intensity;
        this.particleCount = particleCount || this.particleCount;

        if (particleCount && particleCount !== this.particles.length) {
            this.initParticles();
        }
    }

    setPerformanceMode(enabled) {
        this.performanceMode = enabled;
        this.updateInterval = enabled ? 1000 / 30 : 1000 / 60;
    }

    toggle3D(enabled) {
        if (enabled && !this.use3D) {
            this.use3D = this.detectWebGLSupport();
            if (this.use3D) this.init3D();
        }
        this.use3D = enabled && this.use3D;

        const viz2d = document.getElementById('visualizer-2d');
        const viz3d = document.getElementById('visualizer-3d');

        if (this.use3D) {
            viz2d.classList.add('fade-out');
            viz3d.classList.add('active');
        } else {
            viz2d.classList.remove('fade-out');
            viz3d.classList.remove('active');
        }
    }

    initParticles() {
        this.particles = [];
        const count = this.performanceMode ? Math.min(this.particleCount, 100) : this.particleCount;

        for (let i = 0; i < count; i++) {
            this.particles.push({
                x: Math.random() * this.canvas2d.width,
                y: Math.random() * this.canvas2d.height,
                vx: (Math.random() - 0.5) * 3,
                vy: (Math.random() - 0.5) * 3,
                size: Math.random() * 4 + 1,
                opacity: Math.random() * 0.6 + 0.3,
                baseSize: Math.random() * 4 + 1,
                hue: Math.random() * 360,
                life: 1,
                decay: 0.002 + Math.random() * 0.003
            });
        }
    }

    initWaves() {
        this.waves = [];
        const waveCount = this.performanceMode ? 3 : 6;

        for (let i = 0; i < waveCount; i++) {
            this.waves.push({
                amplitude: 0,
                frequency: 0.008 + i * 0.006,
                phase: 0,
                y: this.canvas2d.height / 2 + (i - waveCount/2) * 60,
                speed: 0.02 + i * 0.01,
                hueOffset: i * 40
            });
        }
    }

    initFractals() {
        this.fractals = [];
        const fractalCount = this.performanceMode ? 2 : 4;

        for (let i = 0; i < fractalCount; i++) {
            this.fractals.push({
                x: this.canvas2d.width / 2,
                y: this.canvas2d.height / 2,
                scale: 0.5 + i * 0.3,
                rotation: i * Math.PI / fractalCount,
                hue: i * 90
            });
        }
    }

    // 高级节拍检测算法
    detectBeat(energy) {
        this.beatHistory.push(energy);
        this.energyHistory.push(energy);

        if (this.beatHistory.length > this.HISTORY_SIZE) this.beatHistory.shift();
        if (this.energyHistory.length > this.HISTORY_SIZE * 2) this.energyHistory.shift();

        if (this.beatHistory.length === this.HISTORY_SIZE) {
            const avg = this.beatHistory.reduce((a, b) => a + b) / this.HISTORY_SIZE;
            const variance = this.beatHistory.reduce((a, b) => a + Math.pow(b - avg, 2), 0) / this.HISTORY_SIZE;
            const threshold = -variance * 0.0015 + this.BEAT_THRESHOLD;

            if (energy > avg * threshold && performance.now() - this.lastBeatTime > 200) {
                this.lastBeatTime = performance.now();
                this.beatIntervals.push(this.lastBeatTime);

                if (this.beatIntervals.length > this.BPM_HISTORY + 1) this.beatIntervals.shift();
                if (this.beatIntervals.length > 1) {
                    const intervals = [];
                    for (let i = 1; i < this.beatIntervals.length; i++) {
                        intervals.push(this.beatIntervals[i] - this.beatIntervals[i - 1]);
                    }
                    const avgInterval = intervals.reduce((a, b) => a + b) / intervals.length;
                    this.bpm = 60000 / avgInterval;
                }
                return true;
            }
        }
        return false;
    }

    getEmotionHue(bpm, energy) {
        const arousal = Math.min(1, bpm / 180);
        const valence = Math.min(1, energy / 255);
        const energyAvg = this.energyHistory.length > 0 ?
            this.energyHistory.reduce((a, b) => a + b) / this.energyHistory.length : 0.5;

        return (arousal * 120 + valence * 60 + energyAvg * 180) % 360;
    }

    update3DVisualization(bass, mid, treble, energy, isBeat) {
        if (!this.use3D || !this.mesh1) return;

        const time = performance.now() * 0.001;
        const intensity = this.intensity / 100;

        // 更新主几何体
        const scale1 = 1 + (bass / 150) * intensity;
        const scale2 = 1 + (treble / 200) * intensity;

        this.mesh1.scale.set(scale1, scale1, scale1);
        this.mesh2.scale.set(scale2, scale2, scale2);

        this.mesh1.rotation.x += (mid / 800) * intensity;
        this.mesh1.rotation.y += (bass / 600) * intensity;
        this.mesh2.rotation.x += (treble / 1000) * intensity;
        this.mesh2.rotation.z += (energy / 500) * intensity;

        if (isBeat) {
            this.mesh1.scale.multiplyScalar(1.2);
            this.mesh2.scale.multiplyScalar(1.3);
        }

        // 更新粒子系统
        if (this.particleSystem) {
            const positions = this.particleSystem.geometry.attributes.position.array;
            for (let i = 0; i < positions.length; i += 3) {
                positions[i] += (Math.random() - 0.5) * 0.1 * intensity;
                positions[i + 1] += (Math.random() - 0.5) * 0.1 * intensity;
                positions[i + 2] += (Math.random() - 0.5) * 0.1 * intensity;
            }
            this.particleSystem.geometry.attributes.position.needsUpdate = true;
        }

        // 更新颜色
        const hue = this.hue / 360;
        const color1 = new THREE.Color().setHSL(hue, this.saturation / 100, this.brightness / 100);
        const color2 = new THREE.Color().setHSL((hue + 0.3) % 1, this.saturation / 100, this.brightness / 100);

        this.mesh1.material.color = color1;
        this.mesh2.material.color = color2;

        this.renderer3d.render(this.scene3d, this.camera3d);
    }

    update2DVisualization(bass, mid, treble, energy, isBeat) {
        const centerX = this.canvas2d.width / 2;
        const centerY = this.canvas2d.height / 2;
        const intensity = this.intensity / 100;

        // 高级渐变背景
        const gradient = this.ctx2d.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, Math.max(this.canvas2d.width, this.canvas2d.height) / 2
        );

        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness * 0.3}%, 0.9)`);
        gradient.addColorStop(0.5, `hsla(${(this.hue + 60) % 360}, ${this.saturation * 0.7}%, ${this.brightness * 0.2}%, 0.6)`);
        gradient.addColorStop(1, `hsla(${(this.hue + 120) % 360}, ${this.saturation * 0.4}%, ${this.brightness * 0.1}%, 0.3)`);

        this.ctx2d.fillStyle = gradient;
        this.ctx2d.fillRect(0, 0, this.canvas2d.width, this.canvas2d.height);

        // 中心能量核心
        const coreSize = 40 + (bass / 2 + energy / 3) * intensity;
        const coreGradient = this.ctx2d.createRadialGradient(
            centerX, centerY, 0,
            centerX, centerY, coreSize * 2
        );

        coreGradient.addColorStop(0, `hsla(${this.hue}, 100%, 70%, ${0.8 * intensity})`);
        coreGradient.addColorStop(1, `hsla(${this.hue}, 100%, 50%, 0)`);

        this.ctx2d.fillStyle = coreGradient;
        this.ctx2d.beginPath();
        this.ctx2d.arc(centerX, centerY, coreSize * 2, 0, Math.PI * 2);
        this.ctx2d.fill();

        // 脉冲效果
        if (isBeat) {
            const pulseGradient = this.ctx2d.createRadialGradient(
                centerX, centerY, 0,
                centerX, centerY, coreSize * 4
            );

            pulseGradient.addColorStop(0, `hsla(${(this.hue + 180) % 360}, 100%, 60%, 0.6)`);
            pulseGradient.addColorStop(1, `hsla(${(this.hue + 180) % 360}, 100%, 40%, 0)`);

            this.ctx2d.fillStyle = pulseGradient;
            this.ctx2d.beginPath();
            this.ctx2d.arc(centerX, centerY, coreSize * 4, 0, Math.PI * 2);
            this.ctx2d.fill();
        }

        // 根据模式渲染不同的可视化效果
        switch (this.mode) {
            case 'fractal':
                this.renderFractalPattern(centerX, centerY, bass, mid, treble, intensity);
                break;
            case 'orbital':
                this.renderOrbitalPattern(centerX, centerY, bass, mid, treble, intensity);
                break;
            case 'crystal':
                this.renderCrystalPattern(centerX, centerY, bass, mid, treble, intensity);
                break;
            default:
                this.renderAdvancedPattern(centerX, centerY, bass, mid, treble, energy, isBeat, intensity);
        }

        this.hue = (this.hue + treble / 8 + mid / 16) % 360;
    }

    renderAdvancedPattern(centerX, centerY, bass, mid, treble, energy, isBeat, intensity) {
        // 高级波形系统
        this.waves.forEach((wave, i) => {
            wave.amplitude += ((mid / 1.2 + 40 + (isBeat ? 80 : 0)) * intensity - wave.amplitude) * 0.08;
            wave.phase += wave.speed + treble / 4000;

            this.ctx2d.beginPath();
            this.ctx2d.strokeStyle = `hsla(${this.hue + wave.hueOffset}, ${this.saturation}%, ${this.brightness}%, ${0.8 * intensity})`;
            this.ctx2d.lineWidth = 4;
            this.ctx2d.lineJoin = 'round';
            this.ctx2d.lineCap = 'round';

            for (let x = 0; x < this.canvas2d.width; x += 6) {
                const distortion = Math.sin(x * 0.01 + wave.phase) * 20 * intensity;
                const y = wave.y + Math.sin(x * wave.frequency + wave.phase) * wave.amplitude + distortion;
                this.ctx2d.lineTo(x, y);
            }
            this.ctx2d.stroke();
        });

        // 高级粒子系统
        this.particles.forEach(p => {
            // 粒子生命周期
            p.life -= p.decay;
            if (p.life <= 0) {
                p.x = Math.random() * this.canvas2d.width;
                p.y = Math.random() * this.canvas2d.height;
                p.life = 1;
            }

            const dx = centerX - p.x;
            const dy = centerY - p.y;
            const dist = Math.sqrt(dx * dx + dy * dy);

            // 物理模拟
            if (dist > 0) {
                const force = (bass / 400) * intensity;
                p.vx += (dx / dist) * force;
                p.vy += (dy / dist) * force;
            }

            // 随机运动
            p.vx += (Math.random() - 0.5) * (treble / 200) * intensity;
            p.vy += (Math.random() - 0.5) * (treble / 200) * intensity;

            // 节拍影响
            if (isBeat) {
                p.vx *= 1.5;
                p.vy *= 1.5;
            }

            // 阻尼
            p.vx *= 0.92;
            p.vy *= 0.92;

            // 位置更新
            p.x += p.vx;
            p.y += p.vy;

            // 边界处理
            if (p.x < 0 || p.x > this.canvas2d.width) p.vx *= -0.8;
            if (p.y < 0 || p.y > this.canvas2d.height) p.vy *= -0.8;

            // 大小和颜色
            p.size = p.baseSize + (bass / 50 + treble / 100) * intensity;

            // 渲染粒子
            this.ctx2d.beginPath();
            this.ctx2d.arc(p.x, p.y, p.size, 0, Math.PI * 2);
            this.ctx2d.fillStyle = `hsla(${p.hue + this.hue / 2}, ${this.saturation}%, ${this.brightness}%, ${p.opacity * p.life * intensity})`;
            this.ctx2d.fill();

            // 粒子光晕
            if (p.size > 3) {
                const glowGradient = this.ctx2d.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.size * 2);
                glowGradient.addColorStop(0, `hsla(${p.hue + this.hue / 2}, ${this.saturation}%, ${this.brightness}%, ${0.3 * p.life * intensity})`);
                glowGradient.addColorStop(1, `hsla(${p.hue + this.hue / 2}, ${this.saturation}%, ${this.brightness}%, 0)`);

                this.ctx2d.fillStyle = glowGradient;
                this.ctx2d.beginPath();
                this.ctx2d.arc(p.x, p.y, p.size * 2, 0, Math.PI * 2);
                this.ctx2d.fill();
            }
        });
    }

    renderFractalPattern(centerX, centerY, bass, mid, treble, intensity) {
        const time = performance.now() * 0.001;
        const maxIterations = this.performanceMode ? 3 : 6;
        const scale = 0.8 + (bass / 200) * intensity;

        for (let i = 0; i < maxIterations; i++) {
            const angle = time * 0.5 + (i * Math.PI * 2) / maxIterations;
            const radius = 60 + (bass / 1.5 + i * 40) * intensity;
            const branches = 5 + Math.floor(mid / 35);

            for (let j = 0; j < branches; j++) {
                const branchAngle = angle + (j * Math.PI * 2) / branches;
                const x = centerX + Math.cos(branchAngle) * radius * scale;
                const y = centerY + Math.sin(branchAngle) * radius * scale;

                const size = 4 + (treble / 80) * intensity;

                this.ctx2d.beginPath();
                this.ctx2d.arc(x, y, size, 0, Math.PI * 2);

                const gradient = this.ctx2d.createRadialGradient(x, y, 0, x, y, size * 2);
                gradient.addColorStop(0, `hsla(${this.hue + i * 60 + j * 30}, ${this.saturation}%, ${this.brightness}%, 0.9)`);
                gradient.addColorStop(1, `hsla(${this.hue + i * 60 + j * 30}, ${this.saturation}%, ${this.brightness}%, 0)`);

                this.ctx2d.fillStyle = gradient;
                this.ctx2d.fill();
            }
        }
    }

    renderOrbitalPattern(centerX, centerY, bass, mid, treble, intensity) {
        const time = performance.now() * 0.001;
        const orbits = this.performanceMode ? 3 : 7;

        for (let i = 0; i < orbits; i++) {
            const radius = 50 + i * 45 + (bass / 2) * intensity;
            const speed = 0.1 + i * 0.08 + (treble / 1500) * intensity;
            const angle = time * speed;
            const particles = 10 + Math.floor(mid / 25);

            for (let j = 0; j < particles; j++) {
                const particleAngle = angle + (j * Math.PI * 2) / particles;
                const x = centerX + Math.cos(particleAngle) * radius;
                const y = centerY + Math.sin(particleAngle) * radius;

                const size = 3 + (bass / 60) * intensity;

                this.ctx2d.beginPath();
                this.ctx2d.arc(x, y, size, 0, Math.PI * 2);

                const gradient = this.ctx2d.createRadialGradient(x, y, 0, x, y, size * 3);
                gradient.addColorStop(0, `hsla(${this.hue + j * 36}, ${this.saturation}%, ${this.brightness}%, 0.8)`);
                gradient.addColorStop(1, `hsla(${this.hue + j * 36}, ${this.saturation}%, ${this.brightness}%, 0)`);

                this.ctx2d.fillStyle = gradient;
                this.ctx2d.fill();
            }
        }
    }

    renderCrystalPattern(centerX, centerY, bass, mid, treble, intensity) {
        const sides = 6;
        const baseSize = 70 + (bass / 1.2) * intensity;
        const rotation = performance.now() * 0.0003 * treble;
        const pulse = 1 + Math.sin(performance.now() * 0.003) * 0.2;
        const size = baseSize * pulse;

        this.ctx2d.save();
        this.ctx2d.translate(centerX, centerY);
        this.ctx2d.rotate(rotation);

        // 主晶体
        this.ctx2d.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const x = Math.cos(angle) * size;
            const y = Math.sin(angle) * size;

            if (i === 0) {
                this.ctx2d.moveTo(x, y);
            } else {
                this.ctx2d.lineTo(x, y);
            }
        }
        this.ctx2d.closePath();

        const gradient = this.ctx2d.createRadialGradient(0, 0, 0, 0, 0, size);
        gradient.addColorStop(0, `hsla(${this.hue}, ${this.saturation}%, ${this.brightness}%, 0.7)`);
        gradient.addColorStop(0.7, `hsla(${this.hue + 60}, ${this.saturation}%, ${this.brightness * 0.7}%, 0.4)`);
        gradient.addColorStop(1, `hsla(${this.hue + 120}, ${this.saturation}%, ${this.brightness * 0.4}%, 0.1)`);

        this.ctx2d.fillStyle = gradient;
        this.ctx2d.fill();

        // 边框光效
        this.ctx2d.strokeStyle = `hsla(${this.hue}, 90%, 80%, 0.9)`;
        this.ctx2d.lineWidth = 3;
        this.ctx2d.stroke();

        // 内部结构线
        this.ctx2d.beginPath();
        for (let i = 0; i < sides; i++) {
            const angle = (i * 2 * Math.PI) / sides;
            const x = Math.cos(angle) * size * 0.5;
            const y = Math.sin(angle) * size * 0.5;
            this.ctx2d.lineTo(x, y);
        }
        this.ctx2d.closePath();
        this.ctx2d.strokeStyle = `hsla(${this.hue + 180}, 70%, 70%, 0.6)`;
        this.ctx2d.lineWidth = 1;
        this.ctx2d.stroke();

        this.ctx2d.restore();
    }

    animate() {
        this.animationId = requestAnimationFrame(this.animate.bind(this));

        const currentTime = performance.now();
        if (currentTime - this.lastUpdateTime < this.updateInterval) return;
        this.lastUpdateTime = currentTime;

        if (!this.isPlaying) return;

        // 获取音频数据
        this.analyser.getByteFrequencyData(this.dataArray);
        const bass = this.dataArray.slice(0, 60).reduce((a, b) => a + b) / 60;
        const mid = this.dataArray.slice(100, 400).reduce((a, b) => a + b) / 300;
        const treble = this.dataArray.slice(500, 1500).reduce((a, b) => a + b) / 1000;
        const energy = this.dataArray.reduce((a, b) => a + b) / this.dataArray.length;
        const isBeat = this.detectBeat(energy);
        this.hue = this.getEmotionHue(this.bpm, energy);

        // 触发高级视觉反馈
        if (isBeat) {
            document.getElementById('logo-orb').classList.add('pulse');
            setTimeout(() => {
                document.getElementById('logo-orb').classList.remove('pulse');
            }, 400);

            // 触觉反馈（如果支持）
            if (navigator.vibrate) {
                navigator.vibrate(50);
            }
        }

        if (this.use3D) {
            this.update3DVisualization(bass, mid, treble, energy, isBeat);
        } else {
            this.update2DVisualization(bass, mid, treble, energy, isBeat);
        }
    }

    start() {
        this.isPlaying = true;
        this.animate();
    }

    stop() {
        this.isPlaying = false;
        if (this.animationId) {
            cancelAnimationFrame(this.animationId);
            this.animationId = null;
        }
    }

    // 高级截图功能
    getVisualizationAsBlob(callback) {
        const canvas = this.use3D ? this.renderer3d.domElement : this.canvas2d;

        if (this.use3D) {
            this.renderer3d.render(this.scene3d, this.camera3d);
        }

        // 创建高质量截图
        const tempCanvas = document.createElement('canvas');
        tempCanvas.width = canvas.width;
        tempCanvas.height = canvas.height;
        const tempCtx = tempCanvas.getContext('2d');

        // 添加背景
        tempCtx.fillStyle = '#0a0a14';
        tempCtx.fillRect(0, 0, tempCanvas.width, tempCanvas.height);

        // 绘制可视化
        tempCtx.drawImage(canvas, 0, 0);

        // 添加品牌水印
        tempCtx.fillStyle = 'rgba(255, 255, 255, 0.1)';
        tempCtx.font = '24px Inter';
        tempCtx.textAlign = 'right';
        tempCtx.fillText('Sonoria', tempCanvas.width - 30, tempCanvas.height - 30);

        tempCanvas.toBlob(callback, 'image/jpeg', 0.95);
    }
}

// 主应用初始化
document.addEventListener('DOMContentLoaded', () => {
    // 初始化变量
    let currentLanguage = 'zh-CN';
    let audioContext;
    let visualizer;
    let audioElement;
    let isPlaying = false;
    let isMicActive = false;
    let isShuffled = false;
    let isLooping = false;
    let isPerformanceMode = shouldEnablePerformanceMode();
    let playlist = [];
    let currentTrack = 0;
    let inactivityTimer;
    let touchStartX = 0;
    let mediaSessionUpdateInterval;

    function shouldEnablePerformanceMode() {
        return navigator.hardwareConcurrency < 6 ||
               /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    }

    // DOM 元素
    const elements = {
        canvas2d: document.getElementById('visualizer-2d'),
        container3d: document.getElementById('visualizer-3d'),
        mainContainer: document.getElementById('main-container'),
        playerCard: document.getElementById('player-card'),
        uploadArea: document.getElementById('upload-area'),
        audioUpload: document.getElementById('audio-upload'),
        playToggle: document.getElementById('play-toggle'),
        moreButton: document.getElementById('more-button'),
        moreMenu: document.getElementById('more-menu'),
        playlistToggle: document.getElementById('playlist-toggle'),
        uploadButton: document.getElementById('upload-button'),
        micToggle: document.getElementById('mic-toggle'),
        vizToggle: document.getElementById('viz-toggle'),
        shuffleOption: document.getElementById('shuffle-option'),
        loopOption: document.getElementById('loop-option'),
        clearOption: document.getElementById('clear-option'),
        performanceOption: document.getElementById('performance-option'),
        settingsOption: document.getElementById('settings-option'),
        prevButton: document.getElementById('prev-button'),
        nextButton: document.getElementById('next-button'),
        closePlaylist: document.getElementById('close-playlist'),
        progressBar: document.getElementById('progress'),
        currentTimeEl: document.getElementById('current-time'),
        totalTimeEl: document.getElementById('total-time'),
        trackTitle: document.getElementById('track-title'),
        trackArtist: document.getElementById('track-artist'),
        playlistSection: document.getElementById('playlist-section'),
        playlistItems: document.getElementById('playlist-items'),
        swipeHint: document.getElementById('swipe-hint'),
        themeButtons: document.querySelectorAll('.theme-button'),
        status: document.getElementById('status'),
        langToggle: document.getElementById('lang-toggle'),
        shareButton: document.getElementById('share-button'),
        performanceNotice: document.getElementById('performance-notice'),
        appTitle: document.getElementById('app-title'),
        appSlogan: document.getElementById('app-slogan'),
        shuffleText: document.getElementById('shuffle-text'),
        loopText: document.getElementById('loop-text'),
        performanceText: document.getElementById('performance-text'),
        // 新增的控制滑块
        intensitySlider: document.getElementById('intensity-slider'),
        particlesSlider: document.getElementById('particles-slider'),
        saturationSlider: document.getElementById('saturation-slider'),
        brightnessSlider: document.getElementById('brightness-slider'),
        intensityValue: document.getElementById('intensity-value'),
        particlesValue: document.getElementById('particles-value'),
        saturationValue: document.getElementById('saturation-value'),
        brightnessValue: document.getElementById('brightness-value')
    };

    // 更新界面文本
    function updateUIText() {
        const texts = i18n[currentLanguage];
        elements.appTitle.textContent = texts.title;
        elements.appSlogan.textContent = texts.slogan;
        elements.trackTitle.textContent = texts.waiting;
        elements.trackArtist.textContent = texts.instruction;
        elements.status.textContent = texts.welcome;
        elements.shuffleText.textContent = texts.shuffle;
        elements.loopText.textContent = texts.loop;
        elements.performanceText.textContent = texts.performance;

        // 更新按钮提示
        document.querySelectorAll('[aria-label]').forEach(btn => {
            const key = btn.id.replace('-button', '').replace('-option', '').replace('-toggle', '');
            if (texts[key]) {
                btn.setAttribute('aria-label', texts[key]);
                const tooltip = btn.querySelector('.tooltip');
                if (tooltip) tooltip.textContent = texts[key];
            }
        });

        // 更新主题按钮
        elements.themeButtons.forEach(btn => {
            const mode = btn.dataset.mode;
            if (texts[mode]) {
                btn.textContent = texts[mode];
                btn.setAttribute('aria-label', texts[mode] + ' ' + texts.themes);
            }
        });
    }

    // 初始化音频上下文
    function initAudioContext() {
        audioContext = new (window.AudioContext || window.webkitAudioContext)();
        visualizer = new PremiumAudioVisualizer(
            elements.canvas2d,
            elements.container3d,
            audioContext
        );

        if (isPerformanceMode) {
            visualizer.setPerformanceMode(true);
            elements.performanceNotice.style.display = 'block';
        }

        visualizer.start();
    }

    // 设置音频
    function setupAudio(fileOrStream, isMic = false) {
        if (!audioContext) initAudioContext();

        if (isMic) {
            visualizer.connectStream(fileOrStream);
            isPlaying = true;
            updateStatus(i18n[currentLanguage].microphone, 'success');
            elements.playToggle.innerHTML = '<i class="material-icons">pause</i>';
            updateMediaSessionMetadata(i18n[currentLanguage].microphone, 'Sonoria', true);
            return;
        }

        if (audioElement) audioElement.pause();
        audioElement = new Audio(URL.createObjectURL(fileOrStream));
        visualizer.connectAudio(audioElement);

        // 设置音频事件监听
        audioElement.addEventListener('loadedmetadata', function() {
            updateTimeDisplay();
            updateMediaSessionMetadata(
                fileOrStream.name.replace(/\.[^/.]+$/, ""),
                'Sonoria',
                false
            );
        });

        audioElement.addEventListener('timeupdate', function() {
            updateProgress();
            updateTimeDisplay();
        });

        audioElement.addEventListener('ended', function() {
            playNext();
        });

        audioElement.play();
        isPlaying = true;
        elements.playToggle.innerHTML = '<i class="material-icons">pause</i>';
        updateStatus(`${i18n[currentLanguage].playing}: ${fileOrStream.name}`, 'success');
    }

    // 更新进度条
    function updateProgress() {
        if (audioElement && audioElement.duration) {
            const progress = (audioElement.currentTime / audioElement.duration) * 100;
            elements.progressBar.style.width = `${progress}%`;
        }
    }

    // 更新时间显示
    function updateTimeDisplay() {
        if (audioElement) {
            const currentTime = formatTime(audioElement.currentTime);
            const totalTime = formatTime(audioElement.duration || 0);
            elements.currentTimeEl.textContent = currentTime;
            elements.totalTimeEl.textContent = totalTime;
        }
    }

    // 格式化时间
    function formatTime(seconds) {
        const mins = Math.floor(seconds / 60);
        const secs = Math.floor(seconds % 60);
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    }

    // 更新状态
    function updateStatus(message, type = '') {
        elements.status.textContent = message;
        elements.status.className = 'status' + (type ? ` ${type}` : '');

        setTimeout(() => {
            if (elements.status.textContent === message) {
                elements.status.textContent = '';
                elements.status.className = 'status';
            }
        }, 4000);
    }

    // 更新媒体会话元数据
    function updateMediaSessionMetadata(title, artist, isLive) {
        if ('mediaSession' in navigator) {
            if (mediaSessionUpdateInterval) {
                clearInterval(mediaSessionUpdateInterval);
            }

            navigator.mediaSession.metadata = new MediaMetadata({
                title: title,
                artist: artist,
                album: 'Sonoria'
            });

            // 定期更新封面
            mediaSessionUpdateInterval = setInterval(() => {
                if (visualizer) {
                    visualizer.getVisualizationAsBlob(function(blob) {
                        if (blob) {
                            const imageUrl = URL.createObjectURL(blob);
                            navigator.mediaSession.metadata.artwork = [
                                { src: imageUrl, sizes: '512x512', type: 'image/jpeg' }
                            ];
                        }
                    });
                }
            }, 5000);

            // 设置媒体会话操作
            navigator.mediaSession.setActionHandler('play', function() {
                if (audioElement) {
                    audioElement.play();
                    isPlaying = true;
                    elements.playToggle.innerHTML = '<i class="material-icons">pause</i>';
                }
            });

            navigator.mediaSession.setActionHandler('pause', function() {
                if (audioElement) {
                    audioElement.pause();
                    isPlaying = false;
                    elements.playToggle.innerHTML = '<i class="material-icons">play_arrow</i>';
                }
            });

            navigator.mediaSession.setActionHandler('previoustrack', function() {
                playPrevious();
            });

            navigator.mediaSession.setActionHandler('nexttrack', function() {
                playNext();
            });
        }
    }

    // 播放上一首
    function playPrevious() {
        if (playlist.length > 1) {
            currentTrack = (currentTrack - 1 + playlist.length) % playlist.length;
            setupAudio(playlist[currentTrack]);
            updatePlaylistDisplay();
        }
    }

    // 播放下一首
    function playNext() {
        if (playlist.length > 1) {
            if (isShuffled) {
                currentTrack = Math.floor(Math.random() * playlist.length);
            } else {
                currentTrack = (currentTrack + 1) % playlist.length;
            }
            setupAudio(playlist[currentTrack]);
            updatePlaylistDisplay();
        }
    }

    // 更新播放列表显示
    function updatePlaylistDisplay() {
        elements.playlistItems.innerHTML = '';
        playlist.forEach((file, index) => {
            const item = document.createElement('div');
            item.className = `playlist-item ${index === currentTrack ? 'active' : ''}`;
            item.innerHTML = `
                <i class="material-icons playlist-item-icon">music_note</i>
                <div class="playlist-item-info">
                    <div class="playlist-item-title">${file.name.replace(/\.[^/.]+$/, "")}</div>
                    <div class="playlist-item-artist">Sonoria</div>
                </div>
                <div class="playlist-item-duration">--:--</div>
            `;
            item.addEventListener('click', () => {
                currentTrack = index;
                setupAudio(playlist[currentTrack]);
                updatePlaylistDisplay();
            });
            elements.playlistItems.appendChild(item);
        });
    }

    // 切换播放列表显示
    function togglePlaylist() {
        elements.playlistSection.classList.toggle('expanded');
    }

    // 切换语言
    function toggleLanguage() {
        currentLanguage = currentLanguage === 'zh-CN' ? 'en-US' : 'zh-CN';
        document.documentElement.lang = currentLanguage;
        document.documentElement.dir = currentLanguage === 'en-US' ? 'ltr' : 'ltr';
        updateUIText();
    }

    // 分享可视化
    function shareVisualization() {
        if (visualizer) {
            visualizer.getVisualizationAsBlob(function(blob) {
                if (navigator.share && blob) {
                    const file = new File([blob], 'sonoria-visualization.jpg', { type: 'image/jpeg' });
                    navigator.share({
                        files: [file],
                        title: 'Sonoria Visualization',
                        text: 'Check out this amazing music visualization from Sonoria! 🎵✨'
                    });
                } else {
                    // 回退方案：下载图片
                    const url = URL.createObjectURL(blob);
                    const a = document.createElement('a');
                    a.href = url;
                    a.download = 'sonoria-visualization.jpg';
                    a.click();
                    URL.revokeObjectURL(url);
                    updateStatus('可视化已保存为图片', 'success');
                }
            });
        }
    }

    // 更新滑块显示
    function updateSliderValues() {
        elements.intensityValue.textContent = `${elements.intensitySlider.value}%`;
        elements.particlesValue.textContent = elements.particlesSlider.value;
        elements.saturationValue.textContent = `${elements.saturationSlider.value}%`;
        elements.brightnessValue.textContent = `${elements.brightnessSlider.value}%`;

        if (visualizer) {
            visualizer.setVisualParams({
                saturation: parseInt(elements.saturationSlider.value),
                brightness: parseInt(elements.brightnessSlider.value),
                intensity: parseInt(elements.intensitySlider.value),
                particleCount: parseInt(elements.particlesSlider.value)
            });
        }
    }

    // 事件监听器
    function setupEventListeners() {
        // 上传相关
        elements.uploadButton.addEventListener('click', () => elements.audioUpload.click());
        elements.uploadArea.addEventListener('click', () => elements.audioUpload.click());

        elements.audioUpload.addEventListener('change', (e) => {
            const files = e.target.files;
            if (files) {
                // 显示上传进度
                const progressBar = document.getElementById('upload-progress');
                progressBar.style.width = '0%';

                let loaded = 0;
                const total = files.length;

                Array.from(files).forEach((file, index) => {
                    playlist.push(file);
                    loaded++;
                    progressBar.style.width = `${(loaded / total) * 100}%`;

                    if (loaded === total) {
                        setTimeout(() => {
                            progressBar.style.width = '0%';
                        }, 1000);

                        if (playlist.length > 0 && !isPlaying) {
                            currentTrack = 0;
                            setupAudio(playlist[currentTrack]);
                            updatePlaylistDisplay();
                            updateStatus(`已添加 ${total} 个文件到播放列表`, 'success');
                        }
                    }
                });
            }
        });

        // 播放控制
        elements.playToggle.addEventListener('click', () => {
            if (isPlaying) {
                if (audioElement) {
                    audioElement.pause();
                }
                isPlaying = false;
                elements.playToggle.innerHTML = '<i class="material-icons">play_arrow</i>';
                if (mediaSessionUpdateInterval) {
                    clearInterval(mediaSessionUpdateInterval);
                }
            } else {
                if (audioElement) {
                    audioElement.play();
                    isPlaying = true;
                    elements.playToggle.innerHTML = '<i class="material-icons">pause</i>';
                    updateMediaSessionMetadata(
                        playlist[currentTrack]?.name.replace(/\.[^/.]+$/, "") || i18n[currentLanguage].waiting,
                        'Sonoria',
                        false
                    );
                } else if (playlist.length > 0) {
                    setupAudio(playlist[currentTrack]);
                } else {
                    updateStatus('请先上传音乐文件', 'warning');
                }
            }
        });

        // 麦克风控制
        elements.micToggle.addEventListener('click', async () => {
            if (isMicActive) {
                isMicActive = false;
                elements.micToggle.classList.remove('active');
                if (audioElement) {
                    audioElement.play();
                }
                updateStatus('麦克风已关闭', 'success');
                if (mediaSessionUpdateInterval) {
                    clearInterval(mediaSessionUpdateInterval);
                }
            } else {
                try {
                    const stream = await navigator.mediaDevices.getUserMedia({
                        audio: {
                            echoCancellation: true,
                            noiseSuppression: true,
                            autoGainControl: true
                        }
                    });
                    setupAudio(stream, true);
                    isMicActive = true;
                    elements.micToggle.classList.add('active');
                } catch (err) {
                    updateStatus('麦克风访问被拒绝', 'error');
                }
            }
        });

        // 3D 可视化切换
        elements.vizToggle.addEventListener('click', () => {
            const isActive = elements.vizToggle.classList.toggle('active');
            if (visualizer) {
                visualizer.toggle3D(isActive);
                updateStatus(isActive ? '3D 模式已启用' : '3D 模式已关闭', 'success');
            }
        });

        // 更多菜单
        elements.moreButton.addEventListener('click', (e) => {
            e.stopPropagation();
            elements.moreMenu.classList.toggle('show');
        });

        document.addEventListener('click', () => {
            elements.moreMenu.classList.remove('show');
        });

        // 更多菜单选项
        elements.shuffleOption.addEventListener('click', () => {
            isShuffled = !isShuffled;
            elements.shuffleOption.classList.toggle('active', isShuffled);
            updateStatus(isShuffled ? '随机播放已开启' : '随机播放已关闭', 'success');
            elements.moreMenu.classList.remove('show');
        });

        elements.loopOption.addEventListener('click', () => {
            isLooping = !isLooping;
            if (audioElement) {
                audioElement.loop = isLooping;
            }
            elements.loopOption.classList.toggle('active', isLooping);
            updateStatus(isLooping ? '循环播放已开启' : '循环播放已关闭', 'success');
            elements.moreMenu.classList.remove('show');
        });

        elements.clearOption.addEventListener('click', () => {
            playlist = [];
            currentTrack = 0;
            if (audioElement) {
                audioElement.pause();
                isPlaying = false;
                elements.playToggle.innerHTML = '<i class="material-icons">play_arrow</i>';
            }
            updatePlaylistDisplay();
            updateStatus('播放列表已清空', 'success');
            elements.moreMenu.classList.remove('show');
        });

        elements.performanceOption.addEventListener('click', () => {
            isPerformanceMode = !isPerformanceMode;
            if (visualizer) {
                visualizer.setPerformanceMode(isPerformanceMode);
            }
            elements.performanceOption.classList.toggle('active', isPerformanceMode);
            elements.performanceNotice.style.display = isPerformanceMode ? 'block' : 'none';
            updateStatus(isPerformanceMode ? '性能模式已开启' : '性能模式已关闭', 'success');
            elements.moreMenu.classList.remove('show');
        });

        elements.settingsOption.addEventListener('click', () => {
            updateStatus('高级设置面板开发中', 'warning');
            elements.moreMenu.classList.remove('show');
        });

        // 导航控制
        elements.prevButton.addEventListener('click', playPrevious);
        elements.nextButton.addEventListener('click', playNext);

        // 播放列表控制
        elements.playlistToggle.addEventListener('click', togglePlaylist);
        elements.closePlaylist.addEventListener('click', togglePlaylist);

        // 主题切换
        elements.themeButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                if (visualizer) {
                    visualizer.setMode(btn.dataset.mode);
                }
                elements.themeButtons.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                updateStatus(`主题已切换至: ${btn.textContent}`, 'success');
            });
        });

        // 视觉控制滑块
        elements.intensitySlider.addEventListener('input', updateSliderValues);
        elements.particlesSlider.addEventListener('input', updateSliderValues);
        elements.saturationSlider.addEventListener('input', updateSliderValues);
        elements.brightnessSlider.addEventListener('input', updateSliderValues);

        // 手势控制
        document.addEventListener('touchstart', (e) => {
            touchStartX = e.touches[0].clientX;
        });

        document.addEventListener('touchend', (e) => {
            const touchEndX = e.changedTouches[0].clientX;
            const diffX = touchStartX - touchEndX;
            if (Math.abs(diffX) > 50) {
                const themes = Array.from(elements.themeButtons).map(b => b.dataset.mode);
                const currentIndex = themes.indexOf(visualizer ? visualizer.mode : 'aurora');
                let newIndex;
                if (diffX > 0) {
                    newIndex = (currentIndex + 1) % themes.length;
                } else {
                    newIndex = (currentIndex - 1 + themes.length) % themes.length;
                }
                if (visualizer) {
                    visualizer.setMode(themes[newIndex]);
                }
                elements.themeButtons.forEach(b => b.classList.remove('active'));
                elements.themeButtons[newIndex].classList.add('active');
                elements.swipeHint.classList.add('show');
                setTimeout(() => elements.swipeHint.classList.remove('show'), 2000);
            }
        });

        // 非活动状态自动最小化
        document.addEventListener('mousemove', () => {
            clearTimeout(inactivityTimer);
            elements.playerCard.classList.remove('minimized');
            inactivityTimer = setTimeout(() => elements.playerCard.classList.add('minimized'), 5000);
        });

        // 拖放功能
        elements.uploadArea.addEventListener('dragover', (e) => {
            e.preventDefault();
            elements.uploadArea.classList.add('dragover');
        });

        elements.uploadArea.addEventListener('dragleave', () => {
            elements.uploadArea.classList.remove('dragover');
        });

        elements.uploadArea.addEventListener('drop', (e) => {
            e.preventDefault();
            elements.uploadArea.classList.remove('dragover');

            const files = e.dataTransfer.files;
            if (files) {
                let audioFiles = 0;
                Array.from(files).forEach(file => {
                    if (file.type.startsWith('audio/') || file.type.startsWith('video/')) {
                        playlist.push(file);
                        audioFiles++;
                    }
                });
                if (audioFiles > 0) {
                    updateStatus(`通过拖放添加了 ${audioFiles} 个音频文件`, 'success');
                    if (!isPlaying) {
                        currentTrack = 0;
                        setupAudio(playlist[currentTrack]);
                        updatePlaylistDisplay();
                    }
                }
            }
        });

        // 语言切换
        elements.langToggle.addEventListener('click', toggleLanguage);

        // 分享功能
        elements.shareButton.addEventListener('click', shareVisualization);

        // 键盘导航
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT') return;

            switch(e.key) {
                case ' ':
                    e.preventDefault();
                    elements.playToggle.click();
                    break;
                case 'ArrowLeft':
                    e.preventDefault();
                    elements.prevButton.click();
                    break;
                case 'ArrowRight':
                    e.preventDefault();
                    elements.nextButton.click();
                    break;
                case 'ArrowUp':
                    e.preventDefault();
                    // 增加音量或其他操作
                    break;
                case 'ArrowDown':
                    e.preventDefault();
                    // 减少音量或其他操作
                    break;
                case 'Escape':
                    elements.moreMenu.classList.remove('show');
                    elements.playlistSection.classList.remove('expanded');
                    break;
            }
        });
    }

    // 初始化应用
    function initApp() {
        updateUIText();
        setupEventListeners();
        initAudioContext();
        updateSliderValues();
        updateStatus(i18n[currentLanguage].welcome, 'success');

        // 检测设备方向
        if (window.screen.orientation) {
            window.screen.orientation.lock('portrait').catch(() => {});
        }

        // 初始化滑块值
        updateSliderValues();
    }

    // 启动应用
    initApp();
});