import {
    HStack,
    Input,
    InputGroup,
    InputRightAddon,
    Text,
} from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useAppDispatch, useAppSelector } from "../../../../hooks/redux";
import { IProduct } from "../../../../models/IProduct";
import { setSaleData } from "../../../../store/slices/sale-slice";

type ProductRowProps = {
    product: IProduct;
    regionId: number;
    loading: boolean;
    autoFocus: boolean;
};

const ProductRow: React.FC<ProductRowProps> = ({
    product,
    regionId,
    autoFocus,
    loading,
}) => {
    const { addSaleData } = useAppSelector((state) => state.sale);
    const dispatch = useAppDispatch();

    const uniqKey = useMemo(
        () => `${regionId}-${product.id}`,
        [product, regionId]
    );
    const value = addSaleData[uniqKey];

    const onChange = (e: any) => {
        dispatch(
            setSaleData({
                key: uniqKey,
                value: e.target.value,
            })
        );
    };

    return (
        <HStack spacing={{ base: 0, sm: 2 }}>
            <Text flex={1}>{product.name}:</Text>
            <InputGroup flex={1} size="sm">
                <Input
                    isDisabled={loading}
                    autoFocus={autoFocus}
                    size="sm"
                    type="number"
                    textAlign={"center"}
                    value={value}
                    onChange={onChange}
                    placeholder={"0"}
                    _placeholder={{ color: "#1a202c" }}
                />
                <InputRightAddon children={"шт."} />
            </InputGroup>
        </HStack>
    );
};

export default ProductRow;
