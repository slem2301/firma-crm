import {
    AccordionButton,
    AccordionIcon,
    AccordionItem,
    AccordionPanel,
    Box,
    IconButton,
    Text,
} from "@chakra-ui/react";
import React from "react";
import { FaPlus } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom";
import { FetchStatus } from "../../const/http-codes";
import { ROUTES } from "../../router/routes";
import { getPathWithParam } from "../../utils/getPathWithParam";
import { Category } from "./Cost";
import CostRow from "./CostRow";

interface CostCategoryProps {
    category: Category;
    setStatus: (status: FetchStatus) => void;
    onUpdated: () => void;
}

const CostCategory: React.FC<CostCategoryProps> = ({
    category,
    onUpdated,
    setStatus,
}) => {
    const { id } = useParams();
    const navigate = useNavigate();
    const isAccount = category.accountId !== null;

    const handleAdd = (e: React.MouseEvent) => {
        e.stopPropagation();

        const params: Record<string, any> = {
            currencyId: category.costs[0]?.currencyId,
            categoryId: category.id,
            type: category.type,
            balanceType: category.balanceType,
            autoFocus: true,
        };

        if (isAccount) {
            params.accountId = category.accountId;
        }

        const search = `?${Object.keys(params)
            .map((key) => `${key}=${params[key]}`)
            .join("&")}`;

        navigate(getPathWithParam(ROUTES.addCost.path, id as string) + search, {
            replace: true,
        });
    };

    return (
        <AccordionItem>
            <h2>
                <AccordionButton
                    lineHeight={1.2}
                    borderTopColor={"blue.500"}
                    borderWidth={1}
                    borderTopWidth={3}
                    fontWeight={500}
                    fontSize={{ base: ".9em", sm: "1em" }}
                >
                    <IconButton
                        as="span"
                        aria-label="add cost"
                        icon={<FaPlus />}
                        size="xs"
                        colorScheme="green"
                        mr={3}
                        onClick={handleAdd}
                    />
                    <Box as="span" flex="1" textAlign="left">
                        {category.name}
                    </Box>
                    <Text px={3}>
                        {category.total}{" "}
                        <Text as="span" color="green.500">
                            $
                        </Text>
                        {isAccount && (
                            <Text as="span">
                                {" "}
                                / {category.initial}{" "}
                                <Text as="span" color="green.500">
                                    $
                                </Text>
                            </Text>
                        )}
                    </Text>
                    <AccordionIcon />
                </AccordionButton>
            </h2>
            <AccordionPanel pb={4} px={0}>
                {category.costs.map((cost) => (
                    <CostRow
                        onUpdated={onUpdated}
                        setStatus={setStatus}
                        key={cost.id}
                        cost={cost}
                    />
                ))}
            </AccordionPanel>
        </AccordionItem>
    );
};

export default CostCategory;
