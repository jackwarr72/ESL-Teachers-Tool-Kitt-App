import { GoogleGenAI } from "@google/genai";
import { ProficiencyLevel, LanguageDomain, AgeGroup } from '../types';

function getErrorMessage(err: any): string {
  if (!err) return 'Unknown error';
  if (err instanceof Error) return err.message;
  try {
    return JSON.stringify(err);
  } catch {
    return String(err);
  }
}

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  throw new Error("API_KEY environment variable not set");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

const textModel = 'gemini-2.5-pro';
const audioModel = 'gemini-2.5-flash-native-audio-preview-09-2025';

const basePrompt = `
You are an expert AI assistant for ESL teachers. Your responses must be structured, clear, and ready-to-use in a classroom setting. 
You must align with Communicative Language Teaching (CLT) and Task-Based Learning (TBL) principles. 
Format your output using Markdown. Use headings, bullet points, and bold text to organize the content effectively.
`;

export const generateLessonPlan = async (level: ProficiencyLevel, domain: LanguageDomain, age: AgeGroup, topic: string, objectives: string): Promise<string> => {
  try {
    const prompt = `
      ${basePrompt}
      
      Generate a comprehensive lesson plan for an ESL class with the following specifications:
      - **Proficiency Level:** ${level}
      - **Language Domain:** ${domain}
      - **Age Group:** ${age}
      - **Topic:** "${topic}"
      - **Learning Objectives:** "${objectives}"
      
      The lesson plan should include the following sections:
      1.  **Lesson Title:** A creative and engaging title.
      2.  **Materials:** A list of required materials (e.g., whiteboard, markers, handouts, projector).
      3.  **Warm-up (5-10 mins):** An interactive activity to engage students and activate prior knowledge.
      4.  **Presentation (10-15 mins):** Clear presentation of the new language point or vocabulary.
      5.  **Practice (15-20 mins):** A communicative, task-based activity for students to practice in pairs or small groups.
      6.  **Production (10-15 mins):** A task where students use the target language more freely and creatively.
      7.  **Cool-down & Wrap-up (5 mins):** A brief review and homework assignment.
      
      Ensure all activities are appropriate for the specified age group and proficiency level.
    `;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return response.text;
  } catch (error) {
    console.error("Error generating lesson plan:", error);
    return `Failed to generate lesson plan. Error: ${getErrorMessage(error)}`;
  }
};

export const generateWorksheet = async (level: ProficiencyLevel, domain: LanguageDomain, topic: string, activityType: string): Promise<string> => {
    try {
        const prompt = `
            ${basePrompt}

            Generate a ready-to-print worksheet for an ESL class with the following specifications:
            - **Proficiency Level:** ${level}
            - **Language Domain:** ${domain}
            - **Topic:** "${topic}"
            - **Activity Type:** "${activityType}"

            The worksheet should include:
            1.  **Title:** A clear title for the worksheet.
            2.  **Instructions:** Simple and clear instructions for the students.
            3.  **Exercises:** A series of well-structured exercises based on the activity type. For example, for "Fill-in-the-blanks", provide sentences with gaps. For "Matching", provide two columns to match.
            4.  **Answer Key:** A separate section at the bottom with the answers.

            Make the content engaging and relevant to the topic.
        `;
        const response = await ai.models.generateContent({ model: textModel, contents: prompt });
        return response.text;
    } catch (error) {
      console.error("Error generating worksheet:", error);
      return `Failed to generate worksheet. Error: ${getErrorMessage(error)}`;
    }
};

export const provideWritingFeedback = async (level: ProficiencyLevel, text: string): Promise<string> => {
    try {
        const prompt = `
            ${basePrompt}

            Act as an expert ESL teacher providing feedback on a student's writing.
            - **Student's Proficiency Level:** ${level}
            
            Here is the student's text:
            ---
            ${text}
            ---
            
            Provide feedback in the following format:
            1.  **Overall Comments:** Start with positive reinforcement. Give a brief summary of what the student did well and the main areas for improvement.
            2.  **Corrections & Suggestions (Table):** Create a Markdown table with three columns: "Original Sentence", "Correction/Suggestion", and "Explanation". In the explanation, briefly explain the grammatical rule or vocabulary choice.
            3.  **Next Steps:** Suggest 1-2 specific practice exercises the student can do to improve.
        `;
        const response = await ai.models.generateContent({ model: textModel, contents: prompt });
        return response.text;
    } catch (error) {
      console.error("Error providing feedback:", error);
      return `Failed to provide feedback. Error: ${getErrorMessage(error)}`;
    }
};

