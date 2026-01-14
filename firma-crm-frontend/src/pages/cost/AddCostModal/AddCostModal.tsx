import {
    Button,
    FormControl,
    FormErrorMessage,
    FormLabel,
    Input,
    Modal,
    ModalBody,
    ModalCloseButton,
    ModalContent,
    ModalFooter,
    ModalHeader,
    ModalOverlay,
    Textarea,
    useConst,
    VStack,
} from "@chakra-ui/react";
import { CanceledError } from "axios";
import React, { useCallback, useEffect, useState } from "react";
import ReactDatePicker from "react-datepicker";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import ModalLoader from "../../../components/ui/modal-loading/ModalLoader";
import {
    FetchStatus,
    FETCH_STATUS,
    SUCCESS_GET,
    SUCCESS_POST,
} from "../../../const/http-codes";
import { useSearchParams } from "../../../hooks/useSearchParams";
import { ICostCategory } from "../../../models/cost";
import { CostBalanceType, CostType } from "../../../models/cost/ICost";
import { ROUTES } from "../../../router/routes";
import costService from "../../../services/cost-service";
import { getPathWithParam } from "../../../utils/getPathWithParam";
import CategoryFilter from "./CategoryFilter";
import CostBalanceTypeFilter from "./CostBalanceTypeFilter";
import CostTypeFilter from "./CostTypeFilter";
import CurrencyFilter from "./CurrencyFilter";

type FormState = {
    comment: string;
    amount: string;
    name: string;
};

const initialFormState: FormState = {
    comment: "",
    amount: "",
    name: "iContext",
};

interface AddCostModalProps {
    onCreated: () => void;
}

