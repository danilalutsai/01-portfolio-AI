export type AboutCommand = {
  command: string;
  text: string;
  image: string;
  alt: string;
};

// The About page's shell session, run in this order. Commented-out entries
// are ready to switch on once they have a photo.
export const aboutSession: AboutCommand[] = [
  {
    command: 'whoami',
    text: "Hello everyone. My name is Danila Lutsai, I'm 28, and I build things for the web. This site is my portfolio — a small, honest place to put my work, my thinking, and a bit of who I am outside the code. Nothing exhaustive, nothing inflated. Just a starting point.",
    image: new URL('../assets/img/avatar-01.webp', import.meta.url).href,
    alt: 'Danila in glasses and a black hoodie, sitting at a laptop on a wooden desk',
  },
  {
    command: 'cat the-long-way-around.md',
    text: "I came to frontend development the long way around, and I think that's an advantage. Being twenty-eight means I've already learned how to learn — how to sit with something confusing until it stops being confusing, how to ask better questions, and how to tell the difference between knowing a thing and only recognizing it. I'm early in this career, not early in my life, and those are very different starting lines.",
    image: new URL('../assets/img/mountains.webp', import.meta.url).href,
    alt: 'Danila with a backpack on a rocky trail, with pine forest, a lake and snowy peaks behind',
  },
  {
    command: 'cat values.txt',
    text: "What I care about in the work: interfaces that respect the person using them. Pages that load fast. Text you can actually read. Buttons where you expect buttons. A lot of the modern web has forgotten that a website is something a human being has to use, and I'd like to be part of the group that remembers.",
    image: new URL('../assets/img/about-focused-2.webp', import.meta.url).href,
    alt: 'Danila smiling while typing on a laptop, with misty forested mountains outside the window',
  },
  {
    command: 'cat now.md',
    text: "Right now most of my time goes into Vue and TypeScript. I like TypeScript because it argues with me, and it's usually right. I like Vue because it keeps the distance between an idea and a working interface refreshingly short. I'm the kind of developer who would rather understand why something works than copy a snippet that happens to work — slower at first, much faster later.",
    image: new URL('../assets/img/main-02.webp', import.meta.url).href,
    alt: 'Desk with books on TypeScript, Vue 3 and web development, under a whiteboard reading: better interfaces, faster websites, happy users',
  },
  // {
  //   command: 'cat offline.md',
  //   text: "Away from the keyboard I'm fairly easy to describe: I like things that reward patience. Long-form reading, problems that don't resolve in an afternoon, the particular satisfaction of a system you understand all the way down. I suspect that's the same instinct that pulled me into programming in the first place, just wearing different clothes.",
  //   image: '',
  //   alt: '',
  // },
  // {
  //   command: 'cat goals.md',
  //   text: 'My goals are unglamorous and specific. Get genuinely good at the fundamentals rather than collecting framework names. Ship real projects instead of collecting tutorials. Find a team that builds carefully and writes code other people can read. Keep the curiosity that got me here in the first place.',
  //   image: '',
  //   alt: '',
  // },
  // {
  //   command: 'echo "say hello"',
  //   text: 'If any of that resonates, take a look at my projects — or just say hello.',
  //   image: '',
  //   alt: '',
  // },
];
