import { ClientQuizProps } from "firma-crm-quiz";

export type QuizSettingsMode = "creating" | "editing" | "none";

export interface QuizTemplate {
    projectId: number;
    projectName: string;
    settings: ClientQuizProps;
}