const AddCostModal: React.FC<AddCostModalProps> = ({ onCreated }) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { params } = useSearchParams();

    const [status, setStatus] = useState<FetchStatus>(FETCH_STATUS.IDLE);
    const [categories, setCategories] = useState<ICostCategory[] | null>(null);

    const currentDate = useConst(() => new Date());
    const [date, setDate] = useState(currentDate);
    const [type, setType] = useState<CostType>("PAYMENT");
    const [balanceType, setBalanceType] = useState<CostBalanceType>("USD");
    const [currencyId, setCurrencyId] = useState(0);
    const [categoryId, setCategoryId] = useState(() => {
        if (!categories) return 1;
        return categories[0].id;
    });

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<FormState>({
        mode: "onSubmit",
        defaultValues: initialFormState,
    });

    const isLoading = status === FETCH_STATUS.LOADING;
    const isFetching = status === FETCH_STATUS.RELOADING;

    const handleClose = () => {
        if (isFetching) return;
        navigate(getPathWithParam(ROUTES.cost.path, id as string), {
            replace: true,
        });
    };

    const fetchCategories = useCallback(async () => {
        setStatus(FETCH_STATUS.LOADING);
        try {
            const response = await costService.getAllCategories();

            if (response.status === SUCCESS_GET) {
                setCategories(response.data);
                setStatus(FETCH_STATUS.SUCCESS);
            }
        } catch (e) {
            if (!(e instanceof CanceledError)) {
                setStatus(FETCH_STATUS.ERROR);
            }
        }
    }, []);

    useEffect(() => {
        fetchCategories();
    }, [fetchCategories]);

    const createCost = async (data: FormState) => {
        setStatus(FETCH_STATUS.RELOADING);
        try {
            const response = await costService.createCost({
                accountId: Number(params.accountId) || Number(id),
                categoryId,
                currencyId,
                type,
                balanceType,
                amount: Number(data.amount),
                comment: data.comment,
                date,
            });

            if (response.status === SUCCESS_POST) {
                onCreated();
                handleClose();
            }
        } catch (e) {
            setStatus(FETCH_STATUS.ERROR);
        }
    };

    const createAccount = async (data: FormState) => {
        setStatus(FETCH_STATUS.RELOADING);
        try {
            const response = await costService.createAccount({
                name: data.name,
                balance: Number(data.amount),
                accountId: Number(id),
            });

            if (response.status === SUCCESS_POST) {
                onCreated();
                handleClose();
            }
        } catch (e) {
            setStatus(FETCH_STATUS.ERROR);
        }
    };

    const onSubmit = async (data: FormState) => {
        if (type === "ACCOUNT") return createAccount(data);

        createCost(data);
    };

    return (
        <Modal isOpen={true} onClose={handleClose} scrollBehavior="inside">
            <ModalOverlay />
            {isLoading ? (
                <ModalLoader />
            ) : (
                categories && (
                    <ModalContent>
                        <ModalHeader>Добавление записи</ModalHeader>
                        <ModalCloseButton />
                        <ModalBody as={VStack} align="stretch" spacing={1}>
                            <FormControl>
                                <FormLabel>Тип записи</FormLabel>
                                <CostTypeFilter type={type} setType={setType} />
                            </FormControl>

                            {type !== "ACCOUNT" && !params.accountId && (
                                <FormControl>
                                    <FormLabel>Баланс</FormLabel>
                                    <CostBalanceTypeFilter
                                        balanceType={balanceType}
                                        setBalanceType={setBalanceType}
                                    />
                                </FormControl>
                            )}
                            {type !== "ACCOUNT" && (
                                <FormControl>
                                    <FormLabel>Валюта</FormLabel>
                                    <CurrencyFilter
                                        currencyId={currencyId}
                                        balanceType={balanceType}
                                        setCurrencyId={setCurrencyId}
                                    />
                                </FormControl>
                            )}

                            {type === "PAYMENT" && !params.accountId && (
                                <FormControl>
                                    <FormLabel>Категория</FormLabel>
                                    <CategoryFilter
                                        categoryId={categoryId}
                                        categories={categories}
                                        setCategoryId={setCategoryId}
                                        balanceType={balanceType}
                                    />
                                </FormControl>
                            )}
                            <FormControl isInvalid={!!errors.amount}>
                                <FormLabel>Сумма</FormLabel>
                                <Input
                                    autoFocus={!!params.autoFocus}
                                    type="number"
                                    placeholder="0"
                                    {...register("amount", {
                                        required: {
                                            value: true,
                                            message: "Поле обязательно",
                                        },
                                    })}
                                />
                                <FormErrorMessage>
                                    <>{errors.amount?.message}</>
                                </FormErrorMessage>
                            </FormControl>
                            {type !== "ACCOUNT" ? (
                                <FormControl isInvalid={!!errors.comment}>
                                    <FormLabel>Комментарий</FormLabel>
                                    <Textarea
                                        placeholder="Комментарий"
                                        {...register("comment")}
                                    />
                                    <FormErrorMessage>
                                        <>{errors.comment?.message}</>
                                    </FormErrorMessage>
                                </FormControl>
                            ) : (
                                <FormControl isInvalid={!!errors.name}>
                                    <FormLabel>Название</FormLabel>
                                    <Input
                                        placeholder="iContext"
                                        {...register("name", {
                                            required: {
                                                value: true,
                                                message: "Поле обязательно",
                                            },
                                        })}
                                    />
                                    <FormErrorMessage>
                                        <>{errors.name?.message}</>
                                    </FormErrorMessage>
                                </FormControl>
                            )}

                            {type !== "ACCOUNT" && (
                                <FormControl>
                                    <FormLabel>Дата</FormLabel>
                                    <ReactDatePicker
                                        locale={"ru"}
                                        onChange={(date) =>
                                            setDate(date || currentDate)
                                        }
                                        selected={date}
                                        dateFormat="dd.MM.yyyy"
                                        customInput={
                                            <Input
                                                size="sm"
                                                placeholder="Выберите дату"
                                            />
                                        }
                                    />
                                </FormControl>
                            )}
                        </ModalBody>

                        <ModalFooter>
                            <Button
                                size="sm"
                                colorScheme="blue"
                                mr={3}
                                onClick={handleClose}
                                isDisabled={isFetching}
                            >
                                Отмена
                            </Button>
                            <Button
                                isLoading={isFetching}
                                loadingText="Сохранение..."
                                onClick={handleSubmit(onSubmit)}
                                size="sm"
                                colorScheme="green"
                            >
                                Сохранить
                            </Button>
                        </ModalFooter>
                    </ModalContent>
                )
            )}
        </Modal>
    );
};

export default AddCostModal;
