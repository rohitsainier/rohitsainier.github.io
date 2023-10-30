module.exports = {
  siteTitle: 'Rohit Saini',
  siteDescription:
    'Rohit Saini is an iOS Engineer, based in India, who loves learning new things and helping tech beginners.',
  siteKeywords:
    'Rohit Saini, Rohit, Saini, RohitSaini, software engineer, ios developer, swift, ios, ios engineer, mvvm, kurukshetra, sainiutils',
  siteUrl: 'https://rohitsainier.github.io/',
  siteLanguage: 'en_US',
  googleAnalyticsID: 'UA-45666519-2',
  googleVerification: 'DCl7VAf9tcz6eD9gb67NfkNnJ1PKRNcg8qQiwpbx9Lk',
  name: 'Rohit Saini',
  location: 'Kurukshetra, India',
  email: 'rohitsainier@gmail.com',
  github: 'https://github.com/rohitsainier',
  twitterHandle: '@',
  socialMedia: [
    {
      name: 'GitHub',
      url: 'https://github.com/rohitsainier',
    },
    {
      name: 'Linkedin',
      url: 'https://www.linkedin.com/in/rohit-saini-aba50362/',
    },
    {
      name: 'Youtube',
      url: 'https://youtube.com/@rohitsainier',
    },
    {
      name: 'Instagram',
      url: 'https://www.instagram.com/connect.ios',
    },
  ],

  navLinks: [
    {
      name: 'About',
      url: '/#about',
    },
    {
      name: 'Experience',
      url: '/#jobs',
    },
    {
      name: 'Projects',
      url: '/#projects',
    },
    {
      name: 'Contact',
      url: '/#contact',
    },
  ],

  navHeight: 100,

  colors: {
    green: '#64ffda',
    navy: '#0a192f',
    darkNavy: '#020c1b',
  },

  srConfig: (delay = 200) => ({
    origin: 'bottom',
    distance: '20px',
    duration: 500,
    delay,
    rotate: { x: 0, y: 0, z: 0 },
    opacity: 0,
    scale: 1,
    easing: 'cubic-bezier(0.645, 0.045, 0.355, 1)',
    mobile: true,
    reset: false,
    useDelay: 'always',
    viewFactor: 0.25,
    viewOffset: { top: 0, right: 0, bottom: 0, left: 0 },
  }),
};
