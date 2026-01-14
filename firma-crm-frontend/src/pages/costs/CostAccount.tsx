import React from "react";
import { ICostAccount } from "../../models/cost";
import { Link } from "react-router-dom";
import { HStack, Text, VStack } from "@chakra-ui/react";
import AnimationBounce from "../../components/ui/animation-bounce/AnimationBounce";

interface CostAccountProps {
    account: ICostAccount;
}

const CostAccount: React.FC<CostAccountProps> = ({ account }) => {
    return (
        <AnimationBounce>
            <Link to={`/cost/${account.id}`}>
                <VStack
                    borderWidth={1}
                    shadow="md"
                    minH="7em"
                    p={2}
                    cursor={"pointer"}
                    align="stretch"
                    transition={"transform .2s ease"}
                    _hover={{ transform: "scale(1.05)" }}
                >
                    <HStack
                        justifyContent={"space-between"}
                        alignItems="flex-start"
                    >
                        <Text fontWeight={500}>{account.name}</Text>
                        <Text whiteSpace={"nowrap"}>
                            {account.balance}{" "}
                            <Text as="span" color="green.500">
                                $
                            </Text>
                        </Text>
                    </HStack>
                </VStack>
            </Link>
        </AnimationBounce>
    );
};

export default CostAccount;
