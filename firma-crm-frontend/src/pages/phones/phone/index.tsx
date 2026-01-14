import { useCallback, useEffect, useState } from "react";
import Page from "../../../components/ui/page/Page";
import { useParams } from "react-router-dom";
import phoneService from "../../../services/phone-service";
import { IPhone } from "../../../models/IPhone";
import { Box, Text } from "@chakra-ui/react";
import JsonView from "@uiw/react-json-view";
import { lightTheme } from "@uiw/react-json-view/light";
import { useAppSelector } from "../../../hooks/redux";
import { PhonePage } from "./Phone";

export const Phone = () => {
    const { id } = useParams();
    const [isLoading, setIsLoading] = useState(true);
    const [phone, setPhone] = useState<IPhone | null>(null);
    const [errorInfo, setErrorInfo] = useState<any>("");
    const { from, to } = useAppSelector((state) => state.app.period);

    const fetchPhone = useCallback(() => {
        setIsLoading(true);
        setErrorInfo("");
        phoneService
            .getById(id!, from, to)
            .then((r) => setPhone(r.data))
            .catch((e) => {
                setErrorInfo(e.response);
            })
            .finally(() => setIsLoading(false));
    }, [id, from, to]);

    useEffect(() => {
        fetchPhone();
    }, [fetchPhone]);

    return (
        <Page>
            {isLoading && <Text textAlign={"center"}>Загрузка...</Text>}
            {errorInfo && (
                <>
                    <Text>Error:</Text>
                    <Box as={"div"} color="red">
                        <JsonView value={errorInfo} style={lightTheme} />
                    </Box>
                </>
            )}
            {phone && <PhonePage phone={phone} />}
        </Page>
    );
};
