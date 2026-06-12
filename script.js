/* ============================================
   NEXUS - Three.js Scene Management
   Immersive DeFi Experience
   ============================================ */

class NexusScene {
    constructor() {
        // Scene setup
        this.scene = new THREE.Scene();
        this.scene.background = new THREE.Color(0x0a0e27);
        this.scene.fog = new THREE.Fog(0x0a0e27, 100, 400);

        // Camera setup
        this.camera = new THREE.PerspectiveCamera(
            75,
            window.innerWidth / window.innerHeight,
            0.1,
            2000
        );
        this.camera.position.set(0, 40, 100);

        // Renderer setup
        this.renderer = new THREE.WebGLRenderer({
            canvas: document.getElementById('canvas'),
            antialias: true,
            alpha: true,
            powerPreference: 'high-performance'
        });
        this.renderer.setSize(window.innerWidth, window.innerHeight);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.shadowMap.enabled = true;
        this.renderer.shadowMap.type = THREE.PCFShadowShadowMap;

        // Lighting
        this.setupLighting();

        // World generation
        this.worldObjects = [];
        this.creatures = [];
        this.floatingElements = [];
        this.particleSystems = [];

        this.generateTerrain();
        this.generateMountains();
        this.generateFloatingElements();
        this.generateCreatures();

        // Scroll tracking
        this.scrollProgress = 0;
        this.currentSection = 0;
        this.sections = [];

        // Animation state
        this.time = 0;
        this.animationId = null;

        // Event listeners
        window.addEventListener('resize', () => this.onWindowResize());
        window.addEventListener('scroll', () => this.onScroll());

        // Start animation loop
        this.animate();
    }

    setupLighting() {
        // Ambient light
        const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
        this.scene.add(ambientLight);

        // Main directional light
        const sunLight = new THREE.DirectionalLight(0x00d9ff, 1.2);
        sunLight.position.set(100, 150, 100);
        sunLight.castShadow = true;
        sunLight.shadow.mapSize.width = 2048;
        sunLight.shadow.mapSize.height = 2048;
        sunLight.shadow.camera.left = -200;
        sunLight.shadow.camera.right = 200;
        sunLight.shadow.camera.top = 200;
        sunLight.shadow.camera.bottom = -200;
        this.scene.add(sunLight);

        // Secondary accent light
        const accentLight = new THREE.DirectionalLight(0xff006e, 0.6);
        accentLight.position.set(-100, 100, -100);
        this.scene.add(accentLight);

        // Atmospheric light
        const pointLight = new THREE.PointLight(0x8338ec, 0.8, 300);
        pointLight.position.set(0, 80, 0);
        this.scene.add(pointLight);

        // Far atmospheric glow
        const hemisphereLight = new THREE.HemisphereLight(0x00d9ff, 0x0a0e27, 0.4);
        this.scene.add(hemisphereLight);
    }

