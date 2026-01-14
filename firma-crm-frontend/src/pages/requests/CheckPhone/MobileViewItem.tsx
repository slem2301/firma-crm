import {
    Box,
    Flex,
    BoxProps,
    FormLabel,
    Heading,
    Text,
    VStack,
} from "@chakra-ui/react";
import React from "react";
import { InfoType } from "./CheckPhones";

type MobileViewItemProps = {
    item: InfoType;
} & BoxProps;

const MobileViewItem: React.FC<MobileViewItemProps> = ({ item, ...props }) => {
    return (
        <VStack
            align="stretch"
            rounded={2}
            borderWidth={1}
            p={2}
            spacing={2}
            lineHeight={1.2}
            {...props}
        >
            <Flex justifyContent={"space-between"}>
                <Heading size="sm">#{item.id}</Heading>
                <Text fontWeight={500}>{item.dealer}</Text>
            </Flex>
            <FormLabel>
                <Text as="span" color="blue.500">
                    Статус:
                </Text>{" "}
                {item.status}
            </FormLabel>
            <FormLabel>
                <Text as="span" color="blue.500">
                    Сумма заказа:
                </Text>{" "}
                {item.price} руб.
            </FormLabel>
            <FormLabel color="blue.500">Номера:</FormLabel>
            <Box>
                {item.phones.map((phone, i, arr) => (
                    <Text key={i}>
                        {phone}
                        {i !== arr.length - 1 && ","}
                    </Text>
                ))}
            </Box>
            <FormLabel color="blue.500">Товары:</FormLabel>
            <Flex flexDirection="column" gap={1}>
                {item.products.map((product, i) => (
                    <Flex gap={1} key={i}>
                        <Text>-</Text>
                        <Text
                            key={i}
                            dangerouslySetInnerHTML={{ __html: `${product}` }}
                        />
                    </Flex>
                ))}
            </Flex>
            <Text fontWeight={500} textAlign="right">
                {item.date}
            </Text>
        </VStack>
    );
};

export default MobileViewItem;
