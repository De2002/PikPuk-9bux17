export interface Chapter {
  number: number;
  title: string;
  summary: string;
  content: string;
}

export interface StoryQuote {
  text: string;
  context?: string;
}

export interface Story {
  id: string;
  title: string;
  type: 'novel' | 'short-story';
  year: number;
  genre: string;
  coverUrl: string;
  description: string;
  synopsis?: string;
  themes?: string[];
  quotes?: StoryQuote[];
  chapters?: Chapter[];
  pages?: number;
  readTime?: string;
  freeChapters?: number;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface Author {
  id: string;
  name: string;
  nationality: string;
  born: number;
  died?: number;
  portrait: string;
  shortBio: string;
  fullBio: string;
  faqs: FAQ[];
  stories: Story[];
  novelCount: number;
  shortStoryCount: number;
}