    generateTerrain() {
        // Create base ground plane with displacement
        const geometry = new THREE.PlaneGeometry(400, 400, 100, 100);
        
        // Create noise for terrain
        const positions = geometry.attributes.position.array;
        for (let i = 2; i < positions.length; i += 3) {
            positions[i] += Math.sin(positions[i - 2] * 0.05) * Math.cos(positions[i - 1] * 0.05) * 25;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial({
            color: 0x1f2d4d,
            emissive: 0x00d9ff,
            emissiveIntensity: 0.1,
            flatShading: false,
            wireframe: false
        });

        const terrain = new THREE.Mesh(geometry, material);
        terrain.receiveShadow = true;
        terrain.rotation.x = -Math.PI / 2;
        this.scene.add(terrain);

        // Add glowing edges to terrain
        const edgeGeometry = new THREE.EdgesGeometry(geometry);
        const wireframe = new THREE.LineSegments(
            edgeGeometry,
            new THREE.LineBasicMaterial({ color: 0x00d9ff, linewidth: 0.5 })
        );
        wireframe.rotation.x = -Math.PI / 2;
        wireframe.position.z = 0.1;
        this.scene.add(wireframe);

        this.terrain = terrain;
    }

    generateMountains() {
        // Mountain formations
        const mountainPositions = [
            { x: -150, z: -200, scale: 60 },
            { x: 150, z: -200, scale: 80 },
            { x: 0, z: -350, scale: 100 },
            { x: -200, z: 100, scale: 50 },
            { x: 200, z: 150, scale: 70 }
        ];

        mountainPositions.forEach((pos, index) => {
            const mountain = this.createMountain(pos.scale);
            mountain.position.set(pos.x, 0, pos.z);
            this.scene.add(mountain);
            this.worldObjects.push(mountain);
        });

        // Floating crystal spires
        for (let i = 0; i < 8; i++) {
            const spire = this.createCrystalSpire();
            spire.position.set(
                (Math.random() - 0.5) * 300,
                Math.random() * 40,
                (Math.random() - 0.5) * 300
            );
            this.scene.add(spire);
            this.worldObjects.push({
                mesh: spire,
                isSpire: true,
                initialY: spire.position.y,
                speed: Math.random() * 0.005 + 0.002
            });
        }
    }

    createMountain(scale) {
        const geometry = new THREE.ConeGeometry(scale, scale * 1.5, 32, 32);
        
        // Displace vertices for organic shape
        const positions = geometry.attributes.position.array;
        for (let i = 0; i < positions.length; i += 3) {
            positions[i] += (Math.random() - 0.5) * scale * 0.3;
            positions[i + 1] *= (0.8 + Math.random() * 0.4);
            positions[i + 2] += (Math.random() - 0.5) * scale * 0.3;
        }
        geometry.attributes.position.needsUpdate = true;
        geometry.computeVertexNormals();

        const material = new THREE.MeshPhongMaterial({
            color: new THREE.Color().setHSL(0.6, 0.6, 0.35),
            emissive: 0x8338ec,
            emissiveIntensity: 0.2,
            flatShading: true
        });

        const mountain = new THREE.Mesh(geometry, material);
        mountain.castShadow = true;
        mountain.receiveShadow = true;

        return mountain;
    }

    createCrystalSpire() {
        const group = new THREE.Group();

        // Main crystal body
        const crystalGeometry = new THREE.OctahedronGeometry(8, 3);
        const crystalMaterial = new THREE.MeshPhongMaterial({
            color: 0x00d9ff,
            emissive: 0x00d9ff,
            emissiveIntensity: 0.6,
            wireframe: false,
            shininess: 100,
            transparent: true,
            opacity: 0.8
        });

        const crystal = new THREE.Mesh(crystalGeometry, crystalMaterial);
        crystal.castShadow = true;
        crystal.receiveShadow = true;
        group.add(crystal);

        // Glow halo
        const haloGeometry = new THREE.SphereGeometry(12, 32, 32);
        const haloMaterial = new THREE.MeshBasicMaterial({
            color: 0x8338ec,
            transparent: true,
            opacity: 0.15,
            wireframe: true
        });
        const halo = new THREE.Mesh(haloGeometry, haloMaterial);
        group.add(halo);

        return group;
    }

    generateFloatingElements() {
        // Floating orbs and particles
        for (let i = 0; i < 12; i++) {
            const size = Math.random() * 3 + 2;
            const geometry = new THREE.SphereGeometry(size, 32, 32);
            const material = new THREE.MeshPhongMaterial({
                color: new THREE.Color().setHSL(Math.random() * 0.3, 1, 0.5),
                emissive: new THREE.Color().setHSL(Math.random() * 0.3, 1, 0.5),
                emissiveIntensity: 0.8
            });

            const orb = new THREE.Mesh(geometry, material);
            orb.position.set(
                (Math.random() - 0.5) * 300,
                Math.random() * 200 + 20,
                (Math.random() - 0.5) * 300
            );

            this.scene.add(orb);
            this.floatingElements.push({
                mesh: orb,
                initialPos: orb.position.clone(),
                speed: Math.random() * 0.003 + 0.001,
                radius: Math.random() * 30 + 20,
                angle: Math.random() * Math.PI * 2
            });
        }

        // Floating platforms
        for (let i = 0; i < 5; i++) {
            const platform = this.createFloatingPlatform();
            platform.position.set(
                (Math.random() - 0.5) * 250,
                Math.random() * 150 + 30,
                (Math.random() - 0.5) * 250
            );
            this.scene.add(platform);
            this.floatingElements.push({
                mesh: platform,
                initialY: platform.position.y,
                speed: Math.random() * 0.003 + 0.001
            });
        }
    }

    createFloatingPlatform() {
        const group = new THREE.Group();

        // Platform surface
        const platformGeometry = new THREE.BoxGeometry(30, 3, 30);
        const platformMaterial = new THREE.MeshPhongMaterial({
            color: 0x1f2d4d,
            emissive: 0x00d9ff,
            emissiveIntensity: 0.3
        });
        const platform = new THREE.Mesh(platformGeometry, platformMaterial);
        platform.castShadow = true;
        platform.receiveShadow = true;
        group.add(platform);

        // Edge glow
        const edgeGeometry = new THREE.EdgesGeometry(platformGeometry);
        const edgeWireframe = new THREE.LineSegments(
            edgeGeometry,
            new THREE.LineBasicMaterial({ color: 0x00d9ff })
        );
        group.add(edgeWireframe);

        // Pillars
        for (let i = 0; i < 4; i++) {
            const pillarGeometry = new THREE.CylinderGeometry(2, 2, 20, 16);
            const pillar = new THREE.Mesh(pillarGeometry, platformMaterial);
            const angle = (i / 4) * Math.PI * 2;
            pillar.position.set(
                Math.cos(angle) * 12,
                -10,
                Math.sin(angle) * 12
            );
            pillar.castShadow = true;
            group.add(pillar);
        }

        return group;
    }

    generateCreatures() {
        // Floating creatures/entities
        for (let i = 0; i < 4; i++) {
            const creature = this.createCreature();
            creature.position.set(
                (Math.random() - 0.5) * 250,
                Math.random() * 100 + 40,
                (Math.random() - 0.5) * 250
            );
            this.scene.add(creature);
            this.creatures.push({
                mesh: creature,
                speed: Math.random() * 0.02 + 0.01,
                angle: Math.random() * Math.PI * 2,
                radius: Math.random() * 40 + 30,
                bobSpeed: Math.random() * 0.01 + 0.005,
                bobAmount: Math.random() * 20 + 10,
                initialY: creature.position.y
            });
        }
    }

    createCreature() {
        const group = new THREE.Group();

        // Body
        const bodyGeometry = new THREE.SphereGeometry(8, 16, 16);
        const bodyMaterial = new THREE.MeshPhongMaterial({
            color: 0xff006e,
            emissive: 0xff006e,
            emissiveIntensity: 0.4
        });
        const body = new THREE.Mesh(bodyGeometry, bodyMaterial);
        body.castShadow = true;
        group.add(body);

        // Eyes
        for (let i = -1; i <= 1; i += 2) {
            const eyeGeometry = new THREE.SphereGeometry(3, 16, 16);
            const eyeMaterial = new THREE.MeshPhongMaterial({
                color: 0x00d9ff,
                emissive: 0x00d9ff,
                emissiveIntensity: 0.8
            });
            const eye = new THREE.Mesh(eyeGeometry, eyeMaterial);
            eye.position.set(i * 4, 3, 6);
            group.add(eye);
        }

        // Appendages
        for (let i = 0; i < 3; i++) {
            const appendageGeometry = new THREE.CylinderGeometry(2, 1, 12, 8);
            const appendageMaterial = new THREE.MeshPhongMaterial({
                color: 0x8338ec,
                emissive: 0x8338ec,
                emissiveIntensity: 0.5
            });
            const appendage = new THREE.Mesh(appendageGeometry, appendageMaterial);
            const angle = (i / 3) * Math.PI * 2;
            appendage.position.set(
                Math.cos(angle) * 8,
                -6,
                Math.sin(angle) * 8
            );
            appendage.rotation.z = Math.PI / 4;
            appendage.castShadow = true;
            group.add(appendage);
        }

        return group;
    }

    onScroll() {
        const scrollHeight = document.documentElement.scrollHeight - window.innerHeight;
        this.scrollProgress = window.scrollY / scrollHeight;

        // Update section indicators
        const sections = document.querySelectorAll('.experience');
        let newSection = 0;
        sections.forEach((section, index) => {
            const rect = section.getBoundingClientRect();
            if (rect.top <= window.innerHeight / 2) {
                newSection = index + 1;
            }
        });

        if (newSection !== this.currentSection) {
            this.currentSection = newSection;
            this.updateIndicators();
        }

        // Camera movement based on scroll
        this.updateCameraPosition();
    }

    updateCameraPosition() {
        const baseX = Math.sin(this.scrollProgress * Math.PI * 4) * 80;
        const baseZ = 100 + this.scrollProgress * 300;
        const baseY = 40 + this.scrollProgress * 100;

        gsap.to(this.camera.position, {
            x: baseX,
            y: baseY,
            z: baseZ,
            duration: 0.1
        });
    }

    updateIndicators() {
        const indicators = document.querySelectorAll('.indicator');
        indicators.forEach((indicator, index) => {
            indicator.classList.toggle('active', index === this.currentSection);
        });
    }

    onWindowResize() {
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(window.innerWidth, window.innerHeight);
    }

    animate = () => {
        this.animationId = requestAnimationFrame(this.animate);
        this.time += 0.016; // ~60fps

        // Update creatures
        this.creatures.forEach(creature => {
            creature.angle += creature.speed;
            creature.mesh.position.x = Math.cos(creature.angle) * creature.radius;
            creature.mesh.position.z = Math.sin(creature.angle) * creature.radius;
            creature.mesh.position.y = creature.initialY + Math.sin(this.time * creature.bobSpeed) * creature.bobAmount;
            creature.mesh.rotation.y += 0.005;
            creature.mesh.rotation.z = Math.sin(this.time * creature.bobSpeed) * 0.3;
        });

        // Update floating elements
        this.floatingElements.forEach((element, index) => {
            if (element.radius) {
                // Orbital movement
                element.angle = (element.angle || 0) + element.speed;
                element.mesh.position.x = element.initialPos.x + Math.cos(element.angle) * element.radius;
                element.mesh.position.z = element.initialPos.z + Math.sin(element.angle) * element.radius;
            }
            
            // Vertical bobbing
            element.mesh.position.y = element.initialY + Math.sin(this.time * element.speed) * 10;
            
            // Rotation
            if (element.mesh.rotation) {
                element.mesh.rotation.x += 0.003;
                element.mesh.rotation.y += 0.005;
            }
        });

        // Animate floating world objects
        this.worldObjects.forEach(obj => {
            if (obj.isSpire) {
                obj.mesh.position.y = obj.initialY + Math.sin(this.time * obj.speed) * 15;
                obj.mesh.rotation.z += 0.001;
            }
        });

        // Subtle camera rotation for immersion
        if (this.scrollProgress < 0.05) {
            this.camera.lookAt(0, 50, 50);
        } else {
            this.camera.lookAt(0, 50 + this.scrollProgress * 50, 0);
        }

        // Render scene
        this.renderer.render(this.scene, this.camera);
    }
}

// Initialize scene when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    const nexus = new NexusScene();

