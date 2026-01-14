import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { createRequest, rejectHandler } from "../../axios";
import { SUCCESS_GET, SUCCESS_POST, SUCCESS_PUT } from "../../const/http-codes";
import { ProjectDto } from "../../models/dtos/ProjectDto";
import { IProject } from "../../models/IProject";
import projectService, {
    getAllProjectsFilters,
} from "../../services/project-service";

export interface ProjectState {
    loading: boolean;
    postLoading: boolean;
    projects: IProject[];
    responseError: string;
    project: IProject | null;
    pagination: {
        totalPages: number;
        total: number;
        page: number;
    };
}

const initialState: ProjectState = {
    loading: true,
    pagination: {
        totalPages: 1,
        total: 0,
        page: 1,
    },
    projects: [],
    postLoading: false,
    responseError: "",
    project: null,
};

export const ProjectSlice = createSlice({
    name: "project",
    initialState,
    reducers: {
        setPage(state, action: PayloadAction<number>) {
            state.pagination.page = action.payload;
        },
        setResponseError(state, action: PayloadAction<string | undefined>) {
            state.responseError = action.payload || "";
        },
        setProject(state, action: PayloadAction<IProject | null>) {
            state.project = action.payload;
        },
    },
    extraReducers: (builder) => {
        // getAllProjects
        builder.addCase(getAllProjects.pending, (state, action) => {
            if (action.meta.arg?.search) state.postLoading = true;
            else {
                state.loading = true;
            }
        });
        builder.addCase(getAllProjects.fulfilled, (state, action) => {
            state.projects = action.payload.projects;
            state.pagination.totalPages = action.payload.totalPages;
            state.pagination.total = action.payload.total;

            state.loading = false;
            state.postLoading = false;
        });
        // createProject
        builder.addCase(createProject.pending, (state) => {
            state.postLoading = true;
            state.responseError = "";
        });
        builder.addCase(createProject.fulfilled, (state) => {
            state.postLoading = false;
        });
        builder.addCase(
            createProject.rejected,
            rejectHandler((state, action) => {
                state.postLoading = false;
                state.responseError = action.payload.message;
            })
        );
        // getProjectById
        builder.addCase(getProjectById.pending, (state) => {
            state.loading = true;
            state.responseError = "";
        });
        builder.addCase(getProjectById.fulfilled, (state, action) => {
            state.project = action.payload;
            state.loading = false;
        });
        builder.addCase(
            getProjectById.rejected,
            rejectHandler((state, action) => {
                state.responseError = action.payload.message;
                state.loading = false;
            })
        );
        // update
        builder.addCase(updateProject.pending, (state, action) => {
            state.postLoading = true;
            state.responseError = "";
        });
        builder.addCase(updateProject.fulfilled, (state, action) => {
            state.project = action.payload;
            state.postLoading = false;
        });
        builder.addCase(
            updateProject.rejected,
            rejectHandler((state, action) => {
                state.postLoading = false;
                state.responseError = action.payload.message;
            })
        );
        // delete
        builder.addCase(deleteProject.pending, (state) => {
            state.postLoading = true;
            state.responseError = "";
        });
        builder.addCase(deleteProject.fulfilled, (state) => {
            state.postLoading = false;
            state.project = null;
        });
        builder.addCase(
            deleteProject.rejected,
            rejectHandler((state, action) => {
                state.postLoading = false;
                state.responseError = action.payload.message;
            })
        );
    },
});

export default ProjectSlice.reducer;

export const {
    setResponseError: setProjectResponseError,
    setProject,
    setPage,
} = ProjectSlice.actions;

export const getAllProjects = createRequest<
    {
        projects: IProject[];
        total: number;
        totalPages: number;
    },
    getAllProjectsFilters
>("project/get-all", async (filters) => {
    const response = await projectService.getAll(filters);

    if (response.status === SUCCESS_POST) return response.data;
});

export const createProject = createRequest<IProject, ProjectDto>(
    "project/create",
    async (data) => {
        const response = await projectService.create(data);

        return response.data;
    }
);

export const getProjectById = createRequest<IProject, number>(
    "projects/get-by-id",
    async (id) => {
        const response = await projectService.getById(id);

        if (response.status === SUCCESS_GET) return response.data;
    }
);

export const updateProject = createRequest<IProject, IProject>(
    "projects/update",
    async (project) => {
        const response = await projectService.update(project);

        if (response.status === SUCCESS_PUT) return response.data;
    }
);

export const deleteProject = createRequest<IProject, number>(
    "projects/delete",
    async (id) => {
        await projectService.delete(id);
    }
);
