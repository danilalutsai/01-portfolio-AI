export type Tech = {
  // Used in the URL: /techs?tech=vue
  id: string;
  name: string;
  file: string;
  // Tailwind background class for the square before the file name.
  color: string;
  tagline: string;
  // One entry per paragraph; long ones wrap but count as a single line.
  description: string[];
  daily: string[];
};

export const DEFAULT_TECH_ID = 'html';

// Typed as non-empty so there is always a file to fall back to.
export const techs: [Tech, ...Tech[]] = [
  {
    id: 'fundamentals',
    name: 'Fundamentals',
    file: 'fundamentals.md',
    color: 'bg-ctp-text',
    tagline: 'The layer everything else sits on',
    description: [
      'Before any framework: how a browser turns a URL into a page. HTTP, the DOM, the event loop, Git and the terminal. Every project starts here: I sketch the pages and the data, set up the repo, and only then open a component.',
    ],
    daily: [
      'Sketching pages and data before opening the editor',
      'One Git branch per feature, small focused commits',
      'DevTools network tab when something feels slow',
    ],
  },
  {
    id: 'html',
    name: 'HTML',
    file: 'html.md',
    color: 'bg-ctp-red',
    tagline: 'Structure first, everything else after',
    description: [
      "HTML is where I started, and it's still the layer I care about getting right. I write semantic, accessible markup — proper headings, landmarks, labels and alt text — rather than a wall of divs. Structure comes first, styling after. Done properly, the page already works before a single line of CSS or JavaScript runs.",
    ],
    daily: [
      'Writing every Vue template with semantic tags first',
      'Labels, alt text and landmarks on each page',
      'Testing with the keyboard only before any styling',
    ],
  },
  {
    id: 'css',
    name: 'CSS',
    file: 'css.md',
    color: 'bg-ctp-blue',
    tagline: 'Layout from the smallest screen up',
    description: [
      "I build layouts with Flexbox and Grid, and I design mobile-first — the small screen decides the structure, wider ones get more room. Custom properties keep colours and spacing consistent instead of scattered. I'd rather solve something with modern CSS than pull in a dependency for it.",
    ],
    daily: [
      'Grid for page layout, Flexbox inside components',
      'Colours and spacing as variables in one theme file',
      'Media queries only where the layout actually breaks',
    ],
  },
  {
    id: 'javascript',
    name: 'JavaScript',
    file: 'javascript.md',
    color: 'bg-ctp-yellow',
    tagline: 'The language under every framework',
    description: [
      "JavaScript is the language I work in daily. I'm comfortable with modern syntax, async code and promises, and the DOM underneath the frameworks. Knowing how the event loop and scope actually behave is what makes debugging possible when something breaks in a way the framework doesn't explain.",
    ],
    daily: [
      'Fetching data with async/await and handling the errors',
      'Shared logic as plain functions Vue can call',
      'Stepping through bugs with breakpoints, not guesses',
    ],
  },
  {
    id: 'typescript',
    name: 'TypeScript',
    file: 'typescript.md',
    color: 'bg-ctp-sky',
    tagline: 'Types the compiler checks for me',
    description: [
      "TypeScript is my default for anything bigger than a quick script. I keep strict mode on and lean on interfaces, union types and generics to describe what data actually looks like. To me, types are documentation the compiler checks: they catch the mistake before the browser does. Underneath it's still JavaScript, so knowing the runtime matters more than writing clever types.",
    ],
    daily: [
      'Typing API responses before building the component',
      'Typed props and emits in every Vue component',
      'Type-check in the build, so errors never ship',
    ],
  },
  {
    id: 'vue',
    name: 'VueJS',
    file: 'vue.md',
    color: 'bg-ctp-green',
    tagline: 'Components that stay close to the platform',
    description: [
      "Vue is my framework of choice, and I work with Vue 3 and the Composition API. I like how close it stays to plain HTML, CSS and JavaScript. Single-file components keep things readable. I split interfaces into small, focused components, handle routing with Vue Router, and type props and emits with TypeScript. The framework does the heavy lifting, but I want to understand what it's doing.",
    ],
    daily: [
      'Splitting each page into small single-file components',
      'Vue Router for pages, query params for shareable state',
      'Composables for logic used on more than one page',
    ],
  },
  {
    id: 'tailwind',
    name: 'TailwindCSS',
    file: 'tailwind.md',
    color: 'bg-ctp-teal',
    tagline: 'Styles that live next to the markup',
    description: [
      "Tailwind is how I style most projects now. Utility classes keep the styles right next to the markup, so I'm not jumping between files or inventing class names. It works because I already know CSS: every utility maps to a real property, and when something looks off, I know what's happening underneath. I keep the config tidy and pull repeated patterns into components instead of copying long class strings around.",
    ],
    daily: [
      'Theme colours defined once, used everywhere',
      'Mobile-first utilities, then sm: and md: for wider screens',
      'Repeated class lists pulled into a component',
    ],
  },
  {
    id: 'ai',
    name: 'AI',
    file: 'ai.md',
    color: 'bg-ctp-mauve',
    tagline: 'A fast colleague I always double-check',
    description: [
      "I use AI tools as part of my workflow: for exploring an unfamiliar API, getting a first draft of boilerplate, or talking through a bug from a different angle. I treat the output as a suggestion from a fast but unreliable colleague. I read it, test it, and rewrite what doesn't fit. I don't ship code I can't explain. AI makes me faster, but the fundamentals are what let me tell when it's wrong.",
    ],
    daily: [
      'Asking Claude to explain an unfamiliar API',
      'Drafting tests and boilerplate, then rewriting them',
      'A second opinion on a bug, never the final answer',
    ],
  },
];
