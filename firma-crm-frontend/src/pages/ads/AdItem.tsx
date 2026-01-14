import { Badge, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { IAd } from "../../models/IAd";
import { motion } from "framer-motion";
import { FaCheck } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useAppSelector } from "../../hooks/redux";
import { getBalanceZone } from "../statisticks/balanceStatisticks/utils";
import { LIMIT_BG } from "../../const/colors";

type AdItemProps = {
    ad: IAd;
    disabled: boolean;
};

const AdItem: React.FC<AdItemProps> = ({ ad, disabled }) => {
    const balanceLimits = useAppSelector((state) => state.ad.balanceLimits);
    const { login, token, type } = ad;

    const limitColor = useMemo(() => {
        const zone = getBalanceZone(ad.balance, ad.currency.key, balanceLimits);

        return LIMIT_BG[zone];
    }, [ad, balanceLimits]);

    return (
        <motion.div
            initial={{ opacity: 0, transform: "scale(.8)" }}
            animate={{ opacity: 1, transform: "scale(1)" }}
        >
            <Link to={`/ad/${login}`}>
                <VStack
                    borderWidth={1}
                    borderTopWidth={5}
                    borderTopColor={limitColor}
                    shadow="md"
                    minH="7em"
                    p={2}
                    cursor={disabled ? "initial" : "pointer"}
                    align="stretch"
                    transition={"transform .2s ease"}
                    _hover={{ transform: disabled ? {} : "scale(1.05)" }}
                >
                    <HStack
                        justifyContent={"space-between"}
                        alignItems="flex-start"
                    >
                        <Text fontWeight={500}>{login}</Text>
                        <Text whiteSpace={"nowrap"}>
                            {ad.balance}{" "}
                            <Text as="span" color="green.500">
                                {ad.currency.symbol}
                            </Text>
                        </Text>
                    </HStack>
                    {type === "yandex" && (
                        <Flex flexGrow={1} alignItems="flex-end">
                            <Flex
                                w="100%"
                                alignItems="center"
                                justifyContent={"flex-end"}
                                gap={2}
                            >
                                <Badge colorScheme={token ? "green" : "red"}>
                                    {token ? (
                                        <Flex alignItems={"center"} gap={1}>
                                            <FaCheck /> В работе
                                        </Flex>
                                    ) : (
                                        "Токен не получен"
                                    )}
                                </Badge>
                            </Flex>
                        </Flex>
                    )}
                </VStack>
            </Link>
        </motion.div>
    );
};

export default AdItem;
