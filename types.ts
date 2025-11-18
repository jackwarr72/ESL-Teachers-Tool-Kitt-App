
export type View = 'lessonPlanner' | 'worksheetGenerator' | 'feedbackTool' | 'speakingCoach' | 'proDev';

export enum ProficiencyLevel {
    A1 = "A1 (Beginner)",
    A2 = "A2 (Elementary)",
    B1 = "B1 (Intermediate)",
    B2 = "B2 (Upper-Intermediate)",
    C1 = "C1 (Advanced)",
    C2 = "C2 (Proficient)"
}

export enum LanguageDomain {
    Grammar = "Grammar",
    Vocabulary = "Vocabulary",
    Reading = "Reading",
    Speaking = "Speaking",
    Writing = "Writing",
    Listening = "Listening"
}

export enum AgeGroup {
    Kids = "Kids (6-10)",
    Teens = "Teens (11-17)",
    Adults = "Adults (18+)"
}

export interface GenerationResult {
    title: string;
    content: string;
    id: string;
}
