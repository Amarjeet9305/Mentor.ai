
export interface Resource {
    id: string;
    title: string;
    description: string;
    type: 'video' | 'article' | 'project' | 'course';
    duration: string;
    url: string;
    category: 'React' | 'Next.js' | 'AI/ML' | 'Web3' | 'System Design' | 'Productivity';
    moods: string[]; // Moods this resource is good for
    complexity: 'Beginner' | 'Intermediate' | 'Advanced';
}

export const resources: Resource[] = [
    {
        id: '1',
        title: 'Next.js 15 Deep Dive',
        description: 'Explore the latest features in Next.js 15, including Server Actions and enhanced partial prerendering.',
        type: 'video',
        duration: '45 min',
        url: 'https://nextjs.org/docs',
        category: 'Next.js',
        moods: ['energetic', 'focused'],
        complexity: 'Intermediate'
    },
    {
        id: '2',
        title: 'Mastering React Server Components',
        description: 'Understand how RSCs change the way we build react applications for better performance.',
        type: 'article',
        duration: '15 min',
        url: 'https://react.dev',
        category: 'React',
        moods: ['curious', 'studious'],
        complexity: 'Advanced'
    },
    {
        id: '3',
        title: 'Building AI Agents with Python',
        description: 'A hands-on project to build autonomous AI agents using LangChain and OpenAI.',
        type: 'project',
        duration: '4 hours',
        url: '#',
        category: 'AI/ML',
        moods: ['energetic', 'dedicated'],
        complexity: 'Advanced'
    },
    {
        id: '4',
        title: 'Quick Productivity Hacks for Devs',
        description: 'Short, actionable tips to improve your coding workflow and reduce burnout.',
        type: 'article',
        duration: '5 min',
        url: '#',
        category: 'Productivity',
        moods: ['stressed', 'lazy'],
        complexity: 'Beginner'
    },
    {
        id: '5',
        title: 'Emotional Intelligence in Engineering',
        description: 'How to handle high-pressure environments and lead teams with empathy.',
        type: 'video',
        duration: '10 min',
        url: '#',
        category: 'Productivity',
        moods: ['stressed', 'reflective'],
        complexity: 'Beginner'
    },
    {
        id: '6',
        title: 'Modern CSS Layouts with Grid',
        description: 'Stop using floats. master CSS Grid for complex, responsive layouts with ease.',
        type: 'course',
        duration: '2 hours',
        url: '#',
        category: 'React',
        moods: ['creative', 'focused'],
        complexity: 'Beginner'
    }
];

export const moods = [
    { id: 'energetic', name: 'Energetic', icon: '⚡', color: 'bg-yellow-400' },
    { id: 'stressed', name: 'Stressed', icon: '😰', color: 'bg-red-400' },
    { id: 'curious', name: 'Curious', icon: '🤔', color: 'bg-blue-400' },
    { id: 'lazy', name: 'Lazy', icon: '🦥', color: 'bg-green-400' },
    { id: 'focused', name: 'Focused', icon: '🎯', color: 'bg-indigo-400' },
];
