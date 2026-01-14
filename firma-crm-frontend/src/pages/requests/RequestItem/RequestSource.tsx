import { Badge, Tooltip } from "@chakra-ui/react";
import React from "react";

type RequestSourceProps = {
    source: string;
};

const OTHER_TOOLTIP = "Другое";
const OTHER_BADGE = OTHER_TOOLTIP[0];
const OTHER_BADGE_COLOR = "gray";

const tooltipAss: any = {
    yandex: "Яндекс",
    google: "Google",
    call: "Звонок",
};

const sourceAssociations: any = {
    yandex: "Я",
    google: "G",
    call: "З",
};

const sourceColorAss: any = {
    yandex: "red",
    google: "blue",
    call: "green",
};

const RequestSource: React.FC<RequestSourceProps> = ({ source }) => {
    const sourceName = sourceAssociations[source]
        ? sourceAssociations[source]
        : OTHER_BADGE;
    const sourceColor = sourceColorAss[source]
        ? sourceColorAss[source]
        : OTHER_BADGE_COLOR;
    const tooltipLabel = tooltipAss[source]
        ? tooltipAss[source]
        : OTHER_TOOLTIP;

    return (
        <Tooltip openDelay={500} label={tooltipLabel}>
            <Badge colorScheme={sourceColor}>{sourceName}</Badge>
        </Tooltip>
    );
};

export default RequestSource;
