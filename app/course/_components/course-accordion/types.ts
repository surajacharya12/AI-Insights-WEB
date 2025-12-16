// Shared types for course components

export interface YouTubeVideo {
    videoId: string;
    title: string;
}

export interface Topic {
    topic: string;
    content?: string;
    youtubeVideos?: YouTubeVideo[];
}

export interface Chapter {
    chapterName: string;
    topics: Topic[];
}

export interface CourseAccordionProps {
    chapters: Chapter[];
    courseId?: string;
    userId?: string | number;
    isEnrolled?: boolean;
}

// Gradient presets for chapters
export const chapterGradients = [
    "from-violet-500 via-purple-500 to-indigo-500",
    "from-cyan-500 via-blue-500 to-indigo-500",
    "from-emerald-500 via-teal-500 to-cyan-500",
    "from-orange-500 via-amber-500 to-yellow-500",
    "from-pink-500 via-rose-500 to-red-500",
    "from-indigo-500 via-purple-500 to-pink-500",
];

export const getGradient = (index: number) => chapterGradients[index % chapterGradients.length];
