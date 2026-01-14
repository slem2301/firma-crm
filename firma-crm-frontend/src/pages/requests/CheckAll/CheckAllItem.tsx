import { Box, Flex, Text, VStack } from "@chakra-ui/react";
import React from "react";
import MobileViewItem from "../CheckPhone/MobileViewItem";
import { ResultItem } from "./CheckAll";

type CheckAllItemProps = {
    item: ResultItem;
};

const CheckAllItem: React.FC<CheckAllItemProps> = ({ item }) => {
    return (
        <Flex
            gap={2}
            borderWidth={1}
            py={{ base: 2, sm: 0 }}
            pe={{ base: 2, sm: 0 }}
            ps={2}
            flexDirection={{ base: "column", sm: "row" }}
        >
            <Box w="200px" py={2}>
                <Text color="blue.500" fontWeight={500}>
                    Заявка{" "}
                    <Text as="span" color="gray.800">
                        #{item.id}
                    </Text>
                </Text>
                <Text color="blue.500" fontWeight={500}>
                    Номер:{" "}
                    <Text as="span" color="gray.800">
                        {item.phone}
                    </Text>
                </Text>
            </Box>
            <VStack
                align="stretch"
                borderTopWidth={{ base: 1, sm: 0 }}
                borderRightWidth={{ base: 1, sm: 0 }}
                borderBottomWidth={{ base: 1, sm: 0 }}
                borderLeftWidth={1}
                flexGrow={1}
            >
                {item.info.length ? (
                    item.info.map((infoItem, i) => (
                        <MobileViewItem
                            borderWidth={0}
                            borderTopWidth={i !== 0 ? 1 : 0}
                            key={infoItem.id}
                            item={infoItem}
                        />
                    ))
                ) : (
                    <Text p={2}>Заказов на этот номер не обнаружено.</Text>
                )}
            </VStack>
        </Flex>
    );
};

export default CheckAllItem;