export const getProDevTopic = async (topic: string): Promise<string> => {
    try {
        const prompt = `
            ${basePrompt}

            Generate a professional development article for ESL teachers on the topic of "${topic}".
            The article should be practical, insightful, and provide actionable tips.
            Structure it with a clear introduction, several main points with examples, and a concluding summary.
        `;
        const response = await ai.models.generateContent({ model: textModel, contents: prompt });
        return response.text;
    } catch (error) {
      console.error("Error generating ProDev topic:", error);
      return `Failed to generate professional development content. Error: ${getErrorMessage(error)}`;
    }
};

export const generateSpeakingPractice = async (level: ProficiencyLevel, topic: string, scenario: string): Promise<string> => {
  try {
    const prompt = `
      ${basePrompt}
      
      Generate a speaking practice exercise for an ESL student with the following specifications:
      - **Proficiency Level:** ${level}
      - **Topic:** "${topic}"
      - **Scenario:** "${scenario}"
      
      The exercise should include the following sections:
      1.  **Exercise Title:** A clear, relevant title.
      2.  **Scenario Description:** A brief paragraph explaining the context for the student.
      3.  **Key Vocabulary & Phrases:** A list of 5-7 useful words or phrases with simple definitions that are relevant to the scenario.
      4.  **Sample Dialogue:** A short, clear dialogue between two speakers (e.g., Speaker A, Speaker B) that models the conversation. The student would typically take on one of these roles.
      5.  **Teacher's Feedback Rubric:** A checklist or simple rubric for the teacher to provide feedback. It should cover:
          - **Fluency:** (e.g., Smoothness, use of fillers)
          - **Pronunciation:** (e.g., Clarity of specific sounds, intonation)
          - **Vocabulary Usage:** (e.g., Use of key vocabulary, appropriate word choice)
          - **Grammar & Accuracy:** (e.g., Correct verb tense, sentence structure)
      
      Ensure the language and complexity are appropriate for the specified proficiency level.

      ---GAMIFICATION---

      ### Gamification Suggestions
      
      Based on the exercise, suggest gamification elements to motivate the student.
      - **Point System:** Propose a simple point system based on the rubric (e.g., Fluency: 25 points, Pronunciation: 25 points, etc., totaling 100).
      - **Badge Unlocked:** Create a creative and relevant badge name and a short, encouraging description for completing this task successfully. For example, for a job interview topic, a "Career Champion" badge.
    `;
    const response = await ai.models.generateContent({ model: textModel, contents: prompt });
    return response.text;
  } catch (error) {
    console.error("Error generating speaking practice:", error);
    return `Failed to generate speaking practice material. Error: ${getErrorMessage(error)}`;
  }
};

export const getPronunciationFeedback = async (level: ProficiencyLevel, exerciseText: string, audioBase64: string, audioMimeType: string): Promise<string> => {
  try {
    const textPart = {
      text: `
        ${basePrompt}
        You are an expert ESL pronunciation coach. Analyze the provided audio from a student at the ${level} proficiency level.
        The student was practicing the following text:
        ---
        ${exerciseText}
        ---
        Listen for pronunciation errors in the audio. Provide feedback in the following format:
        1.  **Overall Summary:** Give one or two sentences of encouraging and constructive feedback.
        2.  **Pronunciation Analysis (Table):** Create a Markdown table with four columns: "Word/Phrase", "Phoneme Error", "Suggestion for Improvement", and "Resource".
            - In the "Phoneme Error" column, identify the specific sound error (e.g., "The phoneme /θ/ was pronounced as /d/.").
            - In the "Suggestion for Improvement" column, provide a clear, actionable tip (e.g., "To make the /θ/ sound, gently place your tongue between your teeth and blow air. It should be a soft, continuous sound.").
            - In the "Resource" column, provide a helpful resource. This can be a link to a video explaining the sound, or a description of a visual aid. For example: "[Watch a video on the TH sound](https://www.youtube.com/watch?v=1_v_s2s-tL4)" or "Visual Aid: A diagram showing the tongue position between the teeth."
        
        Focus on the 2-4 most critical errors for this proficiency level to avoid overwhelming the student. Make the resources high-quality and relevant.
      `,
    };
    const audioPart = {
      inlineData: {
        data: audioBase64,
        mimeType: audioMimeType,
      },
    };

    const response = await ai.models.generateContent({ model: audioModel, contents: { parts: [textPart, audioPart] } });
    return response.text;

  } catch (error) {
    console.error("Error analyzing pronunciation:", error);
    return `Failed to analyze pronunciation. Error: ${getErrorMessage(error)}`;
  }
};