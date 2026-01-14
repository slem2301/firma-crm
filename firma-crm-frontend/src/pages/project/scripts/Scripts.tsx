import { Button, useBoolean, VStack } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import Loader from "../../../components/ui/loader/Loader";
import { SUCCESS_GET } from "../../../const/http-codes";
import { IProjectScript } from "../../../models/IProjectScript";
import projectScriptService from "../../../services/project-script-service";
import ScriptItem from "./ScriptItem";

type ScriptsProps = {
    projectId: number;
};

const Scripts: React.FC<ScriptsProps> = ({ projectId }) => {
    const [loading, setLoading] = useState(true);
    const [createMode, setCreateMode] = useBoolean(false);
    const [scripts, setScripts] = useState<IProjectScript[]>([]);

    const fetchScripts = useCallback(async () => {
        try {
            const response = await projectScriptService.getByProjectId(
                projectId
            );

            if (response.status === SUCCESS_GET) setScripts(response.data);
        } catch (e) {}
        setLoading(false);
    }, [projectId]);

    useEffect(() => {
        fetchScripts();
    }, [fetchScripts]);

    if (loading) return <Loader />;

    return (
        <VStack align="stretch">
            {createMode ? (
                <ScriptItem
                    script={{
                        id: -1,
                        code: "",
                        selector: "",
                        projectId,
                    }}
                    createMode={createMode}
                    isNew
                    offCreateMode={setCreateMode.off}
                    fetchScripts={fetchScripts}
                />
            ) : (
                <Button
                    colorScheme="green"
                    alignSelf="flex-start"
                    onClick={setCreateMode.on}
                    size="sm"
                >
                    Добавить скрипт
                </Button>
            )}
            {scripts.map((script, i) => (
                <ScriptItem
                    createMode={createMode}
                    key={script.id}
                    idx={i + 1}
                    script={script}
                    fetchScripts={fetchScripts}
                />
            ))}
        </VStack>
    );
};

export default Scripts;
