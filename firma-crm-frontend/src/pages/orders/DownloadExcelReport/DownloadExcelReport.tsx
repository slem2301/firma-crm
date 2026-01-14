import { IconButton, useDisclosure } from "@chakra-ui/react";
import React from "react";
import { RiFileExcel2Line } from "react-icons/ri";
import { DownloadExcelReportModal } from "./DownloadExcelReportModal";

interface DownloadExcelReportProps {
    regionIds: number[];
    period: { from: Date; to: Date };
    productTypeIds: number[];
    orderTypeIds: number[];
    statusIds: number[];
    routeDate: boolean;
}

export const DownloadExcelReport: React.FC<DownloadExcelReportProps> = (
    props
) => {
    const { isOpen, onClose, onOpen } = useDisclosure();

    return (
        <>
            <IconButton
                colorScheme="green"
                fontSize={"1.3em"}
                size="sm"
                aria-label="generate report"
                icon={<RiFileExcel2Line />}
                onClick={onOpen}
            />
            {isOpen && (
                <DownloadExcelReportModal
                    isOpen={isOpen}
                    onClose={onClose}
                    {...props}
                />
            )}
        </>
    );
};
