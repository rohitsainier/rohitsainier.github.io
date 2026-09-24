export const site = {
  name: 'Rohit Saini',
  role: 'AI Engineer / Creator / Builder',
  title: 'Rohit Saini — AI Engineer, Creator, Builder',
  description:
    'Rohit Saini builds experimental products at the intersection of AI, video, creative tools and engineering — from AI video dubbing to GPU terminals and battery simulations.',
  email: 'rohitsainier@gmail.com',
  location: 'New Delhi, India',
  timezone: 'Asia/Kolkata',
  status: 'Currently building',
  statusDetail: 'a newsroom with a synthetic anchor',
  links: {
    github: 'https://github.com/rohitsainier',
    linkedin: 'https://www.linkedin.com/in/rohitsainier/',
    medium: 'https://medium.com/@rohitsainier',
    youtube: 'https://www.youtube.com/@rohitsainier',
    crates: 'https://crates.io/users/rohitsainier',
    apps: 'https://rohitsainier.github.io/pages/',
  },
  nav: [
    { label: 'Work', href: '#work' },
    { label: 'Experiments', href: '#experiments' },
    { label: 'About', href: '#about' },
    { label: 'Contact', href: '#contact' },
  ],
} as const;

/** Prefix a public path with the configured base (works for root and project-site deploys). */
export const url = (path: string) => {
  const base = import.meta.env.BASE_URL.replace(/\/$/, '');
  return `${base}/${path.replace(/^\//, '')}`;
};
