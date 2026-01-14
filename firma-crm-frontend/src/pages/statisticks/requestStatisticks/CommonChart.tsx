import {
    Box,
    Divider,
    Flex,
    Heading,
    HStack,
    Stat,
    StatGroup,
    StatHelpText,
    StatLabel,
    StatNumber,
    Text,
    TextProps,
    VStack,
} from "@chakra-ui/react";
import React, {
    PropsWithChildren,
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";
import { useAppDispatch, useAppSelector } from "../../../hooks/redux";
import AnimatedNumber from "../../../components/ui/animated-number/AnimatedNumber";
import { getCommonStatisticks } from "../../../store/slices/statisticks-slice";
import CountryFilter from "../../../components/filters/CountryFilter";
import ProductFilter from "../../../components/filters/ProductFilter";
import UpdateButton from "../../../components/ui/button/UpdateButton";
import ArraySwitcher from "../../../components/ui/array-switcher/ArraySwitcher";

type CommonChartProps = {
    countryIds: number[];
    productIds: number[];
    setProductIds: (ids: number[]) => void;
    setCountryIds: (ids: number[]) => void;
};

export type FieldType = {
    name: string;
    value: number;
    addon?: string;
    dots?: number;
    addonProps?: TextProps;
    disableTotal?: boolean;
};

type SafeCommonStat = {
    requests: {
        total: number;
        yandex: number;
        google: number;
        other: number;
        calls: number;
    };
    orders: {
        total: number;
        zakaz: number;
        pred: number;
        povtor: number;
    };
    expenses: {
        earn: number;
        expense: number;
        supposed: number;
        requestCost: number;
        orderCost: number;
    };
};

const EMPTY_COMMON: SafeCommonStat = {
    requests: { total: 0, yandex: 0, google: 0, other: 0, calls: 0 },
    orders: { total: 0, zakaz: 0, pred: 0, povtor: 0 },
    expenses: { earn: 0, expense: 0, supposed: 0, requestCost: 0, orderCost: 0 },
};

const CommonChart: React.FC<CommonChartProps> = ({
    countryIds,
    productIds,
    setCountryIds,
    setProductIds,
}) => {
    const {
        stat: { commonLoading, commonStatistick },
        app: { period },
    } = useAppSelector((state) => state);

    const dispatch = useAppDispatch();

    // 1) всегда работаем только с safeCommon
    const safeCommon: SafeCommonStat = useMemo(() => {
        return (commonStatistick as SafeCommonStat) ?? EMPTY_COMMON;
    }, [commonStatistick]);

    const [percent, setPercent] = useState(100);

    const earn = useMemo(() => {
        return (safeCommon.expenses.earn * percent) / 100;
    }, [percent, safeCommon.expenses.earn]);

    // 2) стабильный ключ фильтров (чтобы не было лишних фетчей из-за ссылок на массивы)
    const filterKey = useMemo(() => {
        const c = [...countryIds].sort((a, b) => a - b).join(",");
        const p = [...productIds].sort((a, b) => a - b).join(",");
        return `c:${c}|p:${p}`;
    }, [countryIds, productIds]);

    const fetchCommonStatisticks = useCallback(() => {
        dispatch(
            getCommonStatisticks({
                period,
                filter: {
                    countryIds,
                    productIds,
                },
            })
        );
    }, [dispatch, period, filterKey]);

    useEffect(() => {
        fetchCommonStatisticks();
    }, [fetchCommonStatisticks]);

    const requests: FieldType[] = useMemo(
        () => [
            { name: "Заявок", value: safeCommon.requests.total },
            { name: "Яндекс", value: safeCommon.requests.yandex },
            { name: "Google", value: safeCommon.requests.google },
            { name: "Другие", value: safeCommon.requests.other },
            { name: "Звонки", value: safeCommon.requests.calls, disableTotal: true },
        ],
        [safeCommon.requests]
    );

    const orders: FieldType[] = useMemo(
        () => [
            { name: "Оформленные", value: safeCommon.orders.total },
            { name: "Заказы", value: safeCommon.orders.zakaz },
            { name: "Предзаказы", value: safeCommon.orders.pred },
            { name: "Повторы", value: safeCommon.orders.povtor },
        ],
        [safeCommon.orders]
    );

    const expenses: FieldType[] = useMemo(
        () => [
            {
                name: "Чист. Доход",
                value: earn,
                addon: "$",
                addonProps: { color: "green.500" },
                dots: 2,
            },
            {
                name: "Расход",
                value: safeCommon.expenses.expense,
                addon: "$",
                addonProps: { color: "green.500" },
                dots: 2,
            },
            {
                name: "Зал. Расход",
                value: safeCommon.expenses.supposed,
                addon: "$",
                addonProps: { color: "green.500" },
                dots: 2,
            },
            {
                name: "Стоимость заявки",
                value: safeCommon.expenses.requestCost,
                addon: "$",
                addonProps: { color: "green.500" },
                dots: 2,
            },
            {
                name: "Стоимость заказа",
                value: safeCommon.expenses.orderCost,
                addon: "$",
                addonProps: { color: "green.500" },
                dots: 2,
            },
        ],
        [earn, safeCommon.expenses]
    );



    return (
        <VStack borderWidth={1} borderRadius="lg" p={4} align="flex-start" spacing={6}>
            <Flex
                w="100%"
                justifyContent="space-between"
                align="center"
                gap={2}
                flexWrap={{ base: "wrap", sm: "nowrap" }}
            >
                <Heading mb={{ base: 2, sm: 0 }} size="md">
                    Общая статистика
                </Heading>

                <Flex flexWrap="wrap" gap={2} align="center">
                    <HStack w={{ base: "100%", sm: "300px" }}>
                        <ArraySwitcher koef={1} max={100} value={percent} setValue={setPercent} />
                        <Text>{percent}%</Text>
                    </HStack>

                    <ProductFilter setIds={setProductIds} />
                    <CountryFilter setCoutryIds={setCountryIds} />

                    <UpdateButton onClick={fetchCommonStatisticks} isLoading={commonLoading} />
                </Flex>
            </Flex>

            <SectionTitle>Заказы</SectionTitle>
            <Data fields={orders} total={safeCommon.orders.total} />

            <SectionTitle>Расход</SectionTitle>
            <Data fields={expenses} />

            <SectionTitle>Заявки</SectionTitle>
            <Data fields={requests} total={safeCommon.requests.total} />
        </VStack>
    );
};



export default CommonChart;

const SectionTitle = ({ children }: PropsWithChildren) => (
    <Box w="100%">
        <Heading mb={1} fontWeight={600} fontSize="18px">
            {children}
        </Heading>
        <Divider />
    </Box>
);

type DataProps = {
    fields: FieldType[];
    total?: number;
};

const Data: React.FC<DataProps> = ({ fields, total }) => {
    const renderPercentage = (field: FieldType, percent: number) => {
        if (field.disableTotal) return null;
        if (!total) return null;

        return (
            <StatHelpText color={percent >= 75 ? "green" : percent > 25 ? "orange" : "red"}>
                <AnimatedNumber number={percent} />%
            </StatHelpText>
        );
    };

    return (
        <StatGroup gap={4} flexWrap="wrap" w="100%" justifyContent="flex-start">
            {fields.map((field, i) => {
                const percent = total ? (field.value * 100) / total : 0;

                return (
                    <Stat key={`${field.name}-${i}`} maxW={{ base: "auto", sm: "25%", lg: "19%" }} minW={{ base: "45%", sm: "auto" }}>
                        <StatLabel lineHeight={1}>{field.name}</StatLabel>
                        <StatNumber whiteSpace="nowrap">
                            <AnimatedNumber
                                fontSize={{ base: "20px", sm: "24px" }}
                                number={field.value}
                                dots={field.dots}
                                addonProps={field.addonProps}
                                addon={field.addon}
                            />
                        </StatNumber>
                        {renderPercentage(field, percent)}
                    </Stat>
                );
            })}
        </StatGroup>
    );
};
