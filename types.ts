
export enum EducationLevel {
  PRIMARY = 'Primary School',
  SECONDARY = 'Secondary School',
  COLLEGE = 'College / University'
}

export interface Attachment {
  data: string; // base64
  mimeType: string;
  name: string;
}

export interface UserProfile {
  email: string;
  phone?: string;
  name: string; // Used for Full Name
  username: string;
  dob: string;
  password?: string;
  level: EducationLevel;
  subjects: string[];
  onboarded: boolean;
  questionCount: number;
  isPremium: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctIndex: number;
  explanation: string;
  workings: string[];
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: number;
  attachments?: Attachment[];
  structuredContent?: {
    meaning: string;
    keyConcepts: string[];
    steps: string[];
    examples: string[];
    summary: string;
    practice: string;
    quiz?: {
      question: string;
      options: string[];
      correctIndex: number;
    };
    outline?: string[];
  };
  bookmarked?: boolean;
}
