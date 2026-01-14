/* eslint-disable react-hooks/exhaustive-deps */
import { HStack, IconButton, Text } from "@chakra-ui/react";
import { FiChevronLeft, FiChevronRight } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { COLOR_SCHEME } from "../../const/colors";

type PaginationProps = {
    page: number;
    total: number;
    onChange: (currentPage: number) => void;
    disabled?: boolean;
    defaultOffset?: number;
    renderAll?: boolean;
    controlled?: boolean;
};

const Pagination: React.FC<PaginationProps> = ({
    page,
    total,
    onChange,
    disabled,
    defaultOffset = 2,
    renderAll = false,
    controlled,
}) => {
    const size = "sm";
    const [currentPage, setCurrentPage] = useState(page);

    const prevButtonHandler = () => {
        if (currentPage - 1 >= 1) setCurrentPage(currentPage - 1);
    };
    const nextButtonHandler = () => {
        if (currentPage + 1 <= total) setCurrentPage(currentPage + 1);
    };

    const buttonHandler = (value: number) => () => {
        setCurrentPage(value);
    };

    useEffect(() => {
        onChange(currentPage);
    }, [currentPage]);

    useEffect(() => {
        if (controlled) {
            setCurrentPage(page);
        }
    }, [controlled, page]);

    return (
        <HStack spacing={2}>
            <IconButton
                isDisabled={disabled}
                size={size}
                aria-label="prev"
                icon={<FiChevronLeft />}
                onClick={prevButtonHandler}
            />
            {Array.from(Array(total).keys()).map((number) => {
                const pageIdx = currentPage - 1;

                const isBorder = pageIdx === 0 || pageIdx === total - 1;
                const isPreBorder = pageIdx === 1 || pageIdx === total - 2;
                let offset = defaultOffset;
                if (isPreBorder) offset = 3;
                if (isBorder) offset = 4;

                if (
                    !renderAll &&
                    (number > pageIdx + offset || number < pageIdx - offset)
                )
                    return null;

                return (
                    <IconButton
                        isDisabled={disabled}
                        transition="none"
                        colorScheme={
                            number + 1 === currentPage ? COLOR_SCHEME : "gray"
                        }
                        onClick={buttonHandler(number + 1)}
                        size={size}
                        key={number}
                        aria-label={`number-${number}`}
                        icon={<Text>{number + 1}</Text>}
                    />
                );
            })}
            <IconButton
                isDisabled={disabled}
                size={size}
                aria-label="next"
                icon={<FiChevronRight />}
                onClick={nextButtonHandler}
            />
        </HStack>
    );
};

export default Pagination;
