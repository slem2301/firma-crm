import api from "../../../../../axios";

const getAllByProjectId = (projectId: number) =>
    api.get(`/project-google-tables/all/${projectId}`);

const deleteByProjectId = (projectId: number, token: string) =>
    api.delete("/project-google-tables/delete", { data: { projectId, token } });

interface UpdateGoogleTableProps {
    projectId: number;
    dataOrder: string;
    token: string;
    range: string;
}
const update = (dto: UpdateGoogleTableProps) =>
    api.put("/project-google-tables/update", dto);

interface UpdateUploadGoogleTableProps {
    project_id: number;
    data_order: string;
    token: string;
    range: string;
    file: File;
}
const updateUpload = (dto: UpdateUploadGoogleTableProps) => {
    const data = Object.entries(dto).reduce((data, [key, value]) => {
        data.append(key, value);
        return data;
    }, new FormData());

    return api.put("/project-google-tables/upload-update", data);
};

const getAcceptedFields = () => api.get("/project-google-tables/accepted");

export const googleTablesApi = {
    getAllByProjectId,
    deleteByProjectId,
    update,
    updateUpload,
    getAcceptedFields,
};
