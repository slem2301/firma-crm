import BaseService from "./base-service";

type CreateScriptData = {
    projectId: number;
    code: string;
    selector: string;
};

type UpdateScriptData = {
    id: number;
    code: string;
    selector: string;
};

class ProjectScriptService extends BaseService {
    getByProjectId(projectId: number) {
        return this.api.get(`/project-scripts/${projectId}`);
    }

    deleteById(id: number) {
        return this.api.delete(`/project-scripts/${id}`);
    }

    create(data: CreateScriptData) {
        return this.api.post("/project-scripts/", data);
    }

    update(data: UpdateScriptData) {
        return this.api.put("/project-scripts/", data);
    }
}

export default new ProjectScriptService();
