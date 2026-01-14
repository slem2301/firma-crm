import { useEffect, useState } from "react";
import { googleTablesApi } from "./api";
import { isError } from "../../../../axios";
import { GoogleTableOptions } from "./model";
import useAppToast from "../../../../hooks/useAppToast";
import { Stack, Text } from "@chakra-ui/react";
import { AddGoogleTableOptions } from "./ui/AddGoogleTableOptions";
import { GoogleTableOptionsItem } from "./ui/GoogleTableOptionsItem";

interface GoogleTablesSettingsProps {
    projectId: number;
}

export const GoogleTablesSettings = ({
    projectId,
}: GoogleTablesSettingsProps) => {
    const toast = useAppToast();
    const [isLoading, setLoading] = useState(true);
    const [acceptedFields, setAcceptedFields] = useState<null | string[]>(null);
    const [options, setOptions] = useState<GoogleTableOptions[]>([]);

    const handleFetchAcceptedFields = () =>
        googleTablesApi
            .getAcceptedFields()
            .then((response) => {
                if (response.status === 200) {
                    setAcceptedFields(response.data);
                }
            })
            .catch(
                (e) =>
                    isError(e) &&
                    toast({
                        status: "error",
                        title: "GoogleTables",
                        text: e.message,
                    })
            );

    const handleFetchOptions = () =>
        googleTablesApi
            .getAllByProjectId(projectId)
            .then((response) => {
                if (response.status === 200) {
                    setOptions(response.data);
                }
            })
            .catch(
                (e) =>
                    isError(e) &&
                    toast({
                        status: "error",
                        title: "GoogleTables",
                        text: e.message,
                    })
            );

    useEffect(() => {
        Promise.all([
            handleFetchAcceptedFields(),
            handleFetchOptions(),
        ]).finally(() => setLoading(false));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [projectId]);

    if (isLoading) {
        return null;
    }

    if (acceptedFields === null) {
        return null;
    }

    return (
        <Stack w="100%">
            <Text fontWeight={500}>
                Google Tables:
                <Text
                    as="span"
                    display={options.length ? "none" : "inline"}
                    fontWeight={400}
                >
                    {" "}
                    Не установлено
                </Text>
            </Text>
            <Stack>
                {options.map((option) => (
                    <GoogleTableOptionsItem
                        acceptedFields={acceptedFields}
                        key={option.id}
                        item={option}
                        refetch={handleFetchOptions}
                    />
                ))}
            </Stack>
            <AddGoogleTableOptions
                refetch={handleFetchOptions}
                projectId={projectId}
                acceptedFields={acceptedFields}
            />
        </Stack>
    );
};
