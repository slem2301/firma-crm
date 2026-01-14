import { Flex } from "@chakra-ui/react";
import React from "react";
import SingleSelectFilter, {
    optionType,
} from "../../../components/filters/SingleSelectFilter";
import UpdateButton from "../../../components/ui/button/UpdateButton";
import SearchInput from "../../../components/ui/search-input/SearchInput";

interface ProjectsChartToolbarProps {
    isLoading: boolean;
    update: () => void;
    search?: {
        searchHandler: (e: React.ChangeEvent) => void;
        search: string;
    };
    options: optionType<number>[];
    setIsActive: (value: number) => void;
}

const ProjectsChartToolbar: React.FC<ProjectsChartToolbarProps> = (props) => {
    const { isLoading, update, search, options, setIsActive } = props;

    return (
        <Flex gap={2} flexWrap={"wrap"} alignItems="center" w="100%">
            {search && (
                <SearchInput
                    placeholder="Поиск: Название, Url"
                    onChange={search.searchHandler}
                    value={search.search}
                />
            )}
            <SingleSelectFilter
                options={options}
                setValue={setIsActive}
                defaultValue={options[0].value}
            />
            <UpdateButton
                loadingText="Сбор данных..."
                isLoading={isLoading}
                onClick={update}
            />
        </Flex>
    );
};

export default ProjectsChartToolbar;
