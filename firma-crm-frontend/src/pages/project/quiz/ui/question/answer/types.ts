import { AnswerUnion } from "firma-crm-quiz";

export interface BaseAnswerProps {
    index: number;
    answer: AnswerUnion;
    questionIndex: number;
    onDelete: () => void;
    isLoading: boolean;
}
