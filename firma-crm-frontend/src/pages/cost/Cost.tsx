import {
    Accordion,
    Flex,
    Heading,
    IconButton,
    Progress,
    Text,
} from "@chakra-ui/react";
import { CanceledError } from "axios";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { FaPlus } from "react-icons/fa";
import { MdDelete } from "react-icons/md";
import { useNavigate, useParams } from "react-router-dom";
import ConfirmDialog from "../../components/confirmDialog/ConfirmDialog";
import EditableText from "../../components/editableText/EditableText";
import AnimationBounce from "../../components/ui/animation-bounce/AnimationBounce";
import GoBackButton from "../../components/ui/goBack/GoBackButton";
import Loader from "../../components/ui/loader/Loader";
import Page from "../../components/ui/page/Page";
import { FETCH_STATUS, SUCCESS_GET } from "../../const/http-codes";
import useAppToast from "../../hooks/useAppToast";
import { useLatest } from "../../hooks/useLatest";
import { ICost, ICostAccount } from "../../models/cost";
import {
    CostBalanceType,
    CostType,
    COST_BALANCE_TYPE,
    COST_TYPE,
} from "../../models/cost/ICost";
import { ROUTES } from "../../router/routes";
import costService from "../../services/cost-service";
import { getPathWithParam } from "../../utils/getPathWithParam";
import AddCostModal from "./AddCostModal/AddCostModal";
import CostCategory from "./CostCategory";

export type Category = {
    name: string;
    costs: ICost[];
    total: number;
    sort: number;
    type: CostType;
    id: number;
    balanceType: CostBalanceType;
    accountId: number | null;
    initial?: number;
};

interface CostProps {
    mode?: "initial" | "add";
}

