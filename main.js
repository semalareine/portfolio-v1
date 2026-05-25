

        (function() {
            const canvas = document.getElementById('coin-canvas');
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
            renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
            renderer.setSize(canvas.clientWidth, canvas.clientHeight);

            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(45, canvas.clientWidth / canvas.clientHeight, 0.1, 100);
            camera.position.z = 4;

            // Lighting
            const ambientLight = new THREE.AmbientLight(0xffffff, 0.4);
            scene.add(ambientLight);

            const dirLight1 = new THREE.DirectionalLight(0xffffff, 0.9);
            dirLight1.position.set(3, 3, 4);
            scene.add(dirLight1);

            const dirLight2 = new THREE.DirectionalLight(0xffffff, 0.5);
            dirLight2.position.set(-3, -2, 3);
            scene.add(dirLight2);

            const rimLight = new THREE.PointLight(0xffffff, 0.6, 10);
            rimLight.position.set(0, 3, -2);
            scene.add(rimLight);

            const coinGroup = new THREE.Group();
            scene.add(coinGroup);

            const coinMaterial = new THREE.MeshStandardMaterial({
                color: 0xd4d4d4,
                metalness: 0.95,
                roughness: 0.15,
            });

            const edgeMaterial = new THREE.MeshStandardMaterial({
                color: 0xc0c0c0,
                metalness: 0.9,
                roughness: 0.2,
            });

            const coinRadius = 1.2;
            const coinThickness = 0.08;

            const frontGeo = new THREE.CylinderGeometry(coinRadius, coinRadius, coinThickness, 128, 1);
            const frontMesh = new THREE.Mesh(frontGeo, coinMaterial);
            frontMesh.rotation.x = Math.PI / 2;
            coinGroup.add(frontMesh);

            const edgeGeo = new THREE.TorusGeometry(coinRadius, coinThickness / 2, 16, 128);
            const edgeMesh = new THREE.Mesh(edgeGeo, edgeMaterial);
            coinGroup.add(edgeMesh);

            function createCoinTexture(isBack) {
                const texCanvas = document.createElement('canvas');
                texCanvas.width = 1024;
                texCanvas.height = 1024;
                const ctx = texCanvas.getContext('2d');

                ctx.fillStyle = '#4a4a4a';
                ctx.beginPath();
                ctx.arc(512, 512, 500, 0, Math.PI * 2);
                ctx.fill();

                ctx.fillStyle = '#3a3a3a';
                ctx.beginPath();
                ctx.arc(512, 512, 490, 0, Math.PI * 2);
                ctx.fill();

                ctx.strokeStyle = '#666666';
                ctx.lineWidth = 3;
                ctx.beginPath();
                ctx.arc(512, 512, 460, 0, Math.PI * 2);
                ctx.stroke();

                ctx.strokeStyle = '#555555';
                ctx.lineWidth = 1.5;
                ctx.beginPath();
                ctx.arc(512, 512, 440, 0, Math.PI * 2);
                ctx.stroke();

                if (!isBack) {
                    ctx.fillStyle = '#ffffff';
                    drawStar(ctx, 512, 150, 5, 22, 11);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 68px "Space Grotesk", Arial, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('ALEXANDRO', 512, 360);

                    ctx.font = 'bold 68px "Space Grotesk", Arial, sans-serif';
                    ctx.fillText('NASROLAHI', 512, 445);

                    ctx.strokeStyle = '#ffffff';
                    ctx.lineWidth = 2;
                    ctx.beginPath();
                    ctx.moveTo(180, 500);
                    ctx.lineTo(844, 500);
                    ctx.stroke();

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 34px "Space Grotesk", Arial, sans-serif';
                    ctx.fillText('FULLSTACK DEVELOPER', 512, 555);

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 44px "Space Grotesk", Arial, sans-serif';
                    ctx.fillText('2025', 512, 670);

                    drawStar(ctx, 512, 870, 5, 20, 10);
                } else {

                    ctx.fillStyle = '#ffffff';
                    ctx.font = 'bold 56px "Space Grotesk", Arial, sans-serif';
                    ctx.textAlign = 'center';
                    ctx.textBaseline = 'middle';
                    ctx.fillText('★', 512, 512);

 
                    ctx.font = 'bold 26px "Space Grotesk", Arial, sans-serif';
                    ctx.fillStyle = '#ffffff';
                    ctx.fillText('DEN HAAG • NEDERLAND', 512, 370);
                    ctx.fillText('PORTFOLIO 2025', 512, 640);

                    for (let i = 0; i < 8; i++) {
                        const angle = (i / 8) * Math.PI * 2 - Math.PI / 2;
                        const x = 512 + Math.cos(angle) * 280;
                        const y = 512 + Math.sin(angle) * 280;
                        ctx.beginPath();
                        ctx.arc(x, y, 5, 0, Math.PI * 2);
                        ctx.fill();
                    }
                }

                const texture = new THREE.CanvasTexture(texCanvas);
                texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
                return texture;
            }

            function drawStar(ctx, cx, cy, spikes, outerR, innerR) {
                let rot = Math.PI / 2 * 3;
                const step = Math.PI / spikes;
                ctx.beginPath();
                ctx.moveTo(cx, cy - outerR);
                for (let i = 0; i < spikes; i++) {
                    ctx.lineTo(cx + Math.cos(rot) * outerR, cy + Math.sin(rot) * outerR);
                    rot += step;
                    ctx.lineTo(cx + Math.cos(rot) * innerR, cy + Math.sin(rot) * innerR);
                    rot += step;
                }
                ctx.lineTo(cx, cy - outerR);
                ctx.closePath();
                ctx.fill();
            }

            const frontTexture = createCoinTexture(false);
            const backTexture = createCoinTexture(true);
            const frontFaceGeo = new THREE.CircleGeometry(coinRadius, 128);
            const frontFaceMat = new THREE.MeshStandardMaterial({
                map: frontTexture,
                metalness: 0.95,
                roughness: 0.15,
            });
            const frontFace = new THREE.Mesh(frontFaceGeo, frontFaceMat);
            frontFace.position.z = coinThickness / 2 + 0.001;
            coinGroup.add(frontFace);

            const backFaceMat = new THREE.MeshStandardMaterial({
                map: backTexture,
                metalness: 0.95,
                roughness: 0.15,
            });
            const backFace = new THREE.Mesh(frontFaceGeo.clone(), backFaceMat);
            backFace.rotation.y = Math.PI;
            backFace.position.z = -coinThickness / 2 - 0.001;
            coinGroup.add(backFace);


            let isDragging = false;
            let previousMouse = { x: 0, y: 0 };
            let rotationVelocity = { x: 0, y: 0 };
            let autoRotateSpeed = 0.003;

            canvas.addEventListener('mousedown', (e) => {
                isDragging = true;
                previousMouse = { x: e.clientX, y: e.clientY };
                autoRotateSpeed = 0;
            });

            canvas.addEventListener('mousemove', (e) => {
                if (!isDragging) return;
                const deltaX = e.clientX - previousMouse.x;
                const deltaY = e.clientY - previousMouse.y;

                rotationVelocity.x = deltaY * 0.005;
                rotationVelocity.y = deltaX * 0.005;

                coinGroup.rotation.x += rotationVelocity.x;
                coinGroup.rotation.y += rotationVelocity.y;

                previousMouse = { x: e.clientX, y: e.clientY };
            });

            canvas.addEventListener('mouseup', () => {
                isDragging = false;
            });

            canvas.addEventListener('mouseleave', () => {
                isDragging = false;
            });

            canvas.addEventListener('touchstart', (e) => {
                isDragging = true;
                previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
                autoRotateSpeed = 0;
            });

            canvas.addEventListener('touchmove', (e) => {
                if (!isDragging) return;
                e.preventDefault();
                const deltaX = e.touches[0].clientX - previousMouse.x;
                const deltaY = e.touches[0].clientY - previousMouse.y;

                rotationVelocity.x = deltaY * 0.005;
                rotationVelocity.y = deltaX * 0.005;

                coinGroup.rotation.x += rotationVelocity.x;
                coinGroup.rotation.y += rotationVelocity.y;

                previousMouse = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            }, { passive: false });

            canvas.addEventListener('touchend', () => {
                isDragging = false;
            });

            function animateCoin() {
                requestAnimationFrame(animateCoin);

                if (!isDragging) {
                    rotationVelocity.x *= 0.95;
                    rotationVelocity.y *= 0.95;

                    coinGroup.rotation.x += rotationVelocity.x;
                    coinGroup.rotation.y += rotationVelocity.y;

                    if (Math.abs(rotationVelocity.x) < 0.001 && Math.abs(rotationVelocity.y) < 0.001) {
                        coinGroup.rotation.y += autoRotateSpeed;
                        coinGroup.rotation.x += Math.sin(Date.now() * 0.001) * 0.0003;
                    }
                }

                renderer.render(scene, camera);
            }

            animateCoin();

            function handleResize() {
                const w = canvas.clientWidth;
                const h = canvas.clientHeight;
                camera.aspect = w / h;
                camera.updateProjectionMatrix();
                renderer.setSize(w, h);
            }

            window.addEventListener('resize', handleResize);
        })();

        (function() {
            const canvas = document.getElementById('particles');
            const ctx = canvas.getContext('2d');

            canvas.width = window.innerWidth;
            canvas.height = window.innerHeight;

            const particles = [];
            const particleCount = 60;

            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    vx: (Math.random() - 0.5) * 0.3,
                    vy: (Math.random() - 0.5) * 0.3,
                    size: Math.random() * 1.5 + 0.5,
                    opacity: Math.random() * 0.3 + 0.1
                });
            }

            function animateParticles() {
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                particles.forEach(p => {
                    p.x += p.vx;
                    p.y += p.vy;

                    if (p.x < 0) p.x = canvas.width;
                    if (p.x > canvas.width) p.x = 0;
                    if (p.y < 0) p.y = canvas.height;
                    if (p.y > canvas.height) p.y = 0;

                    ctx.beginPath();
                    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                    ctx.fillStyle = `rgba(255, 255, 255, ${p.opacity})`;
                    ctx.fill();
                });

                for (let i = 0; i < particles.length; i++) {
                    for (let j = i + 1; j < particles.length; j++) {
                        const dx = particles[i].x - particles[j].x;
                        const dy = particles[i].y - particles[j].y;
                        const dist = Math.sqrt(dx * dx + dy * dy);

                        if (dist < 120) {
                            ctx.beginPath();
                            ctx.moveTo(particles[i].x, particles[i].y);
                            ctx.lineTo(particles[j].x, particles[j].y);
                            ctx.strokeStyle = `rgba(255, 255, 255, ${0.03 * (1 - dist / 120)})`;
                            ctx.lineWidth = 0.5;
                            ctx.stroke();
                        }
                    }
                }

                requestAnimationFrame(animateParticles);
            }

            animateParticles();

            window.addEventListener('resize', () => {
                canvas.width = window.innerWidth;
                canvas.height = window.innerHeight;
            });
        })();

        (function() {
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('visible');
                    }
                });
            }, { threshold: 0.1, rootMargin: '0px 0px -50px 0px' });

            document.querySelectorAll('.fade-in').forEach(el => observer.observe(el));
        })();

        (function() {
            const navbar = document.getElementById('navbar');
            window.addEventListener('scroll', () => {
                if (window.scrollY > 50) {
                    navbar.classList.add('scrolled');
                } else {
                    navbar.classList.remove('scrolled');
                }
            });

            const navToggle = document.getElementById('navToggle');
            const navLinks = document.getElementById('navLinks');

            navToggle.addEventListener('click', () => {
                navLinks.classList.toggle('active');
            });

            navLinks.querySelectorAll('a').forEach(link => {
                link.addEventListener('click', () => {
                    navLinks.classList.remove('active');
                });
            });
        })();
