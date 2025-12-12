// data.js - All content data (Merged)
const siteData = {
    meta: {
        title: "Rohit Saini | AI + iOS Engineer"
    },
    personal: {
        name: "Rohit Saini",
        initials: "RS.",
        title: "Principal AI Engineer",
        tagline: "Principal AI Engineer | ComfyUI & N8N Expert",
        location: "India",
        yearsExperience: "8+",
        email: "rohitsainier@gmail.com",
        phone: "+918708584615",
        phoneDisplay: "+91 8708584615"
    },
    social: {
        github: "https://github.com/rohitsainier",
        linkedin: "https://www.linkedin.com/in/rohitsainier/",
        youtube: "https://www.youtube.com/@rohitsainier",
        medium: "https://medium.com/@rohitsainier"
    },
    navigation: [
        { label: "About", href: "#about" },
        { label: "Experience", href: "#experience" },
        { label: "Projects", href: "#work" },
        { label: "Skills", href: "#skills" },
        { label: "Contact", href: "#contact", isPrimary: true }
    ],
    hero: {
        badge: "🚀 8+ Years Experience | India",
        greeting: "Hello, I'm",
        description: `Building <span class="text-white font-semibold">scalable mobile apps</span> and
            <span class="text-white font-semibold">AI-driven creative automation systems</span>.
            Bridging the worlds of mobile development and generative AI for media and content innovation.`,
        floatingTags: [
            { icon: "fab fa-swift", text: "Swift", color: "orange-500" },
            { icon: "fas fa-brain", text: "ComfyUI", color: "purple-500" },
            { icon: "fas fa-robot", text: "Whisper", color: "pink-500" }
        ]
    },
    techMarquee: [
        { icon: "fab fa-swift", text: "Swift", iconColor: "text-orange-500" },
        { icon: "fab fa-apple", text: "SwiftUI", iconColor: "text-white" },
        { icon: "fas fa-brain", text: "ComfyUI", iconColor: "text-purple-500" },
        { icon: "fas fa-robot", text: "N8N", iconColor: "text-blue-500" },
        { icon: "fas fa-image", text: "Stable Diffusion", iconColor: "text-green-500" },
        { icon: "fas fa-microphone", text: "Whisper", iconColor: "text-pink-500" },
        { icon: "fab fa-python", text: "Python", iconColor: "text-yellow-500" },
        { icon: "fas fa-fire", text: "Firebase", iconColor: "text-orange-600" }
    ],
    about: {
        sectionLabel: "// ABOUT ME",
        title: `Bridging <span class="gradient-text">iOS & Generative AI</span> for Innovation`,
        paragraphs: [
            "I'm a Principal AI Engineer with 8+ years of experience building scalable mobile apps and AI-driven creative automation systems. I specialize in ComfyUI and N8N, creating custom nodes and optimizing workflows for cutting-edge media production.",
            "From building Virtual AI Anchors at India Today Group to migrating high-traffic retail apps to SwiftUI at Carrefour (10M+ users), I transform complex technologies into seamless user experiences that drive real business impact."
        ],
        stats: [
            { value: "8+", label: "Years Exp.", isCounter: true, target: 8 },
            { value: "15+", label: "Projects", isCounter: true, target: 15 },
            { value: "10M+", label: "Users Served", isCounter: false },
            { value: "$45M", label: "Funding POC", isCounter: false }
        ],
        whatIDo: [
            {
                icon: "fas fa-user-tie",
                iconBg: "bg-red-500/20",
                iconColor: "text-red-500",
                title: "AI Anchors & Avatars",
                description: "Virtual presenters, AI news anchors, TTS integration"
            },
            {
                icon: "fab fa-swift",
                iconBg: "bg-orange-500/20",
                iconColor: "text-orange-500",
                title: "iOS Development",
                description: "Swift, SwiftUI, UIKit, Combine, MVVM"
            },
            {
                icon: "fas fa-brain",
                iconBg: "bg-purple-500/20",
                iconColor: "text-purple-500",
                title: "AI & ComfyUI",
                description: "Custom nodes, Stable Diffusion, Whisper, TTS"
            },
            {
                icon: "fas fa-robot",
                iconBg: "bg-blue-500/20",
                iconColor: "text-blue-500",
                title: "Workflow Automation",
                description: "N8N, Graph automation, Text-to-Video pipelines"
            },
            {
                icon: "fas fa-video",
                iconBg: "bg-pink-500/20",
                iconColor: "text-pink-500",
                title: "Real-time Streaming",
                description: "WebRTC, Screen streaming, Remote device control"
            }
        ]
    },
    experience: {
        sectionLabel: "// EXPERIENCE",
        title: `Professional <span class="gradient-text">Journey</span>`,
        jobs: [
            {
                company: "India Today Group",
                role: "Principal AI Engineer",
                duration: "Present",
                durationColor: "bg-red-500/20 text-red-400",
                location: "New Delhi, India",
                achievements: [
                    `Architected and deployed <span class="text-white font-semibold">Virtual AI Anchor</span> system capable of presenting news autonomously, reducing anchor dependency by <span class="text-white font-semibold">60%</span> for routine bulletins`,
                    `Built <span class="text-white font-semibold">Newspaper & Magazine Builder</span> that analyzes existing templates using AI/ML, automating layout generation and reducing manual design effort by <span class="text-white font-semibold">70%</span>`,
                    `Developed <span class="text-white font-semibold">H2V (Horizontal to Vertical)</span> video conversion system with intelligent speaker focus tracking, supporting multiple templates and reducing video repurposing time by <span class="text-white font-semibold">80%</span>`,
                    `Enabled content team to produce <span class="text-white font-semibold">3x more</span> social media-ready vertical videos per day through automated H2V pipeline`,
                    `Integrated TTS and lip-sync technologies achieving <span class="text-white font-semibold">95%+</span> natural speech accuracy for AI-generated news presentations`
                ]
            },
            {
                company: "Majid Al Futtaim",
                role: "Senior iOS Engineer",
                duration: "Mar 2022 – Present",
                durationColor: "bg-indigo-500/20 text-indigo-400",
                location: "Gurgaon, India",
                achievements: [
                    `Migrated Cart, Checkout, and Post-Order Journeys to SwiftUI, reducing UI maintenance time by <span class="text-white font-semibold">30%</span> for Carrefour's retail app (10M+ users)`,
                    `Delivered pixel-perfect UI for high-traffic commerce flows, contributing to a <span class="text-white font-semibold">15% increase</span> in conversion rates`,
                    `Championed adoption of Combine, reducing state management bugs by <span class="text-white font-semibold">40%</span>`,
                    `Mentored 3 junior iOS developers, improving code quality by <span class="text-white font-semibold">25%</span>`
                ]
            },
            {
                company: "LambdaTest",
                role: "Senior iOS Engineer",
                duration: "May 2021 – Feb 2022",
                durationColor: "bg-purple-500/20 text-purple-400",
                location: "Noida, India",
                achievements: [
                    `Delivered POC for streaming iOS device screen to web browser using WebRTC, contributing to a <span class="text-white font-semibold">$45M funding round</span>`,
                    `Developed iOS App Resigner reducing session startup time by <span class="text-white font-semibold">25%</span>`,
                    `Built iOS session restoration POC, improving user retention by <span class="text-white font-semibold">10%</span>`,
                    `Automated daily tasks with Bash scripts and XCUITest, reducing manual effort by <span class="text-white font-semibold">40%</span>`
                ]
            },
            {
                company: "AppKnit",
                role: "Senior iOS Developer",
                duration: "Jul 2018 – Apr 2021",
                durationColor: "bg-pink-500/20 text-pink-400",
                location: "Chandigarh, India",
                achievements: [
                    `Led, Developed & Deployed <span class="text-white font-semibold">10+ projects</span> end to end`,
                    `Onboarded junior developers, increasing team velocity by <span class="text-white font-semibold">15%</span>`,
                    `Refactored core codebase, reducing memory consumption by <span class="text-white font-semibold">30%</span>`
                ]
            }
        ],
        education: {
            degree: "Bachelor's in Information Technology",
            institution: "Kurukshetra University, Kurukshetra",
            duration: "Jul 2013 – Jun 2017"
        }
    },
    projects: {
        sectionLabel: "// FEATURED PROJECTS",
        title: `Apps That <span class="gradient-text">Make a Difference</span>`,
        items: [
            {
                id: "virtual-ai-anchor",
                title: "Virtual AI Anchor",
                subtitle: "AI News Presenter System",
                description: "Built AI-powered virtual anchor system for India Today Group that can autonomously present news with natural speech and expressions.",
                gradient: "from-red-600 to-orange-700",
                icon: "fas fa-user-tie",
                tags: ["AI/ML", "TTS", "Lip-Sync"],
                metric: { icon: "fas fa-microphone-alt", text: "60% less anchor dependency", color: "text-red-400" },
                link: "#",
                linkIcon: "fas fa-play",
                linkColor: "text-red-400",
                linkBg: "bg-red-500/20",
                linkHover: "hover:bg-red-500/40"
            },
            {
                id: "newspaper-builder",
                title: "Newspaper Builder",
                subtitle: "AI Template Analysis & Generation",
                description: "Automated newspaper and magazine layout system that analyzes existing templates using AI/ML to generate new layouts automatically.",
                gradient: "from-amber-600 to-yellow-700",
                icon: "fas fa-newspaper",
                tags: ["AI/ML", "Automation"],
                metric: { icon: "fas fa-clock", text: "70% effort reduction", color: "text-amber-400" },
                link: "#",
                linkIcon: "fas fa-arrow-right",
                linkColor: "text-amber-400",
                linkBg: "bg-amber-500/20",
                linkHover: "hover:bg-amber-500/40"
            },
            {
                id: "h2v-converter",
                title: "H2V Video Converter",
                subtitle: "Smart Horizontal to Vertical",
                description: "Intelligent video conversion system with speaker focus tracking and multiple templates for social media-ready vertical content.",
                gradient: "from-cyan-600 to-blue-700",
                icon: "fas fa-mobile-screen",
                tags: ["ComfyUI", "FFmpeg"],
                metric: { icon: "fas fa-bolt", text: "80% faster conversion", color: "text-cyan-400" },
                link: "#",
                linkIcon: "fas fa-play",
                linkColor: "text-cyan-400",
                linkBg: "bg-cyan-500/20",
                linkHover: "hover:bg-cyan-500/40"
            },
            {
                id: "ai-subtitle-clipper",
                title: "AI Subtitle Clipper",
                subtitle: "MacOS Video Editing Tool",
                description: "Built using Python + macOS native APIs, integrating Whisper AI for highly accurate subtitle transcription. Saves 2-3 hours per video.",
                gradient: "from-purple-600 to-pink-700",
                icon: "fas fa-closed-captioning",
                tags: ["Whisper", "macOS"],
                metric: { icon: "fas fa-clock", text: "2-3 hrs saved/video", color: "text-purple-400" },
                link: "https://www.youtube.com/watch?v=sFUcKSDLl0s",
                linkIcon: "fas fa-play",
                linkColor: "text-purple-400",
                linkBg: "bg-purple-500/20",
                linkHover: "hover:bg-purple-500/40"
            },
            {
                id: "ghibli-generator",
                title: "Ghibli Generator",
                subtitle: "Custom ComfyUI Node + FastAPI",
                description: "Custom ComfyUI node for Ghibli-style visuals using local Stable Diffusion. FastAPI UI for style control. Fully offline-capable.",
                gradient: "from-green-600 to-teal-700",
                icon: "fas fa-palette",
                tags: ["ComfyUI", "FastAPI"],
                metric: { icon: "fas fa-wifi-slash", text: "Fully Offline", color: "text-green-400" },
                link: "https://youtu.be/uLCA_WXkIkY?si=7_jEyuuLSK7FS2Sg",
                linkIcon: "fas fa-play",
                linkColor: "text-green-400",
                linkBg: "bg-green-500/20",
                linkHover: "hover:bg-green-500/40"
            },
            {
                id: "carrefour-uae",
                title: "Carrefour UAE",
                subtitle: "High-traffic Retail App",
                description: "Led Post Order, Cart Checkout, and Order Confirmation squad. Migrated from UIKit to SwiftUI for modern, maintainable UI.",
                gradient: "from-blue-600 to-cyan-700",
                icon: "fas fa-shopping-cart",
                tags: ["SwiftUI", "Combine"],
                metric: { icon: "fas fa-users", text: "10M+ users", color: "text-blue-400" },
                link: "https://apps.apple.com/us/app/maf-carrefour-online-shopping/id626805470",
                linkIcon: "fab fa-app-store",
                linkColor: "text-blue-400",
                linkBg: "bg-blue-500/20",
                linkHover: "hover:bg-blue-500/40"
            },
            {
                id: "ltapp",
                title: "LTApp",
                subtitle: "iOS Device Streaming",
                description: "Stream iOS device screen to web browser using WebRTC data channels. Remote device control capabilities.",
                gradient: "from-orange-600 to-red-700",
                icon: "fas fa-mobile-screen",
                tags: ["WebRTC", "MVVM"],
                metric: { icon: "fas fa-trophy", text: "$45M Funding POC", color: "text-orange-400" },
                link: "https://applive.lambdatest.com/app",
                linkIcon: "fas fa-arrow-right",
                linkColor: "text-orange-400",
                linkBg: "bg-orange-500/20",
                linkHover: "hover:bg-orange-500/40"
            },
            {
                id: "text-to-video",
                title: "Text-to-Video Workflows",
                subtitle: "AI Content Automation",
                description: "Automated content pipelines using N8N and ComfyUI for text-to-video generation with TTS (f5) integration.",
                gradient: "from-violet-600 to-purple-700",
                icon: "fas fa-video",
                tags: ["N8N", "TTS"],
                metric: { icon: "fas fa-robot", text: "Full Automation", color: "text-violet-400" },
                link: "#",
                linkIcon: "fas fa-arrow-right",
                linkColor: "text-violet-400",
                linkBg: "bg-violet-500/20",
                linkHover: "hover:bg-violet-500/40"
            },
            {
                id: "more-projects",
                title: "More Projects",
                subtitle: "End-to-end Deployments",
                description: "Led, developed & deployed 10+ projects end to end at AppKnit with various tech stacks and domains.",
                gradient: "from-gray-700 to-gray-900",
                icon: "fas fa-folder-open",
                tags: ["10+ Apps"],
                metric: { icon: "fas fa-code-branch", text: "Full Stack", color: "text-gray-400" },
                link: "https://github.com/rohitsainier",
                linkIcon: "fab fa-github",
                linkColor: "text-gray-400",
                linkBg: "bg-gray-500/20",
                linkHover: "hover:bg-gray-500/40"
            }
        ]
    },
    skills: {
        sectionLabel: "// SKILLS & TOOLS",
        title: `My <span class="gradient-text">Tech Arsenal</span>`,
        categories: [
            {
                name: "AI & ComfyUI",
                titleColor: "text-indigo-400",
                items: [
                    { icon: "fas fa-brain", iconColor: "text-purple-500", name: "ComfyUI", level: "Custom Nodes" },
                    { icon: "fas fa-robot", iconColor: "text-blue-500", name: "N8N", level: "Workflow Automation" },
                    { icon: "fas fa-image", iconColor: "text-green-500", name: "Stable Diffusion", level: "Image Generation" },
                    { icon: "fas fa-microphone", iconColor: "text-pink-500", name: "Whisper", level: "Speech Recognition" },
                    { icon: "fas fa-volume-up", iconColor: "text-cyan-500", name: "TTS (f5)", level: "Text-to-Speech" },
                    { icon: "fas fa-user-tie", iconColor: "text-red-500", name: "AI Avatars", level: "Virtual Anchors" }
                ]
            },
            {
                name: "Languages & Frameworks",
                titleColor: "text-orange-400",
                items: [
                    { icon: "fab fa-swift", iconColor: "text-orange-500", name: "Swift", level: "Expert" },
                    { icon: "fab fa-apple", iconColor: "text-white", name: "SwiftUI", level: "Expert" },
                    { icon: "fab fa-python", iconColor: "text-yellow-500", name: "Python", level: "Advanced" },
                    { icon: "fas fa-mobile-alt", iconColor: "text-blue-400", name: "UIKit", level: "Expert" },
                    { icon: "fas fa-broadcast-tower", iconColor: "text-red-500", name: "WebRTC", level: "Advanced" },
                    { icon: "fas fa-fire", iconColor: "text-orange-600", name: "Firebase", level: "Advanced" },
                    { icon: "fas fa-project-diagram", iconColor: "text-pink-400", name: "GraphQL", level: "Advanced" },
                    { icon: "fas fa-rocket", iconColor: "text-indigo-400", name: "Fastlane", level: "Advanced" }
                ]
            },
            {
                name: "Media & Video Processing",
                titleColor: "text-cyan-400",
                items: [
                    { icon: "fas fa-film", iconColor: "text-red-500", name: "FFmpeg", level: "Advanced" },
                    { icon: "fas fa-video", iconColor: "text-purple-500", name: "Video AI", level: "H2V, Editing" },
                    { icon: "fas fa-newspaper", iconColor: "text-amber-500", name: "Layout AI", level: "Template Analysis" },
                    { icon: "fas fa-lips", iconColor: "text-pink-500", name: "Lip Sync", level: "AI Integration" }
                ]
            },
            {
                name: "Testing & Automation",
                titleColor: "text-green-400",
                items: [
                    { icon: "fas fa-vial", iconColor: "text-green-500", name: "TDD", level: "Expert" },
                    { icon: "fas fa-check-double", iconColor: "text-blue-500", name: "XCUITest", level: "Advanced" },
                    { icon: "fas fa-terminal", iconColor: "text-gray-400", name: "Bash", level: "Advanced" },
                    { icon: "fas fa-sync-alt", iconColor: "text-purple-500", name: "CI/CD", level: "Advanced" },
                    { icon: "fab fa-git-alt", iconColor: "text-orange-500", name: "Git", level: "Expert" }
                ]
            },
            {
                name: "Collaboration & Leadership",
                titleColor: "text-yellow-400",
                items: [
                    { icon: "fas fa-users", iconColor: "text-yellow-500", name: "Cross-functional", level: "Collaboration" },
                    { icon: "fas fa-code-branch", iconColor: "text-cyan-500", name: "Code Reviews", level: "Best Practices" },
                    { icon: "fas fa-chalkboard-teacher", iconColor: "text-pink-500", name: "Mentorship", level: "Team Growth" }
                ]
            }
        ]
    },
    publications: [
        {
            platform: "Medium",
            handle: "@rohitsainier",
            icon: "fab fa-medium",
            iconBg: "bg-green-500/20",
            iconColor: "text-green-400",
            link: "https://medium.com/@rohitsainier"
        },
        {
            platform: "YouTube",
            handle: "@rohitsainier",
            icon: "fab fa-youtube",
            iconBg: "bg-red-500/20",
            iconColor: "text-red-400",
            link: "https://www.youtube.com/@rohitsainier"
        }
    ],
    certifications: [
        {
            icon: "fas fa-award",
            iconColor: "text-yellow-500",
            title: "NPTEL C Language",
            description: "IIT Kanpur Certification"
        },
        {
            icon: "fas fa-language",
            iconColor: "text-blue-500",
            title: "Languages",
            description: "English, Hindi"
        },
        {
            icon: "fas fa-heart",
            iconColor: "text-pink-500",
            title: "Interests",
            description: "Singing, Fitness Yoga, Calisthenics"
        }
    ],
    contact: {
        sectionLabel: "// LET'S CONNECT",
        title: `Have an Idea? <span class="gradient-text">Let's Build It!</span>`,
        description: "I'm always excited to work on new projects. Whether you need iOS development, AI integration, or creative automation—I'd love to hear from you.",
        cards: [
            {
                type: "email",
                title: "Email Me",
                value: "rohitsainier@gmail.com",
                href: "mailto:rohitsainier@gmail.com",
                icon: "fas fa-envelope",
                iconBg: "bg-indigo-500/20",
                iconColor: "text-indigo-400",
                hoverBg: "hover:bg-indigo-500/10"
            },
            {
                type: "phone",
                title: "Call Me",
                value: "+91 8708584615",
                href: "tel:+918708584615",
                icon: "fas fa-phone",
                iconBg: "bg-purple-500/20",
                iconColor: "text-purple-400",
                hoverBg: "hover:bg-purple-500/10"
            },
            {
                type: "linkedin",
                title: "LinkedIn",
                value: "rohitsainier",
                href: "https://www.linkedin.com/in/rohitsainier/",
                icon: "fab fa-linkedin",
                iconBg: "bg-pink-500/20",
                iconColor: "text-pink-400",
                hoverBg: "hover:bg-pink-500/10"
            }
        ],
        projectTypes: [
            "iOS App Development",
            "AI/ML Integration",
            "Virtual AI Anchors",
            "ComfyUI/N8N Workflows",
            "Video Processing (H2V)",
            "Consulting",
            "Other"
        ]
    },
    footer: {
        copyright: "© 2024 Rohit Saini",
        builtWith: "Built with",
        location: "from India"
    },
    iphoneScreens: [
        {
            gradient: "from-red-900 to-orange-700",
            icon: "fas fa-user-tie",
            iconColor: "text-red-300",
            title: "Virtual AI Anchor",
            subtitle: "India Today Group",
            content: `
                <div class="bg-white/10 rounded-xl p-3 mb-3">
                    <p class="text-xs text-left text-gray-200">AI News Presenter</p>
                </div>
                <div class="bg-red-600/30 rounded-xl p-3">
                    <p class="text-xs text-left text-red-200">60% less anchor dependency</p>
                </div>
            `
        },
        {
            gradient: "from-blue-900 to-blue-700",
            icon: "fas fa-shopping-cart",
            iconColor: "text-blue-300",
            title: "Carrefour UAE",
            subtitle: "10M+ Users Retail App",
            content: `
                <div class="bg-white/10 rounded-xl p-3 mb-3">
                    <p class="text-xs text-left text-gray-200">Cart & Checkout Flow</p>
                </div>
                <div class="bg-blue-600/30 rounded-xl p-3">
                    <p class="text-xs text-left text-blue-200">SwiftUI Migration</p>
                </div>
            `
        },
        {
            gradient: "from-purple-900 to-pink-900",
            icon: "fas fa-closed-captioning",
            iconColor: "text-purple-300",
            title: "AI Subtitle Clipper",
            subtitle: "Whisper AI Powered",
            content: `
                <div class="w-24 h-24 mx-auto bg-purple-800/50 rounded-2xl flex items-center justify-center mb-3">
                    <i class="fas fa-waveform-lines text-3xl text-purple-300"></i>
                </div>
                <p class="text-xs text-purple-300">2-3 hrs saved per video</p>
            `
        },
        {
            gradient: "from-green-900 to-teal-900",
            icon: "fas fa-palette",
            iconColor: "text-green-300",
            title: "Ghibli Generator",
            subtitle: "Stable Diffusion + ComfyUI",
            content: `
                <div class="flex justify-around mb-4">
                    <div>
                        <i class="fas fa-image text-2xl text-green-400"></i>
                        <p class="text-xs text-gray-400 mt-1">AI Art</p>
                    </div>
                    <div>
                        <i class="fas fa-wifi-slash text-2xl text-teal-400"></i>
                        <p class="text-xs text-gray-400 mt-1">Offline</p>
                    </div>
                </div>
            `
        }
    ]
};