    // CTA button interaction
    const ctaBtn = document.querySelector('.cta-btn');
    if (ctaBtn) {
        ctaBtn.addEventListener('click', () => {
            const targetScroll = window.innerHeight;
            gsap.to(window, {
                scrollTo: targetScroll,
                duration: 1,
                ease: 'power2.inOut'
            });
        });
    }

    // Navigation scroll
    document.querySelectorAll('.nav-link').forEach((link, index) => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const sections = document.querySelectorAll('.experience');
            if (sections[index]) {
                gsap.to(window, {
                    scrollTo: sections[index],
                    duration: 1,
                    ease: 'power2.inOut'
                });
            }
        });
    });

    // Indicator clicks
    document.querySelectorAll('.indicator').forEach((indicator, index) => {
        indicator.addEventListener('click', () => {
            if (index === 0) {
                gsap.to(window, {
                    scrollTo: 0,
                    duration: 1,
                    ease: 'power2.inOut'
                });
            } else {
                const sections = document.querySelectorAll('.experience');
                const targetSection = sections[index - 1];
                if (targetSection) {
                    gsap.to(window, {
                        scrollTo: targetSection,
                        duration: 1,
                        ease: 'power2.inOut'
                    });
                }
            }
        });
    });

    // Connect wallet button
    const connectBtn = document.querySelector('.connect-btn');
    if (connectBtn) {
        connectBtn.addEventListener('click', () => {
            alert('Connect Wallet - Integration Point\n\nThis would integrate with Web3 providers like MetaMask, Walletconnect, etc.');
        });
    }
});

// Handle scroll smoothing with GSAP ScrollToPlugin (fallback without it)
if (typeof gsap !== 'undefined' && !gsap.plugins.includes('ScrollToPlugin')) {
    gsap.registerPlugin(ScrollToPlugin);
}
