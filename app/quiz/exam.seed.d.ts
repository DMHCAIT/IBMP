declare module '@/quiz/exam.seed.json' {
  interface Option {
    id: string;
    text: string;
  }

  interface Part {
    id: string;
    prompt: string;
  }

  interface Asset {
    id: string;
    file: string;
    kind: string;
    title: string;
    alt: string;
  }

  interface Scoring {
    correctOptionId?: string;
    paperAnswerLetter?: string;
    explanation?: string;
    rubric?: Array<{
      id: string;
      partId: string;
      maxUnits: number;
      allowedUnits: number[];
      answer: string;
    }>;
    markerNote?: string;
    referenceIds?: string[];
  }

  interface Question {
    id: string;
    number: number;
    moduleId: number;
    topic: string;
    type: 'mcq' | 'image' | 'short';
    stem: string;
    maxUnits: number;
    options?: Option[];
    parts?: Part[];
    asset?: Asset;
    scoring?: Scoring;
  }

  interface Module {
    id: number;
    title: string;
  }

  interface ExamSeed {
    schemaVersion: string;
    id: string;
    version: number;
    title: string;
    status: string;
    facultyApprovedAt: string | null;
    settingsApprovedAt: string | null;
    opensAt: string | null;
    closesAt: string | null;
    durationMinutes: number;
    durationIsProposed: boolean;
    unitsPerMark: number;
    maxUnits: number;
    negativeMarking: boolean;
    maxAttempts: number;
    shuffleMcqQuestions: boolean;
    shuffleMcqOptions: boolean;
    passThresholdMarks: string | null;
    separateComponents: string[];
    modules: Module[];
    questions: Question[];
  }

  const examSeed: ExamSeed;
  export default examSeed;
}
