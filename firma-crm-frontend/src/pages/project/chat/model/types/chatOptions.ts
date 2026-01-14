export interface IChatOptions {
    projectId?: number;
    autoMessageDelay: number;
    autoMessageText: string;
    headerTitleCloseText: string;
    headerTitleOpenText: string;
    headerSubtitleText: string;
    connectingMessageText: string;
    finalMessageText: string;
    conversionId: string;
    conversionEvent: string;
    enabled: boolean;
    rightOffset: boolean;
}

export interface ChatOptionsScheme {
    defaultOptions: {
        data: IChatOptions | null;
        loading: boolean;
    };
    projectOptions: {
        data: IChatOptions | null;
        loading: boolean;
    };
    errorMessage?: string;
    infoMessage?: string;
}

export interface OptionInput {
    label: string;
    key: keyof IChatOptions;
    type?: "text" | "number";
    leftAddon?: string;
    helperText?: string;
}
