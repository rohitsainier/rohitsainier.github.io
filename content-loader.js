// content-loader.js - Renders content from data.js (with local file support)
(function() {
    'use strict';

    // ============================================
    // ASSET HELPER FUNCTIONS
    // ============================================
    
    /**
     * Get the appropriate image source (local takes priority over URL)
     * @param {Object} item - Object containing imageLocal and imageUrl
     * @returns {string|null} - Image source or null if none available
     */
    function getImageSource(item) {
        if (item.imageLocal && item.imageLocal.trim() !== '') {
            return item.imageLocal;
        }
        if (item.imageUrl && item.imageUrl.trim() !== '') {
            return item.imageUrl;
        }
        return null;
    }

    /**
     * Get the appropriate video source (local takes priority over URL)
     * @param {Object} item - Object containing videoLocal and videoUrl
     * @returns {string|null} - Video source or null if none available
     */
    function getVideoSource(item) {
        if (item.videoLocal && item.videoLocal.trim() !== '') {
            return item.videoLocal;
        }
        if (item.videoUrl && item.videoUrl.trim() !== '') {
            return item.videoUrl;
        }
        return null;
    }

    /**
     * Get the appropriate poster source (local takes priority over URL)
     * @param {Object} item - Object containing posterLocal and posterUrl
     * @returns {string} - Poster source or empty string
     */
    function getPosterSource(item) {
        if (item.posterLocal && item.posterLocal.trim() !== '') {
            return item.posterLocal;
        }
        if (item.posterUrl && item.posterUrl.trim() !== '') {
            return item.posterUrl;
        }
        return '';
    }

    /**
     * Check if a file exists (for local files)
     * Note: This only works client-side for already-loaded resources
     */
    function isValidSource(src) {
        return src && src.trim() !== '';
    }

    // ============================================
    // MAIN RENDER FUNCTION
    // ============================================

    function renderContent() {
        if (typeof siteData === 'undefined') {
            console.error('siteData not found. Make sure data.js is loaded first.');
            return;
        }

        const data = siteData;

        // Meta
        document.title = data.meta.title;

        // Navigation
        renderNavigation(data);

        // Hero
        renderHero(data);

        // Tech Marquee
        renderMarquee(data);

        // About
        renderAbout(data);

        // Experience
        renderExperience(data);

        // Projects (with image support)
        renderProjects(data);

        // Skills
        renderSkills(data);

        // Publications & Certifications
        renderPublications(data);

        // Contact
        renderContact(data);

        // Footer
        renderFooter(data);

        // iPhone Screens (with video support)
        renderIphoneScreens(data);

        console.log('Content loaded successfully!');
        
        // Dispatch custom event when content is ready
        document.dispatchEvent(new CustomEvent('contentLoaded', { detail: { data: data } }));
    }

    // ============================================
    // RENDER FUNCTIONS
    // ============================================

    function renderNavigation(data) {
        // Desktop Nav
        const navLinks = document.getElementById('nav-links');
        if (navLinks) {
            let html = '';
            data.navigation.forEach(item => {
                if (item.isPrimary) {
                    html += `<a href="${item.href}" class="magnetic-btn bg-gradient-to-r from-indigo-600 to-purple-600 px-6 py-2 rounded-full btn-shine hover-target">Let's Talk</a>`;
                } else {
                    html += `<a href="${item.href}" class="hover:text-indigo-400 transition-colors hover-target">${item.label}</a>`;
                }
            });
            navLinks.innerHTML = html;
        }

        // Mobile Nav
        const mobileNavLinks = document.getElementById('mobile-nav-links');
        if (mobileNavLinks) {
            let html = '';
            data.navigation.forEach(item => {
                if (!item.isPrimary) {
                    html += `<a href="${item.href}" class="hover:text-indigo-400 transition-colors mobile-link">${item.label}</a>`;
                }
            });
            mobileNavLinks.innerHTML = html;
        }

        // Logo
        const navLogo = document.getElementById('nav-logo');
        if (navLogo) navLogo.textContent = data.personal.initials;
    }

    function renderHero(data) {
        setText('hero-badge', data.hero.badge);
        setText('hero-greeting', data.hero.greeting);
        
        const heroName = document.getElementById('hero-name');
        if (heroName) {
            heroName.textContent = data.personal.name;
            heroName.setAttribute('data-text', data.personal.name);
        }

        setText('terminalText', data.personal.tagline);
        setHTML('hero-description', data.hero.description);

        // CTA Buttons
        const heroButtons = document.getElementById('hero-buttons');
        if (heroButtons) {
            heroButtons.innerHTML = `
                <a href="#work" class="magnetic-btn bg-gradient-to-r from-indigo-600 to-purple-600 px-8 py-4 rounded-full font-semibold btn-shine flex items-center gap-3 hover-target">
                    <span>View My Work</span>
                    <i class="fas fa-arrow-right"></i>
                </a>
                <a href="mailto:${data.personal.email}" class="magnetic-btn border border-gray-600 hover:border-indigo-500 px-8 py-4 rounded-full font-semibold transition-all hover-target">
                    <i class="fas fa-envelope mr-2"></i> Get In Touch
                </a>
            `;
        }

        // Social Links
        const heroSocial = document.getElementById('hero-social');
        if (heroSocial) {
            heroSocial.innerHTML = renderSocialLinks(data.social, 'w-12 h-12');
        }
    }

    function renderMarquee(data) {
        const marqueeContent = document.getElementById('marquee-content');
        if (!marqueeContent) return;

        let itemsHtml = '';
        data.techMarquee.forEach(tech => {
            itemsHtml += `
                <span class="text-2xl font-bold text-gray-600 flex items-center gap-3">
                    <i class="${tech.icon} ${tech.iconColor}"></i> ${tech.text}
                </span>
                <span class="text-gray-700">✦</span>
            `;
        });

        marqueeContent.innerHTML = `
            <div class="flex items-center gap-12 px-6">${itemsHtml}</div>
            <div class="flex items-center gap-12 px-6">${itemsHtml}</div>
        `;
    }

    function renderAbout(data) {
        setText('about-label', data.about.sectionLabel);
        setHTML('about-title', data.about.title);

        // Paragraphs
        const aboutText = document.getElementById('about-text');
        if (aboutText) {
            aboutText.innerHTML = data.about.paragraphs.map(p => 
                `<p class="text-gray-400 text-lg leading-relaxed mb-6">${p}</p>`
            ).join('');
        }

        // Stats
        const statsGrid = document.getElementById('statsGrid');
        if (statsGrid) {
            statsGrid.innerHTML = data.about.stats.map(stat => `
                <div class="text-center p-4 glass-card rounded-2xl">
                    <h3 class="text-3xl font-bold gradient-text ${stat.isCounter ? 'counter' : ''}" 
                        ${stat.isCounter ? `data-target="${stat.target}"` : ''}>
                        ${stat.isCounter ? '0+' : stat.value}
                    </h3>
                    <p class="text-gray-500 text-sm mt-1">${stat.label}</p>
                </div>
            `).join('');
        }

        // What I Do
        const whatIDoGrid = document.getElementById('what-i-do-grid');
        if (whatIDoGrid) {
            whatIDoGrid.innerHTML = data.about.whatIDo.map(item => `
                <div class="flex items-start gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-900/50 transition-colors hover-target">
                    <div class="w-12 h-12 ${item.iconBg} rounded-xl flex items-center justify-center shrink-0">
                        <i class="${item.icon} ${item.iconColor} text-xl"></i>
                    </div>
                    <div>
                        <h4 class="font-semibold mb-1">${item.title}</h4>
                        <p class="text-sm text-gray-400">${item.description}</p>
                    </div>
                </div>
            `).join('');
        }
    }

    function renderExperience(data) {
        setText('exp-label', data.experience.sectionLabel);
        setHTML('exp-title', data.experience.title);

        // Jobs
        const expContainer = document.getElementById('experience-container');
        if (expContainer) {
            expContainer.innerHTML = data.experience.jobs.map(job => `
                <div class="timeline-item reveal-section">
                    <div class="glass-card rounded-2xl p-8 hover-target">
                        <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                            <div>
                                <h3 class="text-2xl font-bold gradient-text">${job.company}</h3>
                                <p class="text-lg text-gray-300">${job.role}</p>
                            </div>
                            <div class="mt-2 md:mt-0">
                                <span class="px-4 py-2 ${job.durationColor} rounded-full text-sm">${job.duration}</span>
                            </div>
                        </div>
                        <p class="text-gray-500 mb-4"><i class="fas fa-map-marker-alt mr-2"></i>${job.location}</p>
                        <ul class="space-y-3 text-gray-400">
                            ${job.achievements.map(a => `
                                <li class="flex items-start gap-3">
                                    <i class="fas fa-check-circle text-green-500 mt-1"></i>
                                    <span>${a}</span>
                                </li>
                            `).join('')}
                        </ul>
                    </div>
                </div>
            `).join('');
        }

        // Education
        const eduContainer = document.getElementById('education-container');
        if (eduContainer) {
            const edu = data.experience.education;
            eduContainer.innerHTML = `
                <div class="glass-card rounded-2xl p-8 hover-target">
                    <div class="flex items-center gap-4 mb-4">
                        <div class="w-14 h-14 bg-indigo-500/20 rounded-xl flex items-center justify-center">
                            <i class="fas fa-graduation-cap text-2xl text-indigo-400"></i>
                        </div>
                        <div>
                            <h3 class="text-xl font-bold">${edu.degree}</h3>
                            <p class="text-gray-400">${edu.institution}</p>
                        </div>
                    </div>
                    <p class="text-gray-500"><i class="fas fa-calendar mr-2"></i>${edu.duration}</p>
                </div>
            `;
        }
    }

    // UPDATED: renderProjects with local/URL image support
    function renderProjects(data) {
        setText('proj-label', data.projects.sectionLabel);
        setHTML('proj-title', data.projects.title);

        const projectsGrid = document.getElementById('projectsGrid');
        if (projectsGrid) {
            console.log('Rendering projects:', data.projects.items.length);
            
            const projectsHTML = data.projects.items.map((project, index) => {
                // Get image source (local takes priority)
                const imageSrc = getImageSource(project);
                const hasImage = isValidSource(imageSrc);
                
                return `
                    <div class="project-card tilt-card relative glass-card rounded-2xl overflow-hidden hover-target group" data-project="${project.id}">
                        <!-- Image/Gradient Header -->
                        <div class="h-56 relative overflow-hidden">
                            ${hasImage ? `
                                <!-- Project Image -->
                                <img 
                                    src="${imageSrc}" 
                                    alt="${project.title}"
                                    class="project-image w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                    loading="lazy"
                                    onerror="handleImageError(this, '${project.gradient}', '${project.icon}')"
                                />
                                <!-- Fallback gradient (hidden by default, shown on error) -->
                                <div class="image-fallback absolute inset-0 bg-gradient-to-br ${project.gradient} hidden items-center justify-center">
                                    <i class="${project.icon} text-6xl text-white/50"></i>
                                </div>
                            ` : `
                                <!-- Gradient Background if no image -->
                                <div class="absolute inset-0 bg-gradient-to-br ${project.gradient} flex items-center justify-center">
                                    <i class="${project.icon} text-6xl text-white/50"></i>
                                </div>
                            `}
                            
                            <!-- Overlay -->
                            <div class="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent"></div>
                            
                            <!-- Loading indicator -->
                            ${hasImage ? `
                                <div class="image-loader absolute inset-0 bg-gradient-to-br ${project.gradient} flex items-center justify-center">
                                    <div class="loading-spinner"></div>
                                </div>
                            ` : ''}
                            
                            <!-- Top Content -->
                            <div class="absolute top-0 left-0 right-0 p-6 flex justify-between items-start z-10">
                                <div class="w-14 h-14 bg-white/20 backdrop-blur-md rounded-2xl flex items-center justify-center">
                                    <i class="${project.icon} text-2xl text-white"></i>
                                </div>
                                <div class="flex gap-2 flex-wrap justify-end">
                                    ${project.tags.map(tag => `
                                        <span class="px-3 py-1 bg-white/20 backdrop-blur-md rounded-full text-xs text-white">${tag}</span>
                                    `).join('')}
                                </div>
                            </div>
                            
                            <!-- Bottom Content (on image) -->
                            <div class="absolute bottom-0 left-0 right-0 p-6 z-10">
                                <h3 class="text-2xl font-bold text-white mb-1">${project.title}</h3>
                                <p class="text-white/70 text-sm">${project.subtitle}</p>
                            </div>
                        </div>
                        
                        <!-- Card Body -->
                        <div class="p-6">
                            <p class="text-gray-400 text-sm mb-4">${project.description}</p>
                            <div class="flex items-center justify-between">
                                <div class="flex items-center gap-2 ${project.metric.color} text-sm">
                                    <i class="${project.metric.icon}"></i>
                                    <span>${project.metric.text}</span>
                                </div>
                                <a href="${project.link}" target="_blank" 
                                   class="w-10 h-10 ${project.linkBg} ${project.linkHover} rounded-full flex items-center justify-center transition-all duration-300 hover:scale-110">
                                    <i class="${project.linkIcon} ${project.linkColor}"></i>
                                </a>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
            
            projectsGrid.innerHTML = projectsHTML;
            
            // Initialize image loading handlers
            initImageLoadHandlers();
            
            console.log('Projects rendered, total count in DOM:', projectsGrid.children.length);
        }
    }

    // Image loading handlers
    function initImageLoadHandlers() {
        const images = document.querySelectorAll('.project-image');
        images.forEach(img => {
            const loader = img.parentElement.querySelector('.image-loader');
            
            // When image loads successfully
            img.addEventListener('load', function() {
                if (loader) {
                    loader.style.display = 'none';
                }
                this.style.opacity = '1';
            });
            
            // Initial state
            img.style.opacity = '0';
            img.style.transition = 'opacity 0.3s ease';
        });
    }

    // Global function for image error handling
    window.handleImageError = function(img, gradient, icon) {
        // Hide the broken image
        img.style.display = 'none';
        
        // Show the fallback
        const fallback = img.nextElementSibling;
        if (fallback && fallback.classList.contains('image-fallback')) {
            fallback.classList.remove('hidden');
            fallback.classList.add('flex');
        }
        
        // Hide loader if present
        const loader = img.parentElement.querySelector('.image-loader');
        if (loader) {
            loader.style.display = 'none';
        }
        
        console.warn(`Image failed to load: ${img.src}`);
    };

    function renderSkills(data) {
        setText('skills-label', data.skills.sectionLabel);
        setHTML('skills-title', data.skills.title);

        const skillsContainer = document.getElementById('skills-container');
        if (skillsContainer) {
            skillsContainer.innerHTML = data.skills.categories.map(category => `
                <div class="mb-12 reveal-section">
                    <h3 class="text-xl font-bold mb-6 text-center ${category.titleColor}">${category.name}</h3>
                    <div class="flex flex-wrap justify-center gap-4">
                        ${category.items.map(skill => `
                            <div class="skill-pill px-6 py-4 glass-card rounded-2xl flex items-center gap-3 hover-target">
                                <i class="${skill.icon} text-3xl ${skill.iconColor}"></i>
                                <div>
                                    <p class="font-semibold">${skill.name}</p>
                                    <p class="text-xs text-gray-500">${skill.level}</p>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `).join('');
        }
    }

    function renderPublications(data) {
        const pubContainer = document.getElementById('publications-container');
        if (pubContainer) {
            pubContainer.innerHTML = data.publications.map(pub => `
                <a href="${pub.link}" target="_blank" 
                   class="flex items-center gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-900/50 transition-colors">
                    <div class="w-12 h-12 ${pub.iconBg} rounded-xl flex items-center justify-center">
                        <i class="${pub.icon} text-2xl ${pub.iconColor}"></i>
                    </div>
                    <div>
                        <p class="font-semibold">${pub.platform}</p>
                        <p class="text-sm text-gray-400">${pub.handle}</p>
                    </div>
                    <i class="fas fa-external-link-alt ml-auto text-gray-500"></i>
                </a>
            `).join('');
        }

        const certContainer = document.getElementById('certifications-container');
        if (certContainer) {
            certContainer.innerHTML = data.certifications.map(cert => `
                <div class="p-4 bg-gray-900/30 rounded-xl">
                    <div class="flex items-center gap-3 mb-2">
                        <i class="${cert.icon} ${cert.iconColor}"></i>
                        <p class="font-semibold">${cert.title}</p>
                    </div>
                    <p class="text-sm text-gray-400">${cert.description}</p>
                </div>
            `).join('');
        }
    }

    function renderContact(data) {
        setText('contact-label', data.contact.sectionLabel);
        setHTML('contact-title', data.contact.title);
        setText('contact-description', data.contact.description);

        const contactCards = document.getElementById('contactCards');
        if (contactCards) {
            contactCards.innerHTML = data.contact.cards.map(card => `
                <a href="${card.href}" ${card.type === 'linkedin' ? 'target="_blank"' : ''} 
                   class="glass-card rounded-2xl p-6 text-center ${card.hoverBg} transition-all hover-target">
                    <div class="w-16 h-16 ${card.iconBg} rounded-2xl flex items-center justify-center mx-auto mb-4">
                        <i class="${card.icon} text-2xl ${card.iconColor}"></i>
                    </div>
                    <h3 class="font-semibold mb-1">${card.title}</h3>
                    <p class="text-gray-500 text-sm">${card.value}</p>
                </a>
            `).join('');
        }

        const projectTypeSelect = document.getElementById('project-type-select');
        if (projectTypeSelect) {
            projectTypeSelect.innerHTML = data.contact.projectTypes.map(type => 
                `<option>${type}</option>`
            ).join('');
        }
    }

    function renderFooter(data) {
        setText('footer-logo', data.personal.initials);
        setText('footer-copyright', data.footer.copyright);
        
        const footerBuilt = document.getElementById('footer-built');
        if (footerBuilt) {
            footerBuilt.innerHTML = `${data.footer.builtWith} <i class="fas fa-heart text-red-500"></i> ${data.footer.location} 🇮🇳`;
        }

        const footerSocial = document.getElementById('footer-social');
        if (footerSocial) {
            footerSocial.innerHTML = renderSocialLinks(data.social, 'w-10 h-10');
        }
    }

    // UPDATED: renderIphoneScreens with local/URL video support
    function renderIphoneScreens(data) {
        const appCarousel = document.getElementById('appCarousel');
        const carouselDotsContainer = document.getElementById('carouselDots');
        
        if (appCarousel && data.iphoneScreens) {
            const screenCount = data.iphoneScreens.length;
            console.log('Rendering iPhone screens with videos:', screenCount);
            
            // Render video screens
            appCarousel.innerHTML = data.iphoneScreens.map((screen, index) => {
                if (screen.type === 'video') {
                    // Get video and poster sources (local takes priority)
                    const videoSrc = getVideoSource(screen);
                    const posterSrc = getPosterSource(screen);
                    const hasVideo = isValidSource(videoSrc);
                    
                    if (!hasVideo) {
                        // No video available, show poster or gradient fallback
                        return `
                            <div class="app-screen video-screen" data-index="${index}">
                                ${posterSrc ? `
                                    <img 
                                        src="${posterSrc}" 
                                        alt="${screen.title}"
                                        class="w-full h-full object-cover rounded-[35px]"
                                        onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';"
                                    />
                                ` : ''}
                                <div class="absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex flex-col items-center justify-center rounded-[35px] ${posterSrc ? 'hidden' : ''}">
                                    <i class="fas fa-video-slash text-4xl text-white/30 mb-4"></i>
                                    <p class="text-white/50 text-sm">Video not available</p>
                                </div>
                                <div class="video-overlay">
                                    <div class="video-info">
                                        <h3 class="text-sm font-bold text-white">${screen.title}</h3>
                                        <p class="text-xs text-white/70">${screen.subtitle}</p>
                                    </div>
                                </div>
                            </div>
                        `;
                    }
                    
                    return `
                        <div class="app-screen video-screen" data-index="${index}">
                            <!-- Video Loading Indicator -->
                            <div class="video-loader absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 flex items-center justify-center rounded-[35px] z-5">
                                <div class="loading-spinner"></div>
                            </div>
                            
                            <video 
                                class="iphone-video"
                                src="${videoSrc}"
                                poster="${posterSrc}"
                                loop
                                playsinline
                                preload="metadata"
                                onerror="handleVideoError(this, ${index})"
                                onloadeddata="handleVideoLoaded(this)"
                            ></video>
                            
                            <!-- Video Error Fallback -->
                            <div class="video-error-fallback absolute inset-0 bg-gradient-to-br from-indigo-900 to-purple-900 hidden flex-col items-center justify-center rounded-[35px]">
                                ${posterSrc ? `
                                    <img 
                                        src="${posterSrc}" 
                                        alt="${screen.title}"
                                        class="w-full h-full object-cover rounded-[35px] absolute inset-0"
                                    />
                                    <div class="absolute inset-0 bg-black/50 rounded-[35px]"></div>
                                ` : ''}
                                <i class="fas fa-exclamation-triangle text-3xl text-yellow-500 mb-2 relative z-10"></i>
                                <p class="text-white/70 text-xs relative z-10">Video unavailable</p>
                            </div>
                            
                            <div class="video-overlay">
                                <div class="video-info">
                                    <h3 class="text-sm font-bold text-white">${screen.title}</h3>
                                    <p class="text-xs text-white/70">${screen.subtitle}</p>
                                </div>
                            </div>
                            <button class="video-play-btn" aria-label="Play video">
                                <i class="fas fa-play"></i>
                            </button>
                        </div>
                    `;
                } else {
                    // Fallback for non-video screens (legacy support)
                    return `
                        <div class="app-screen bg-gradient-to-br ${screen.gradient || 'from-indigo-900 to-purple-900'}" data-index="${index}">
                            <div class="text-center pt-10">
                                <i class="${screen.icon} text-5xl ${screen.iconColor} mb-4"></i>
                                <h3 class="text-lg font-bold mb-2">${screen.title}</h3>
                                <p class="text-xs text-gray-300 mb-4">${screen.subtitle}</p>
                                ${screen.content || ''}
                            </div>
                        </div>
                    `;
                }
            }).join('');
            
            // Render dots dynamically
            if (carouselDotsContainer) {
                carouselDotsContainer.innerHTML = data.iphoneScreens.map((_, index) => `
                    <button class="carousel-dot w-2 h-2 rounded-full ${index === 0 ? 'bg-white' : 'bg-white/30'} transition-all" data-index="${index}"></button>
                `).join('');
            }
            
            // Store screen count for carousel logic
            window.carouselScreenCount = screenCount;
            
            console.log('iPhone screens rendered');
        }
    }

    // Global video error handler
    window.handleVideoError = function(video, index) {
        console.warn(`Video failed to load at index ${index}: ${video.src}`);
        
        const screen = video.closest('.video-screen');
        if (screen) {
            // Hide video
            video.style.display = 'none';
            
            // Hide loader
            const loader = screen.querySelector('.video-loader');
            if (loader) loader.style.display = 'none';
            
            // Show error fallback
            const fallback = screen.querySelector('.video-error-fallback');
            if (fallback) {
                fallback.classList.remove('hidden');
                fallback.classList.add('flex');
            }
            
            // Hide play button
            const playBtn = screen.querySelector('.video-play-btn');
            if (playBtn) playBtn.style.display = 'none';
        }
    };

    // Global video loaded handler
    window.handleVideoLoaded = function(video) {
        const screen = video.closest('.video-screen');
        if (screen) {
            // Hide loader
            const loader = screen.querySelector('.video-loader');
            if (loader) {
                loader.style.opacity = '0';
                setTimeout(() => {
                    loader.style.display = 'none';
                }, 300);
            }
        }
    };

    // ============================================
    // HELPER FUNCTIONS
    // ============================================

    function setText(id, text) {
        const el = document.getElementById(id);
        if (el) el.textContent = text;
    }

    function setHTML(id, html) {
        const el = document.getElementById(id);
        if (el) el.innerHTML = html;
    }

    function renderSocialLinks(social, sizeClass) {
        const links = [
            { key: 'github', icon: 'fab fa-github' },
            { key: 'linkedin', icon: 'fab fa-linkedin' },
            { key: 'youtube', icon: 'fab fa-youtube' },
            { key: 'medium', icon: 'fab fa-medium' }
        ];

        return links.map(({ key, icon }) => `
            <a href="${social[key]}" target="_blank" 
               class="${sizeClass} glass-card rounded-full flex items-center justify-center hover:bg-indigo-500/20 transition-all hover-target">
                <i class="${icon} text-xl"></i>
            </a>
        `).join('');
    }

    // Run when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', renderContent);
    } else {
        renderContent();
    }
})();