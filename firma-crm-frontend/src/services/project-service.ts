import { sortValueType } from "../hooks/useSort";
import { ProjectDto } from "../models/dtos/ProjectDto";
import { IGoogleConversion, IProjectYandexSettings } from "../models/IProject";
import BaseService from "./base-service";

export interface getAllProjectsFilters {
    search: string;
    period: {
        from: Date;
        to: Date;
    };
    pagination: {
        page: number;
        itemsPerPage: number;
    };
    sort: {
        key: string;
        value: sortValueType;
    };
    filter: {
        countryIds?: number[];
        productIds?: number[];
        isTesting: boolean;
        redirectRange: number;
        autoPhoneMode: boolean;
    };
}

export type getStatisticksProps = {
    period: {
        from: Date;
        to: Date;
    };
    projectId: number;
};

class ProjectService extends BaseService {
    async getAll(data: getAllProjectsFilters) {
        return this.api.post("/projects", data);
    }

    async create(data: ProjectDto) {
        return this.api.post("/projects/create", data);
    }

    async getById(id: number) {
        return this.api.get(`/projects/${id}`);
    }

    async update(data: ProjectDto) {
        return this.api.put("/projects/update", data);
    }

    async delete(id: number) {
        return this.api.delete(`/projects/${id}`);
    }

    async getStatisticks(data: getStatisticksProps) {
        return this.api.post("/projects/get-statisticks", data);
    }

    async getYSettingsById(projectId: number) {
        return this.api.get(`/project-yandex/${projectId}`);
    }

    async deleteYSettingsById(projectId: number) {
        return this.api.delete(`/project-yandex/${projectId}`);
    }

    async updateYSettings(data: IProjectYandexSettings & { id?: number }) {
        return this.api.put("/project-yandex/", data);
    }

    async getGConversionById(projectId: number) {
        return this.api.get(`/g-conversion/${projectId}`);
    }

    async updateGConversion(data: IGoogleConversion & { id?: number }) {
        return this.api.put("/g-conversion/", data);
    }

    async deleteGConversionById(projectId: number) {
        return this.api.delete(`/g-conversion/${projectId}`);
    }
}

export default new ProjectService();
