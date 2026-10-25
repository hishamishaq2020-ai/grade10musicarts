export interface Question {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
}

export interface KeyTerm {
  term: string;
  definition: string;
}

export interface LessonContent {
  id: string;
  unitId: number;
  lessonNumber: number;
  title: string;
  subtitle: string;
  objectives: string[];
  keyTerms: KeyTerm[];
  detailedExplanation: {
    sectionTitle: string;
    paragraphs: string[];
    bulletPoints?: string[];
    callout?: {
      title: string;
      content: string;
      type: 'tip' | 'info' | 'important';
    };
  }[];
  interactiveToolType: 'bass-clef' | 'scales' | 'triads' | 'mawlid-melody' | 'omani-instruments' | 'romantic-verdi' | 'piano-practice';
  defaultVideoUrl: string;
  videoWatchUrl?: string;
  videoTitle: string;
  videoDescription: string;
  presentationOutline: {
    title: string;
    points: string[];
    notes?: string;
  }[];
  quiz: Question[];
}

export interface Unit {
  id: number;
  title: string;
  subtitle: string;
  badge: string;
  description: string;
  colorScheme: {
    primary: string;
    secondary: string;
    accent: string;
    border: string;
  };
  lessons: LessonContent[];
}
