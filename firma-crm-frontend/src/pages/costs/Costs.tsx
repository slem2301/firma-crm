import { Button, Flex, Grid, useBoolean, VStack } from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import Loader from "../../components/ui/loader/Loader";
import Page from "../../components/ui/page/Page";
import { FETCH_STATUS, SUCCESS_GET } from "../../const/http-codes";
import { ICostAccount } from "../../models/cost";
import { ROUTES } from "../../router/routes";
import costService from "../../services/cost-service";
import { getPathWithParam } from "../../utils/getPathWithParam";
import CostAccount from "./CostAccount";
import CreateAccount from "./CreateAccount";

const Costs = () => {
    const navigate = useNavigate();
    const [status, setStatus] = useState(FETCH_STATUS.IDLE);
    const [accounts, setAccounts] = useState<ICostAccount[] | null>(null);
    const [createDrawer, setCreateDrawer] = useBoolean(false);

    const isLoading = status === FETCH_STATUS.LOADING;

    const fetchAccounts = useCallback(async () => {
        setStatus(FETCH_STATUS.LOADING);
        try {
            const response = await costService.getAllAccounts();

            if (response.status === SUCCESS_GET) {
                setAccounts(response.data);
                setStatus(FETCH_STATUS.SUCCESS);
            }
        } catch (e) {
            setStatus(FETCH_STATUS.ERROR);
        }
    }, []);

    const onAccountCreated = (account: ICostAccount) => {
        navigate(getPathWithParam(ROUTES.cost.path, account.id));
    };

    useEffect(() => {
        fetchAccounts();
    }, [fetchAccounts]);

    if (isLoading) return <Loader />;

    return (
        <Page>
            <VStack align="stretch">
                <Flex gap={2}>
                    <Button
                        size="sm"
                        colorScheme="green"
                        leftIcon={<FaPlus />}
                        onClick={setCreateDrawer.on}
                    >
                        Добавить период
                    </Button>
                </Flex>
                {accounts && (
                    <Grid
                        templateColumns={{
                            xl: "repeat(5, 1fr)",
                            lg: "repeat(4, 1fr)",
                            md: "repeat(3, 1fr)",
                            sm: "repeat(2, 1fr)",
                            base: "repeat(1, 1fr)",
                        }}
                        gap={3}
                        position="relative"
                    >
                        {accounts.map((account) => (
                            <CostAccount account={account} key={account.id} />
                        ))}
                    </Grid>
                )}
            </VStack>
            <CreateAccount
                onCreated={onAccountCreated}
                isOpen={createDrawer}
                onClose={setCreateDrawer.off}
            />
        </Page>
    );
};

export default Costs;
