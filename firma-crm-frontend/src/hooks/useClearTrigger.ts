import { useCallback, useEffect, useState } from "react";

export const useClearTrigger = () => {
    const [clearTrigger, setClearTrigger] = useState<boolean>(false);

    const invokeTrigger = useCallback(() => {
        setClearTrigger(true);
    }, []);

    useEffect(() => {
        clearTrigger && setClearTrigger(false);
    }, [clearTrigger]);

    return { clearTrigger, invokeTrigger, setClearTrigger };
};
