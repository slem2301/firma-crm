import { Box, Flex, Text } from "@chakra-ui/react";
import React from "react";
import { MdDelete } from "react-icons/md";
import EditableText from "../../components/editableText/EditableText";
import { FetchStatus, FETCH_STATUS } from "../../const/http-codes";
import { ICost } from "../../models/cost";
import costService from "../../services/cost-service";
import PreSymbol from "./PreSymbol";

interface CostRowProps {
    cost: ICost;
    setStatus: (status: FetchStatus) => void;
    onUpdated: () => void;
}

const CostRow: React.FC<CostRowProps> = ({ cost, onUpdated, setStatus }) => {
    const isRefill = cost.type === "REFILL";

    const updateCost = async (data: { comment: string; amount: number }) => {
        setStatus(FETCH_STATUS.RELOADING);
        try {
            await costService.updateCost({
                id: cost.id,
                ...data,
            });
            onUpdated();
        } catch (e) {
            setStatus(FETCH_STATUS.ERROR);
        }
    };

    const deleteCost = async () => {
        setStatus(FETCH_STATUS.RELOADING);
        try {
            await costService.deleteCostById(cost.id);
            onUpdated();
        } catch (e) {
            setStatus(FETCH_STATUS.ERROR);
        }
    };

    const saveComment = (comment: string) => {
        updateCost({ comment, amount: cost.currencyAmount });
    };

    const saveAmount = (amount: string) => {
        updateCost({ amount: Number(amount), comment: cost.comment });
    };

    return (
        <Flex
            p={2}
            borderWidth={1}
            alignItems="center"
            _hover={{ bg: "gray.100" }}
            gap={1}
            fontSize={{ base: "3.5vw", sm: "1em" }}
        >
            <EditableText
                w="40%"
                text={cost.comment || "--"}
                onSave={saveComment}
            >
                <Text>{cost.comment || "--"}</Text>
            </EditableText>

            <EditableText
                text={cost.currencyAmount.toString()}
                onSave={saveAmount}
            >
                <PreSymbol isRefill={isRefill} />
                {cost.currencyAmount}&nbsp;
                <Text as="span" color="green.500">
                    {cost.currency.symbol}
                </Text>
            </EditableText>
            <Text></Text>
            <Text flexGrow={1} textAlign="right">
                {new Date(cost.date).toLocaleDateString("ru")}
            </Text>
            <Box
                onClick={deleteCost}
                color={"red"}
                cursor="pointer"
                p={1}
                opacity={0}
                _hover={{ opacity: 1 }}
            >
                <MdDelete />
            </Box>
        </Flex>
    );
};

export default CostRow;
