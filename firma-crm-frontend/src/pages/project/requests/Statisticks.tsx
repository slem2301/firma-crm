import {
    Flex,
    Heading,
    Spinner,
    Stat,
    StatGroup,
    StatLabel,
    StatNumber,
    VStack,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import AnimatedNumber from "../../../components/ui/animated-number/AnimatedNumber";
import { SUCCESS_POST } from "../../../const/http-codes";
import { useAppSelector } from "../../../hooks/redux";
import { IProjectStatisticks } from "../../../models/IProject";
import projectService from "../../../services/project-service";
import { FieldType } from "../../statisticks/requestStatisticks/CommonChart";

type StatisticksProps = {
    id: number;
};

const Statisticks: React.FC<StatisticksProps> = ({ id }) => {
    const { period } = useAppSelector((state) => state.app);

    const [loading, setLoading] = useState(true);

    const [data, setData] = useState<IProjectStatisticks>();

    const fields: FieldType[] = useMemo(
        () => [
            {
                name: "Доход",
                value: data?.earn || 0,
                addon: "$",
                addonProps: { color: "green.500" },
                dots: 2,
            },
            {
                name: "Расход",
                value: data?.expenses || 0,
                addon: "$",
                addonProps: { color: "green.500" },
                dots: 2,
            },
            {
                name: "Заказов",
                value: data?.orders || 0,
            },
            {
                name: "Ст. Заказа",
                value: data?.orderCost || 0,
                addon: "$",
                addonProps: { color: "green.500" },
                dots: 2,
            },
            {
                name: "Заявок",
                value: data?.requests || 0,
            },
            {
                name: "Ст. Заявки",
                value: data?.requestCost || 0,
                addon: "$",
                addonProps: { color: "green.500" },
                dots: 2,
            },
        ],
        [data]
    );

    const fetchData = useCallback(async () => {
        setLoading(true);
        try {
            const response = await projectService.getStatisticks({
                period,
                projectId: id,
            });

            if (response.status === SUCCESS_POST) setData(response.data);
        } catch (e) {}
        setLoading(false);
    }, [period, id]);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (loading)
        return (
            <Flex
                w={"100%"}
                rounded={8}
                borderWidth={1}
                p={4}
                justifyContent="center"
                align="center"
                color={"blue.500"}
            >
                <Spinner thickness="5px" w="40px" h="40px" />
            </Flex>
        );

    return (
        <VStack
            alignItems={"stretch"}
            w={"100%"}
            rounded={8}
            borderWidth={1}
            p={4}
        >
            <Heading size="sm" pb={3}>
                Общая статистика
            </Heading>
            <StatGroup
                gap={4}
                flexWrap={"wrap"}
                w={"100%"}
                justifyContent="flex-start"
            >
                {fields.map((field, i) => {
                    return (
                        <Stat
                            key={i}
                            maxW={{ base: "auto", md: "25%" }}
                            minW={{ base: "45%", md: "auto" }}
                        >
                            <StatLabel lineHeight={1} whiteSpace={"nowrap"}>
                                {field.name}
                            </StatLabel>
                            <StatNumber whiteSpace={"nowrap"}>
                                <AnimatedNumber
                                    fontSize={{ base: "20px", sm: "24px" }}
                                    number={field.value}
                                    dots={field.dots}
                                    addonProps={field.addonProps}
                                    addon={field.addon}
                                />
                            </StatNumber>
                        </Stat>
                    );
                })}
            </StatGroup>
        </VStack>
    );
};

export default Statisticks;
