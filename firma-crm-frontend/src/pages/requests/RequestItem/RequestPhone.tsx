import { Text } from "@chakra-ui/react";
import React, { useMemo } from "react";
import { insertPhoneInMask } from "../../project/settings/PhoneModal/PhoneModal";

type RequestPhoneProps = {
    phone: string;
    regionName?: string;
};

const RequestPhone: React.FC<RequestPhoneProps> = ({ phone, regionName }) => {
    const maskedPhone = useMemo(() => {
        if (!regionName) return phone;

        const regionMasks = masks[regionName];
        if (!regionMasks) return phone;

        const mask = regionMasks[phone.length];

        if (!mask) return phone;

        return insertPhoneInMask(phone, mask);
    }, [phone, regionName]);

    return (
        <Text as="span" fontWeight={500}>
            {maskedPhone}
        </Text>
    );
};

export default RequestPhone;

const masks: any = {
    Беларусь: {
        12: "+### (##) ###-##-##",
        11: "## (##) ###-##-##",
        9: "(##) ###-##-##",
        7: "###-##-##",
    },
    Москва: {
        11: "+# (###) ###-##-##",
        10: "(###) ###-##-##",
        7: "###-##-##",
    },
};
masks.СПБ = masks.Москва;
