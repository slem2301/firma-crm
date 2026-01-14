import { Divider, Heading, VStack } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { useAppSelector } from "../../../../hooks/redux";
import { ICountry } from "../../../../models/ICountry";
import ProductRow from "./ProductRow";

type RegionColumnProps = {
    region: ICountry;
    regionIndex: number;
    loading: boolean;
};

const RegionColumn: React.FC<RegionColumnProps> = ({
    region,
    regionIndex,
    loading,
}) => {
    const { products: _products } = useAppSelector((state) => state.product);
    const products = useMemo(
        () => _products.filter((product) => product.name !== "Прочее"),
        [_products]
    );

    return (
        <VStack
            spacing={3}
            p={2}
            borderWidth={1}
            align={"stretch"}
            minW={{ sm: "308px", base: "270px" }}
            maxW={{ md: "308px", base: "auto" }}
            flex={1}
        >
            <Heading size="sm">{region.name}</Heading>
            <Divider />
            {products.map((product, i) => (
                <ProductRow
                    loading={loading}
                    autoFocus={regionIndex === 0 && i === 0}
                    regionId={region.id}
                    key={product.id}
                    product={product}
                />
            ))}
        </VStack>
    );
};

export default RegionColumn;
