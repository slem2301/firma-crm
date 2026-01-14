/* eslint-disable react-hooks/exhaustive-deps */
import {
    Tab,
    TabList,
    TabPanels,
    Tabs,
    TabPanel,
    Link as ChakraLink,
    Heading,
    Box,
    HStack,
    Button,
} from "@chakra-ui/react";
import React, { useCallback, useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import Loader from "../../components/ui/loader/Loader";
import Page from "../../components/ui/page/Page";
import { COLOR_PRIMARY, COLOR_SCHEME } from "../../const/colors";
import { useAppDispatch, useAppSelector } from "../../hooks/redux";
import { useBreakpoint } from "../../hooks/useBreakpoint";
import useTitle from "../../hooks/useTitle";
import { ROUTES } from "../../router/routes";
import { getProjectById, setProject } from "../../store/slices/project-slice";
import { getPathWithParam } from "../../utils/getPathWithParam";
import Connection from "./Connection";
import Expense from "./Expense";
import Requests from "./requests/Requests";
import Scripts from "./scripts/Scripts";
import Settings from "./settings/Settings";
import { ChatOptions } from "./chat";
import { QuizOptions } from "./quiz";

export type ProjectProps = {
    mode?:
    | "settings"
    | "requests"
    | "connection"
    | "expense"
    | "scripts"
    | "chat"
    | "quiz";
};

const Project: React.FC<ProjectProps> = ({ mode }) => {
    const sm = useBreakpoint("sm");
    const { id } = useParams();
    const navigate = useNavigate();
    const dispatch = useAppDispatch();
    const { project, loading } = useAppSelector((state) => state.project);
    const { total } = useAppSelector((state) => state.request.pagination);
    useTitle(`${project?.name}`, !!project);

    const [tabIndex, setTabIndex] = useState(0);

    const fetchProject = useCallback(async () => {
        dispatch(getProjectById(Number(id)));
    }, [id, dispatch]);

    const defineMode = useCallback(() => {
        dispatch(setProject(null));
        switch (mode) {
            case "requests":
                setTabIndex(0);
                break;
            case "expense":
                setTabIndex(1);
                break;
            case "settings":
                setTabIndex(2);
                break;
            case "scripts":
                setTabIndex(3);
                break;
            case "connection":
                setTabIndex(4);
                break;
            case "chat":
                setTabIndex(5);
                break;
            case "quiz":
                setTabIndex(6);
                break;
        }
    }, []);

    useEffect(() => {
        if (!project || project?.id?.toString() !== id) return;
        switch (tabIndex) {
            case 0:
                navigate(
                    getPathWithParam(ROUTES.projectRequests.path, project.id),
                    { replace: true }
                );
                break;
            case 1:
                navigate(
                    getPathWithParam(ROUTES.projectExpense.path, project.id),
                    { replace: true }
                );
                break;
            case 2:
                navigate(
                    getPathWithParam(ROUTES.projectSettings.path, project.id),
                    { replace: true }
                );
                break;
            case 3:
                navigate(
                    getPathWithParam(ROUTES.projectScripts.path, project.id),
                    { replace: true }
                );
                break;
            case 4:
                navigate(
                    getPathWithParam(ROUTES.projectConnection.path, project.id),
                    { replace: true }
                );
                break;
            case 5:
                navigate(
                    getPathWithParam(ROUTES.projectChat.path, project.id),
                    { replace: true }
                );
                break;
            case 6:
                navigate(
                    getPathWithParam(ROUTES.projectQuiz.path, project.id),
                    { replace: true }
                );
                break;
        }
    }, [tabIndex, navigate, project, id]);

    useEffect(() => {
        defineMode();
        fetchProject();
    }, [fetchProject, defineMode]);

    if (loading) return <Loader />;

    return (
        <Page>
            {project && !loading ? (
                <>
                    <HStack
                        justify={"space-between"}
                        flexDirection={{ base: "column", sm: "row" }}
                        spacing={0}
                    >
                        <Heading size="md" mb={2}>
                            {project.name}
                        </Heading>
                        <a
                            href={`${project.url}`}
                            target="_blank"
                            rel="noreferrer"
                        >
                            <Button
                                my={{ base: 2, sm: 0 }}
                                mb={{ base: 4, sm: 0 }}
                                size="sm"
                                fontSize={{ base: 12, sm: 14 }}
                                colorScheme={COLOR_SCHEME}
                                variant={"outline"}
                            >
                                Перейти на сайт
                            </Button>
                        </a>
                    </HStack>
                    <Tabs
                        align={sm ? "center" : "start"}
                        size={{ base: "sm", sm: "md" }}
                        isLazy
                        index={tabIndex}
                        onChange={(index) => setTabIndex(index)}
                    >
                        <TabList flexWrap={"wrap"}>
                            <Tab whiteSpace={"nowrap"}>Заявки ({total})</Tab>
                            <Tab>Расход</Tab>
                            <Tab>Настройки</Tab>
                            <Tab>Скрипты</Tab>
                            <Tab>Подключение</Tab>
                            <Tab>Чат</Tab>
                            <Tab>Квиз</Tab>
                        </TabList>

                        <TabPanels>
                            <TabPanel px={{ base: 0, sm: 4 }}>
                                <Requests mode={mode} project={project} />
                            </TabPanel>
                            <TabPanel>
                                <Expense project={project} />
                            </TabPanel>
                            <TabPanel pr={0} pl={{ base: 0, sm: 4 }}>
                                <Settings project={project} />
                            </TabPanel>
                            <TabPanel>
                                <Scripts projectId={project.id} />
                            </TabPanel>
                            <TabPanel>
                                <Connection project={project} />
                            </TabPanel>
                            <TabPanel>
                                <ChatOptions projectId={project.id} />
                            </TabPanel>
                            <TabPanel>
                                <QuizOptions projectId={project.id} />
                            </TabPanel>
                        </TabPanels>
                    </Tabs>
                </>
            ) : (
                <Box textAlign={"center"}>
                    <Heading size="lg" mb={2}>
                        Проект не найден
                    </Heading>
                    <ChakraLink
                        color={COLOR_PRIMARY}
                        as={Link}
                        to={ROUTES.projects.path}
                    >
                        Перейти к проектам
                    </ChakraLink>
                </Box>
            )}
        </Page>
    );
};

export default Project;