const Cost: React.FC<CostProps> = ({ mode }) => {
    const [status, setStatus] = useState(FETCH_STATUS.LOADING);
    const toast = useAppToast();
    const [confirmDialog, setConfirmDialog] = useState(false);
    const navigate = useNavigate();
    const { id } = useParams();
    const [account, setAccount] = useState<ICostAccount | null>(null);

    const categories: Category[] = useMemo(() => {
        if (!account) return [];

        const categories: Record<string, Category> = {};

        account.costs.forEach((cost) => {
            let sort = 1;
            let categoryName = cost.category.name;
            let type: CostType = COST_TYPE.PAYMENT;

            if (cost.type === COST_TYPE.REFILL) {
                categoryName = "Пополнения";
                sort = 4;
                type = COST_TYPE.REFILL;
            }

            const category = categories[categoryName];

            if (category) {
                category.costs.push(cost);
                category.total += cost.amount;
                return;
            }

            categories[categoryName] = {
                name: categoryName,
                costs: [cost],
                total: cost.amount,
                sort,
                type,
                id: cost.category.id,
                balanceType: cost.category.balanceType,
                accountId: null,
            };
        });

        const childAccounts: Category[] = account.accounts.map((account) => ({
            name: account.name,
            total: account.balance,
            sort: 3,
            type: COST_TYPE.PAYMENT,
            costs: account.costs,
            id: 1,
            balanceType: COST_BALANCE_TYPE.USD,
            accountId: account.id,
            initial: account.initialBalance,
        }));

        return Object.values(categories)
            .concat(childAccounts)
            .sort((c1, c2) => c1.sort - c2.sort);
    }, [account]);

    const isLoading = status === FETCH_STATUS.LOADING;
    const isReloading = status === FETCH_STATUS.RELOADING;
    const isError = status === FETCH_STATUS.ERROR;

    const latestAccount = useLatest(account);

    const fetchAccount = useCallback(async () => {
        setStatus(
            latestAccount.current
                ? FETCH_STATUS.RELOADING
                : FETCH_STATUS.LOADING
        );
        try {
            const response = await costService.getAccountById(Number(id));

            if (response.status === SUCCESS_GET) {
                setAccount(response.data);
                setStatus(FETCH_STATUS.SUCCESS);
            }
        } catch (e) {
            if (!(e instanceof CanceledError)) {
                setStatus(FETCH_STATUS.ERROR);
            }
        }
    }, [id, latestAccount]);

    useEffect(() => {
        fetchAccount();
    }, [fetchAccount]);

    const changeName = async (name: string) => {
        setStatus(FETCH_STATUS.RELOADING);
        try {
            await costService.updateAccount({ id: Number(id), name });
            await fetchAccount();
        } catch (e) {
            setStatus(FETCH_STATUS.ERROR);
        }
    };

    const handleDeleteAccount = async () => {
        setConfirmDialog(false);
        if (!account) return;

        setStatus(FETCH_STATUS.RELOADING);
        try {
            await costService.deleteAccountById(account.id);
            navigate("/statisticks/costs");
            toast({
                text: `Период ${account.name} удалён успешно.`,
            });
        } catch (e) {
            toast({
                status: "error",
                text: `Что-то пошло не так...`,
            });
        }
    };

    if (isLoading) return <Loader />;

    return (
        <Page>
            <GoBackButton to={"/costs"} />
            {isReloading && <Progress isIndeterminate size="xs" />}
            {isError ? (
                <Heading textAlign={"center"}>Аккаунт не найден.</Heading>
            ) : (
                account && (
                    <>
                        <AnimationBounce>
                            <Flex
                                fontWeight={500}
                                borderWidth={1}
                                alignItems={"center"}
                                flexWrap="wrap"
                                gap={2}
                                p={3}
                            >
                                <EditableText
                                    flexGrow={1}
                                    text={account.name}
                                    onSave={changeName}
                                >
                                    <Text>{account.name}</Text>
                                </EditableText>
                                <IconButton
                                    size="sm"
                                    aria-label="add cost"
                                    icon={<FaPlus />}
                                    colorScheme="green"
                                    onClick={() =>
                                        navigate(
                                            getPathWithParam(
                                                ROUTES.addCost.path,
                                                account.id
                                            ),
                                            { replace: true }
                                        )
                                    }
                                />
                                <IconButton
                                    size="sm"
                                    aria-label="delete account"
                                    icon={<MdDelete />}
                                    colorScheme="red"
                                    onClick={() => setConfirmDialog(true)}
                                />
                                <Flex
                                    justifyContent={"flex-end"}
                                    w={{ base: "100%", md: "auto" }}
                                    gap={2}
                                >
                                    <Text
                                        flexGrow={1}
                                        pl={{ base: 0, md: 3 }}
                                        borderLeftWidth={{ base: 0, md: 1 }}
                                    >
                                        Общий: {account.balance}{" "}
                                        <Text as="span" color="green.500">
                                            $
                                        </Text>{" "}
                                    </Text>
                                    <Text
                                        flexGrow={1}
                                        pl={{ base: 0, md: 3 }}
                                        borderLeftWidth={{ base: 0, md: 1 }}
                                    >
                                        РФ: {account.balanceRu}{" "}
                                        <Text as="span" color="green.500">
                                            ₽
                                        </Text>{" "}
                                    </Text>
                                </Flex>
                            </Flex>
                        </AnimationBounce>
                        <AnimationBounce transition={{ delay: 0.2 }}>
                            <Accordion
                                defaultIndex={categories.map((_, i) => i)}
                                allowMultiple
                            >
                                {categories.map((category) => (
                                    <CostCategory
                                        key={category.name}
                                        category={category}
                                        setStatus={setStatus}
                                        onUpdated={fetchAccount}
                                    />
                                ))}
                            </Accordion>
                        </AnimationBounce>
                        {mode === "add" && (
                            <AddCostModal onCreated={fetchAccount} />
                        )}
                        <ConfirmDialog
                            isOpen={confirmDialog}
                            title="Удаление периода"
                            text={`Вы действительно хотите удалить период ${account.name}`}
                            onAccept={handleDeleteAccount}
                            onCancel={() => setConfirmDialog(false)}
                        />
                    </>
                )
            )}
        </Page>
    );
};

export default Cost;
