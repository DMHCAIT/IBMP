export type SeedQuestion = {
  id?: string;
  number: number;
  moduleId?: number;
  topic?: string;
  type?: string;
  stem: string;
  maxUnits?: number;
  options?: Array<string | { id?: string; text?: string }>;
  scoring?: {
    correctOptionId?: string;
    answer?: string;
    [key: string]: unknown;
  };
  parts?: Array<{ id?: string; prompt?: string; [key: string]: unknown }>;
  asset?: {
    file?: string | null;
    title?: string | null;
    [key: string]: unknown;
  } | null;
  [key: string]: unknown;
};

export type SeedFile = {
  title?: string;
  version?: number;
  modules?: Array<{ id: number; title: string }>;
  questions: SeedQuestion[];
};

function optionText(option: string | { text?: string }): string {
  return typeof option === 'string' ? option : option.text || '';
}

function publicAssetUrl(file?: string | null): string | null {
  if (!file) return null;
  if (/^(https?:)?\//.test(file)) return file;
  return `/${file.replace(/^assets\//, 'quiz-assets/')}`;
}

export function seedQuestionToDatabase(question: SeedQuestion, seed: SeedFile, paperId: string) {
  const options = (question.options || []).map(optionText).filter(Boolean);
  const correctOption = question.options?.find(
    option => typeof option !== 'string' && option.id === question.scoring?.correctOptionId
  );
  const correctAnswer = correctOption && typeof correctOption !== 'string'
    ? correctOption.text || null
    : question.scoring?.answer || null;
  const questionModule = seed.modules?.find(item => item.id === question.moduleId)?.title || 'General';
  const questionNumber = `Q${String(question.number).padStart(2, '0')}`;

  return {
    question_number: questionNumber,
    type: question.type || 'mcq',
    module: questionModule,
    stem: question.stem,
    marks: question.maxUnits || 1,
    options: options.length > 0 ? options : null,
    correct_answer: correctAnswer,
    image_url: publicAssetUrl(question.asset?.file),
    description: question.asset?.title || null,
    question_data: question,
    sort_order: question.number,
    paper_id: paperId,
    is_active: true,
  };
}