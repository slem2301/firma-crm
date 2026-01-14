import { Flex, Tag } from "@chakra-ui/react";

interface SelectedItemsProps {
    anyText?: string;
    items: any[] | null;
    title: string;
}

const SelectedItems = (props: SelectedItemsProps) => {
    const { anyText = "Любой", title, items } = props;

    return (
        <Flex gap={2} flexWrap="wrap">
            <b>{title}:</b>
            {items ? (
                items.map((item) => (
                    <Tag colorScheme="blue" key={item.id}>
                        {item.name}
                    </Tag>
                ))
            ) : (
                <span>{anyText}</span>
            )}
        </Flex>
    );
};

export default SelectedItems;
