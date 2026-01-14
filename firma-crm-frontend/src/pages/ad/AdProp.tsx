import {
    GridItem,
    GridItemProps,
    Input,
    InputProps,
    Text,
} from "@chakra-ui/react";
import { Ref, forwardRef } from "react";

interface BaseProps {
    label: string;
    editable?: boolean;
    text: string;
    type: "text" | "select";
    inputType?: "text" | "number";
}

interface TextProps extends BaseProps, InputProps {
    type: "text";
}

interface SelectProps extends BaseProps {
    type: "select";
    element: JSX.Element;
}

type AdPropProps = TextProps | SelectProps;

export const AdPropStyles: GridItemProps = {
    borderWidth: 1,
    p: 2,
    shadow: "base",
    display: "flex",
    alignItems: "center",
    gap: 2,
};

export const AdProp = forwardRef(
    (props: AdPropProps, ref: Ref<HTMLInputElement>) => {
        const { label, editable, text, type, inputType, ...otherProps } = props;

        const renderContent = () => {
            if (!editable)
                return (
                    <Text h={"40px"} lineHeight={"40px"} whiteSpace={"nowrap"}>
                        {text}
                    </Text>
                );

            switch (type) {
                case "text": {
                    return <Input {...otherProps} ref={ref} type={inputType} />;
                }
                case "select": {
                    return props.element;
                }
            }
        };

        return (
            <GridItem {...AdPropStyles}>
                <Text whiteSpace={"nowrap"}>{label}:</Text>
                {renderContent()}
            </GridItem>
        );
    }
);
