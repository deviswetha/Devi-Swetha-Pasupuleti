// Initialize Lucide Icons initially
if (window.lucide) {
    window.lucide.createIcons();
}

document.addEventListener('DOMContentLoaded', () => {
    // 1. Loading Screen
    const loader = document.getElementById('loading-screen');
    window.addEventListener('load', () => {
        setTimeout(() => {
            loader.style.opacity = '0';
            setTimeout(() => {
                loader.style.display = 'none';
            }, 500);
        }, 1000);
    });

    // 2. Typing Animation (Hero)
    const typingElement = document.getElementById('typing-text');
    const roles = ["AI/ML Developer", "Python Developer", "Web Designer", "AI/ML Engineer"];
    let roleIndex = 0;
    let charIndex = 0;
    let isDeleting = false;

    function typeHero() {
        if (!typingElement) return;
        const currentRole = roles[roleIndex];
        if (isDeleting) {
            typingElement.textContent = currentRole.substring(0, charIndex - 1);
            charIndex--;
        } else {
            typingElement.textContent = currentRole.substring(0, charIndex + 1);
            charIndex++;
        }

        let typeSpeed = isDeleting ? 50 : 100;

        if (!isDeleting && charIndex === currentRole.length) {
            isDeleting = true;
            typeSpeed = 1500; // Pause at end
        } else if (isDeleting && charIndex === 0) {
            isDeleting = false;
            roleIndex = (roleIndex + 1) % roles.length;
            typeSpeed = 500;
        }

        setTimeout(typeHero, typeSpeed);
    }
    typeHero();

    // 2b. About Section Typing Animation
    const aboutTypingElement = document.getElementById('about-typing-text');
    const aboutText = "Engineering the intelligence of tomorrow, today.";
    let aboutCharIndex = 0;

    function typeAbout() {
        if (!aboutTypingElement || aboutCharIndex > 0) return; // Prevent multiple triggers
        function run() {
            if (aboutCharIndex < aboutText.length) {
                aboutTypingElement.textContent += aboutText.charAt(aboutCharIndex);
                aboutCharIndex++;
                setTimeout(run, 40);
            }
        }
        run();
    }

    // 3. Reveal Animations (Intersection Observer)
    const revealElements = document.querySelectorAll('.reveal');
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // Check if element is entering or leaving
            if (entry.isIntersecting) {
                entry.target.classList.add('active');
                
                // Specific Section Triggers
                
                // 1. Counters Grid
                if (entry.target.id === 'counters-grid') {
                    animateCounters();
                }

                // 2. About Typing
                if (entry.target.id === 'about-typing-text' || entry.target.querySelector('#about-typing-text')) {
                    // Slight delay for better effect
                    setTimeout(typeAbout, 300);
                }

                // 3. Skills Section (trigger bars)
                if (entry.target.classList.contains('skills-section')) {
                    animateSkills(entry.target);
                }
            } else {
                // Repeatable animations: remove active class when scrolled away
                entry.target.classList.remove('active');
                
                // Reset specific states for re-triggering
                if (entry.target.id === 'counters-grid') {
                    countersAnimated = false;
                }
                
                if (entry.target.id === 'about-typing-text' || entry.target.querySelector('#about-typing-text')) {
                    aboutCharIndex = 0;
                    if (aboutTypingElement) aboutTypingElement.textContent = "";
                }
                
                if (entry.target.classList.contains('skills-section')) {
                    delete entry.target.dataset.animated;
                    const bars = entry.target.querySelectorAll('.skill-progress');
                    bars.forEach(bar => bar.style.width = '0%');
                }
            }
        });
    }, { 
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px' 
    });

    revealElements.forEach(el => revealObserver.observe(el));

    // 4. Skill Bars Animation
    function animateSkills(container) {
        if (container.dataset.animated) return;
        container.dataset.animated = "true";
        
        // Custom animation for the new cards
        const progressBar = container.querySelectorAll('.skill-progress-bar');
        const counters = container.querySelectorAll('.counter');
        
        progressBar.forEach((bar, index) => {
            const target = bar.getAttribute('data-target');
            bar.style.width = target + '%';
        });

        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const duration = 2000;
            const startTime = performance.now();

            const update = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                count = Math.floor(progress * target);
                counter.innerText = count;

                if (progress < 1) requestAnimationFrame(update);
            };
            requestAnimationFrame(update);
        });
    }

    // 4b. Counter Animation
    let countersAnimated = false;
    function animateCounters() {
        if (countersAnimated) return;
        countersAnimated = true;
        
        const counters = document.querySelectorAll('.counter-value');
        counters.forEach(counter => {
            const target = +counter.getAttribute('data-target');
            let count = 0;
            const duration = 2000; // 2 seconds
            const startTime = performance.now();

            const updateCount = (currentTime) => {
                const elapsed = currentTime - startTime;
                const progress = Math.min(elapsed / duration, 1);
                
                // Ease out expo for smoother finish
                const easeProgress = progress === 1 ? 1 : 1 - Math.pow(2, -10 * progress);
                
                count = Math.floor(easeProgress * target);
                counter.innerText = count + "+";

                if (progress < 1) {
                    requestAnimationFrame(updateCount);
                } else {
                    counter.innerText = target + "+";
                }
            };
            requestAnimationFrame(updateCount);
        });
    }

    // 5. Sidebar Toggle Logic
    const sidebarOpenBtn = document.getElementById('sidebar-open-btn');
    const sidebarCloseBtn = document.getElementById('sidebar-close-btn');
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebar-overlay');
    const sidebarLinks = document.querySelectorAll('.sidebar-link, .sidebar-btn-outline, .sidebar-btn-gradient');

    function openSidebar() {
        sidebar.classList.remove('translate-x-full');
        sidebarOverlay.classList.remove('opacity-0', 'pointer-events-none');
        document.body.style.overflow = 'hidden';
    }

    function closeSidebar() {
        sidebar.classList.add('translate-x-full');
        sidebarOverlay.classList.add('opacity-0', 'pointer-events-none');
        document.body.style.overflow = '';
    }

    if (sidebarOpenBtn) sidebarOpenBtn.addEventListener('click', openSidebar);
    if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeSidebar);
    if (sidebarOverlay) sidebarOverlay.addEventListener('click', closeSidebar);

    sidebarLinks.forEach(link => {
        link.addEventListener('click', closeSidebar);
    });

    // 6. Tilt Effect for Cards
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            
            const rotateX = (y - centerY) / 10; // Increased sensitivity
            const rotateY = (centerX - x) / 10; // Increased sensitivity
            
            card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.05, 1.05, 1.05)`; // Slightly zoomed in
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = `perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)`;
        });
    });

    // 7. Cursor Glow
    const cursorGlow = document.createElement('div');
    cursorGlow.style.cssText = `
        position: fixed;
        width: 400px;
        height: 400px;
        background: radial-gradient(circle, rgba(139, 92, 246, 0.15) 0%, transparent 70%);
        border-radius: 50%;
        pointer-events: none;
        z-index: 9998;
        transform: translate(-50%, -50%);
        transition: opacity 0.3s ease;
        opacity: 0;
    `;
    document.body.appendChild(cursorGlow);

    document.addEventListener('mousemove', (e) => {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.left = e.clientX + 'px';
        cursorGlow.style.top = e.clientY + 'px';
    });

    // 8. Navbar Scroll State
    const nav = document.querySelector('nav');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 20) {
            nav.classList.add('scrolled');
            nav.classList.remove('py-4');
            nav.classList.add('py-2');
        } else {
            nav.classList.remove('scrolled');
            nav.classList.remove('py-2');
            nav.classList.add('py-4');
        }
    });

    // 9. Floating Blobs in background (Interactive)
    const blobs = document.querySelectorAll('.blob');
    const heroSection = document.getElementById('home');
    
    document.addEventListener('mousemove', (e) => {
        const x = (e.clientX / window.innerWidth - 0.5) * 40;
        const y = (e.clientY / window.innerHeight - 0.5) * 40;
        
        blobs.forEach((blob, index) => {
            const factor = (index + 1) * 0.8;
            blob.style.transform = `translate(${x * factor}px, ${y * factor}px)`;
        });

        // Hero Parallax
        if (heroSection) {
            const moveX = (e.clientX - window.innerWidth / 2) / 50;
            const moveY = (e.clientY - window.innerHeight / 2) / 50;
            const heroContent = heroSection.querySelector('.reveal');
            if (heroContent) {
                heroContent.style.transform = `translate(${moveX}px, ${moveY}px)`;
            }
        }
    });

    // 9b. Magnetic Effect for Buttons
    const magneticBtns = document.querySelectorAll('.btn-primary, .btn-secondary, .social-icon');
    magneticBtns.forEach(btn => {
        btn.addEventListener('mousemove', (e) => {
            const rect = btn.getBoundingClientRect();
            const x = e.clientX - rect.left - rect.width / 2;
            const y = e.clientY - rect.top - rect.height / 2;
            
            btn.style.transform = `translate(${x * 0.3}px, ${y * 0.3}px) scale(1.05)`;
        });
        
        btn.addEventListener('mouseleave', () => {
            btn.style.transform = '';
        });
    });

    // 9c. Scroll Progress Line
    const progressBar = document.createElement('div');
    progressBar.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        height: 3px;
        background: linear-gradient(to right, #8b5cf6, #06b6d4);
        z-index: 100;
        width: 0%;
        transition: width 0.1s ease;
    `;
    document.body.appendChild(progressBar);

    window.addEventListener('scroll', () => {
        const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
        const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
        const scrolled = (winScroll / height) * 100;
        progressBar.style.width = scrolled + "%";
    });

    // 10. Social Icon Click Effect
    const socialIcons = document.querySelectorAll('.social-icon');
    socialIcons.forEach(icon => {
        icon.addEventListener('click', (e) => {
            const circle = document.createElement('div');
            circle.style.cssText = `
                position: absolute;
                background: white;
                width: 20px;
                height: 20px;
                border-radius: 50%;
                pointer-events: none;
                transform: translate(-50%, -50%) scale(0);
                opacity: 0.5;
                transition: transform 0.6s ease, opacity 0.6s ease;
                z-index: 10;
            `;
            
            const rect = icon.getBoundingClientRect();
            circle.style.left = (e.clientX - rect.left) + 'px';
            circle.style.top = (e.clientY - rect.top) + 'px';
            
            icon.appendChild(circle);
            
            // Animation trigger
            requestAnimationFrame(() => {
                circle.style.transform = 'translate(-50%, -50%) scale(10)';
                circle.style.opacity = '0';
            });
            
            setTimeout(() => circle.remove(), 600);
        });
    });

    // 11. Contact Section Particles
    function initContactParticles() {
        const container = document.getElementById('contact-particles');
        if (!container) return;
        
        for (let i = 0; i < 20; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random properties
            const size = Math.random() * 4 + 2;
            const left = Math.random() * 100;
            const delay = Math.random() * 15;
            const duration = Math.random() * 10 + 10;
            const opacity = Math.random() * 0.3 + 0.1;
            
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            particle.style.left = `${left}%`;
            particle.style.top = `110%`;
            particle.style.animationDelay = `${delay}s`;
            particle.style.animationDuration = `${duration}s`;
            particle.style.opacity = opacity;
            
            container.appendChild(particle);
        }
    }
    initContactParticles();

    // ==========================================================================
