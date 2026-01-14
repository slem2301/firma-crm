import { useCallback, useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { fetchDefaultOptions } from "../model/services/fetchDefaultOptions";
import { fetchProjectOptions } from "../model/services/fetchProjectOptions";
import { chatOptionsActions } from "../model/slice/chatOptionsSlice";
import Loader from "../../../../components/ui/loader/Loader";
import { ChatOptionsForm } from "./ChatOptionsForm";
import {
    getPageLoading,
    getDefaultData,
    getProjectData,
} from "../model/selectors";
import { useChatAlert } from "../lib/useChatAlert";
import { IChatOptions } from "../model/types/chatOptions";

interface ChatOptionsProps {
    projectId: number;
}

export const ChatOptions = ({ projectId }: ChatOptionsProps) => {
    useChatAlert();
    const defaultOptions = useAppSelector(getDefaultData);
    const projectOptions = useAppSelector(getProjectData);

    const dispatch = useAppDispatch();

    const pageLoading = useAppSelector(getPageLoading);

    const fetchDefault = useCallback(async () => {
        if (!defaultOptions) {
            dispatch(fetchDefaultOptions());
        }
    }, [defaultOptions, dispatch]);

    const fetchData = useCallback(async () => {
        dispatch(fetchProjectOptions(projectId));
    }, [projectId, dispatch]);

    useEffect(() => {
        fetchDefault();
    }, [fetchDefault]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    useEffect(() => {
        return () => {
            dispatch(chatOptionsActions.clearOptions());
        };
    }, [dispatch]);

    if (pageLoading) return <Loader />;

    return (
        <ChatOptionsForm
            projectId={projectId}
            defaultOptions={defaultOptions as IChatOptions}
            projectOptions={projectOptions as IChatOptions}
        />
    );
};