// 12. Contact Form Handling (Connect to Google Sheet)
// ==========================================================================
// SETUP INSTRUCTIONS:
// 1. Open your sheet: https://docs.google.com/spreadsheets/d/1J-NTLbajksE1zKrxWkbBRUScCGjkGquFkbapHvQ58us/
// 2. Go to Extensions > Apps Script
// 3. Paste this code:
/*
  function doPost(e) {
    var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
    var data = e.parameter;
    sheet.appendRow([new Date(), data.name, data.email, data.message]);
    return ContentService.createTextOutput("Success").setMimeType(ContentService.MimeType.TEXT);
  }
*/
// 4. Click Deploy > New Deployment > Web App (Set "Who has access" to "Anyone")
// 5. Paste the URL below:

const SHOOT_URL = 'https://script.google.com/macros/s/AKfycbzA7ztZVpFUB8KwSIwKeszZvRhcCAboL3Jk6dQ1L6aXMZBZ1hcw5IZEPUZyErQ_4h3-HA/exec';


const contactForm = document.getElementById('contact-form');
const formStatus = document.getElementById('form-status');

if (contactForm) {
    contactForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        
        const btn = contactForm.querySelector('#form-submit');
        const originalText = btn.innerHTML;
        
        // 1. Show loading state
        btn.disabled = true;
        btn.innerHTML = '<i data-lucide="loader-2" class="w-4 h-4 animate-spin"></i> Sending...';
        if (window.lucide) window.lucide.createIcons();
        
        // 2. Reset status message
        if (formStatus) {
            formStatus.classList.add('hidden');
            formStatus.textContent = '';
            formStatus.className = 'text-center text-[10px] uppercase tracking-widest font-bold mt-4';
        }

        try {
            // 3. Prepare Form Data using URLSearchParams for Google Apps Script compatibility
            const formData = new FormData(contactForm);
            const params = new URLSearchParams();

            for (const pair of formData.entries()) {
                params.append(pair[0], pair[1]);
            }

            // 4. Send the Request
            // Note: mode 'no-cors' is used to bypass browser CORS restrictions with Google Scripts.
            // This means we won't get a readable response body, but if the fetch succeeds, 
            // the data has reached the script.
            await fetch(SHOOT_URL, {
                method: 'POST',
                mode: 'no-cors',
                cache: 'no-cache',
                headers: {
                    'Content-Type': 'application/x-www-form-urlencoded'
                },
                redirect: 'follow',
                body: params
            });

            // 5. Handle Success
            btn.innerHTML = '<i data-lucide="check" class="w-4 h-4"></i> Success!';
            if (window.lucide) window.lucide.createIcons();
            
            contactForm.reset();
            
            if (formStatus) {
                formStatus.textContent = 'Message sent successfully!';
                formStatus.classList.remove('hidden');
                formStatus.classList.add('text-green-400');
            }

        } catch (err) {
            // 6. Handle Errors
            console.error('Form error:', err);
            btn.innerHTML = '<i data-lucide="alert-circle" class="w-4 h-4"></i> Error';
            if (window.lucide) window.lucide.createIcons();
            
            if (formStatus) {
                formStatus.classList.remove('hidden');
                formStatus.classList.add('text-red-400');
                formStatus.textContent = 'Failed to send. Please check your connection.';
            }
        } finally {
            // 7. Restore button after 4 seconds
            setTimeout(() => {
                btn.disabled = false;
                btn.innerHTML = originalText;
                if (window.lucide) window.lucide.createIcons();
                if (formStatus) formStatus.classList.add('hidden');
            }, 4000);
        }
    });
}

    // 13. Back to Top Logic
    const backToTopBtn = document.getElementById('back-to-top');
    if (backToTopBtn) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 500) {
                backToTopBtn.classList.add('visible');
            } else {
                backToTopBtn.classList.remove('visible');
            }
        });

        backToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }

    // 14. DYNAMIC PROJECT SYSTEM
    const projectsData = {
        'botnet': {
            title: "Adaptive Botnet Detection",
            tagline: "Securing the Future with Meta-Learning",
            category: "AI & Cybersecurity",
            mediaType: 'gallery',
            banner: "https://images.unsplash.com/photo-1550751827-4bd374c3f58b?auto=format&fit=crop&q=80&w=1600",
            gallery: [
                "/b1.png",
                "/b2.png",
                "/b3.png",
                "/b4.jpg"
            ],
            github: "https://github.com/deviswetha",
            demo: "#",
            stack: ["Python", "PyTorch", "Meta-Learning", "Network Security"],
            stats: { accuracy: "98.2%", speed: "0.45s", threats: "12k+" },
            overview: "A sophisticated detection system that adapts to new, unseen botnet variants using meta-learning algorithms. Unlike traditional static models, this system evolves with the threat landscape.",
            features: [
                "Real-time traffic analysis using packet inspection",
                "Zero-shot learning for zero-day threat detection",
                "Distributed monitoring across edge nodes",
                "Automated isolation of infected client devices"
            ],
            problem: "Traditional botnet detection relies on signatures or pre-trained models that fail when attackers modify their code.",
            solution: "By implementing Meta-Learning, we created a model that can identify malicious patterns with minimal data points from new botnets.",
            challenges: "Handling massive throughput of network data while maintaining low latency was the biggest hurdle."
        },
        'library': {
            title: "Digital Library System",
            tagline: "Knowledge Orchestration for Modern Campuses",
            category: "Web Application",
            mediaType: 'gallery',
            banner: "https://images.unsplash.com/photo-1507842217343-583bb7270b66?auto=format&fit=crop&q=80&w=1600",
            gallery: [
                "/d1.png",
                "/d2.png",
                "/d3.png",
                "/d4.png"
            ],
            github: "https://github.com/deviswetha",
            demo: "#",
            stack: ["HTML/CSS", "JavaScript", "MySQL", "PHP"],
            stats: { books: "15k+", uptime: "99.9%", load_time: "<1s" },
            overview: "A comprehensive digital library solution built for engineering colleges to streamline resource access.",
            features: [
                "Department-specific resource dashboards",
                "Smart search with genre-based filtering",
                "Automated reservation and notification system",
                "Admin panel for inventory tracking"
            ],
            problem: "Physical libraries often face issues with book tracking and availability visibility.",
            solution: "Developed a centralized web platform with a robust MySQL backend providing real-time availability updates.",
            challenges: "Normalizing the database for thousands of book entries while ensuring fast search responses."
        },
        'explore': {
            title: "Explore Nearby Places",
            tagline: "Your Personal Guide to Infinite Discoveries",
            category: "Location Platform",
            mediaType: 'video',
            banner: "https://images.unsplash.com/photo-1526772662000-3f88f10405ff?auto=format&fit=crop&q=80&w=1600",
            video: "/nb1.mp4",
            github: "https://github.com/deviswetha",
            demo: "#",
            stack: ["Flask", "Python", "Leaflet.js", "OpenStreetMap API"],
            stats: { api_calls: "1M+", locations: "Worldwide", rating: "4.8" },
            overview: "An interactive location discovery platform leveraging open-source mapping APIs.",
            features: [
                "Real-time geolocation tagging",
                "Custom map markers with category icons",
                "Direction routing using GraphHopper API",
                "Saved places for offline access"
            ],
            problem: "Many nearby discovery apps are bloated with ads and trackers.",
            solution: "Built a lightweight, privacy-focused alternative communicating directly with OpenStreetMap.",
            challenges: "Efficiently clustering map markers and handling asynchronous API calls."
        }
    };

    const projectPage = document.getElementById('project-page');
    const projectContent = document.getElementById('project-dynamic-content');
    const closeProjectBtn = document.getElementById('close-project');
    const pageTransition = document.querySelector('.page-transition');

    // Add click listeners to project cards
    const projectCards = document.querySelectorAll('#projects .glass-card');
    projectCards.forEach((card) => {
        card.addEventListener('click', () => {
            const projectId = card.getAttribute('data-project-id');
            if (projectId) openProject(projectId);
        });
    });

    function openProject(id) {
        const data = projectsData[id];
        if (!data) return;

        if (pageTransition) pageTransition.classList.add('active');

        setTimeout(() => {
            if (projectContent) {
                const mediaSection = data.mediaType === 'video' ? `
                    <div class="glass-card aspect-video overflow-hidden rounded-3xl p-1 bg-gradient-to-br from-purple-500/30 to-cyan-500/30 group relative">
                        <video class="w-full h-full rounded-[1.4rem] object-cover" controls loop muted autoplay>
                            <source src="${data.video}" type="video/mp4">
                        </video>
                        <div class="absolute inset-0 pointer-events-none border border-white/10 rounded-[1.4rem]"></div>
                    </div>
                ` : `
                    <div class="grid grid-cols-2 gap-4 group">
                        ${data.gallery.map(img => `
                            <div class="relative aspect-square overflow-hidden rounded-2xl glass-card border-none group/img cursor-zoom-in" onclick="window.openLightbox('${img}')">
                                <img src="${img}" class="w-full h-full object-cover transition-all duration-700 ease-in-out group-hover/img:scale-105 group-hover/img:rotate-1 group-hover/img:grayscale-0 grayscale" alt="">
                                <div class="absolute inset-0 bg-purple-500/20 opacity-0 group-hover/img:opacity-100 transition-opacity flex items-center justify-center">
                                    <i data-lucide="maximize-2" class="text-white w-6 h-6"></i>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                `;

                projectContent.innerHTML = `
                    <div class="relative min-h-[60vh] flex items-center justify-center pt-20 px-6 overflow-hidden">
                        <div class="absolute inset-0 z-0">
                            <img src="${data.banner}" class="w-full h-full object-cover opacity-20" alt="">
                            <div class="absolute inset-0 bg-gradient-to-t from-[#030014] via-[#030014]/40 to-transparent"></div>
                        </div>
                        
                        <div class="container mx-auto relative z-10 text-center reveal active">
                            <span class="px-4 py-1 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-400 text-[10px] font-bold uppercase tracking-[0.2em] mb-6 inline-block">${data.category}</span>
                            <h1 class="text-5xl md:text-8xl font-bold mb-6 shimmer-text tracking-tight">${data.title}</h1>
                            <p class="text-xl md:text-2xl text-white/50 mb-10 max-w-2xl mx-auto font-light">${data.tagline}</p>
                            
                            <div class="flex flex-wrap justify-center gap-4">
                                <!-- Action buttons removed at user request -->
                            </div>
                        </div>
                    </div>

                    <div class="container mx-auto px-6 py-24">
                        <div class="grid lg:grid-cols-12 gap-16">
                            <div class="lg:col-span-8 space-y-24">
                                <section>
                                    <h2 class="text-xs uppercase tracking-[0.3em] font-bold text-white/30 mb-8 flex items-center gap-4">
                                        <div class="w-12 h-[1px] bg-white/10"></div>
                                        Media Showcase
                                    </h2>
                                    ${mediaSection}
                                </section>

                                <section class="grid md:grid-cols-2 gap-8">
                                    <div class="p-8 glass-card bg-white/[0.01] border-white/5 hover:border-purple-500/20 transition-colors">
                                        <h3 class="text-xs font-bold uppercase tracking-widest text-purple-400 mb-4">Problem Statement</h3>
                                        <p class="text-white/60 leading-relaxed text-sm">${data.problem}</p>
                                    </div>
                                    <div class="p-8 glass-card bg-white/[0.01] border-white/5 hover:border-cyan-500/20 transition-colors">
                                        <h3 class="text-xs font-bold uppercase tracking-widest text-cyan-400 mb-4">The Solution</h3>
                                        <p class="text-white/60 leading-relaxed text-sm">${data.solution}</p>
                                    </div>
                                </section>

                                <section>
                                    <h2 class="text-xs uppercase tracking-[0.3em] font-bold text-white/30 mb-8 flex items-center gap-4">
                                        <div class="w-12 h-[1px] bg-white/10"></div>
                                        Key Insights
                                    </h2>
                                    <div class="grid md:grid-cols-2 gap-6">
                                        ${data.features.map(f => `
                                            <div class="flex items-start gap-4 p-6 glass-card bg-white/[0.02] border-none">
                                                <i data-lucide="check-circle-2" class="text-cyan-500 w-5 h-5 shrink-0"></i>
                                                <p class="text-white/80 text-sm">${f}</p>
                                            </div>
                                        `).join('')}
                                    </div>
                                </section>
                            </div>

                            <aside class="lg:col-span-4 space-y-8 sticky top-32 h-fit">
                                <div class="glass-card p-8 bg-black/20">
                                    <h3 class="font-bold mb-6 text-[10px] uppercase tracking-widest text-white/20">Project Credits</h3>
                                    <div class="flex flex-wrap gap-2">
                                        ${data.stack.map(s => `<span class="px-3 py-1 rounded-md bg-white/5 border border-white/10 text-[10px] text-white/60">${s}</span>`).join('')}
                                    </div>
                                </div>

                                <div class="glass-card p-8">
                                    <h3 class="font-bold mb-6 text-[10px] uppercase tracking-widest text-white/20">Performance</h3>
                                    <div class="space-y-6">
                                        ${Object.entries(data.stats).map(([k, v]) => `
                                            <div class="flex justify-between items-center group">
                                                <span class="text-white/30 text-[10px] uppercase tracking-tighter">${k.replace(/_/g, ' ')}</span>
                                                <span class="text-lg font-bold text-white group-hover:text-purple-400 transition-colors font-mono tracking-tighter">${v}</span>
                                            </div>
                                        `).join('')}
                                    </div>
                                </div>

                                <div class="p-8 glass-card border-none bg-gradient-to-br from-purple-500/10 to-transparent">
                                    <h3 class="font-bold mb-4 text-sm">Need a hand?</h3>
                                    <p class="text-white/40 text-xs mb-6 leading-relaxed">Let's discuss how we can build something similar for your business.</p>
                                    <a href="#contact" class="btn-primary w-full text-center py-3 text-xs close-project-link">Let's Talk</a>
                                </div>
                            </aside>
                        </div>
                    </div>
                `;
            }

            if (window.lucide) window.lucide.createIcons();

            if (projectPage) {
                projectPage.classList.remove('hidden');
                projectPage.classList.add('active');
            }
            document.body.style.overflow = 'hidden';

            setTimeout(() => {
                if (pageTransition) pageTransition.classList.remove('active');
            }, 300);
        }, 600);
    }

    // Lightbox Logic
    window.openLightbox = (src) => {
        const lb = document.createElement('div');
        lb.className = 'fixed inset-0 z-[10000] bg-black/95 flex items-center justify-center p-6 cursor-zoom-out animate-in fade-in duration-300';
        lb.innerHTML = `
            <button class="absolute top-6 right-6 text-white hover:text-purple-400 transition-colors z-[10001]" onclick="event.stopPropagation(); this.closest('div.fixed').remove()">
                <i data-lucide="x" class="w-8 h-8"></i>
            </button>
            <img src="${src}" class="max-w-full max-h-full rounded-xl shadow-2xl transition-transform duration-500 scale-95" id="lb-img">
        `;
        document.body.appendChild(lb);
        window.lucide.createIcons();
        setTimeout(() => lb.querySelector('img').style.transform = 'scale(1)', 10);
        lb.onclick = () => {
            lb.classList.add('animate-out', 'fade-out');
            setTimeout(() => lb.remove(), 300);
        };
    };

    function closeProject() {
        if (pageTransition) pageTransition.classList.add('active');
        
        setTimeout(() => {
            if (projectPage) {
                projectPage.classList.remove('active');
                projectPage.classList.add('hidden');
            }
            document.body.style.overflow = '';
            
            setTimeout(() => {
                if (pageTransition) pageTransition.classList.remove('active');
            }, 300);
        }, 600);
    }

    if (closeProjectBtn) {
        closeProjectBtn.addEventListener('click', closeProject);
    }

    // Handle links inside project page that should close it and scroll to main sections
    document.addEventListener('click', (e) => {
        const link = e.target.closest('.close-project-link');
        if (link && projectPage && !projectPage.classList.contains('hidden')) {
            const targetId = link.getAttribute('href');
            closeProject();
            
            // Allow time for project page to close before scrolling
            if (targetId && targetId.startsWith('#')) {
                setTimeout(() => {
                    const targetEl = document.querySelector(targetId);
                    if (targetEl) {
                        targetEl.scrollIntoView({ behavior: 'smooth' });
                    }
                }, 700);
            }
        }
    });

    // Initialize Lucide Icons
    lucide.createIcons();
});
