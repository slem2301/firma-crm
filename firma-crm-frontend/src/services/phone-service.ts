import { IPhone } from "../models/IPhone";
import BaseService from "./base-service";

export type AddPhoneProps = {
    phone: string;
    regionId: number;
    isReserved: boolean;
};

export type UpdatePhoneProps = {
    phone: string;
    regionId: number;
    isReserved: boolean;
    id: number;
};

export type UpdatePhoneOptionsProps = {
    projectId: number;
    options: string | null;
};

class PhoneService extends BaseService {
    getAll(withReserved?: boolean) {
        return this.api.get(
            `/phones/${withReserved ? "?withReserved=true" : ""}`
        );
    }

    add(data: AddPhoneProps) {
        return this.api.post("/phones/", data);
    }

    clear(id: number, historyId?: number) {
        return this.api.post(`/phones/clear?id=${id}&historyId=${historyId}`);
    }

    update(data: UpdatePhoneProps) {
        return this.api.put("/phones/", data);
    }

    delete(id: number) {
        return this.api.delete(`/phones/${id}`);
    }

    updatePhoneOptions(data: UpdatePhoneOptionsProps) {
        return this.api.put("/phones/options", data);
    }

    checkPhone(phone: string) {
        return this.api.get(`/phones/check/${phone}`);
    }

    async getById(id: string, from: Date, to: Date) {
        return this.api.get<IPhone>(`/phones/${id}`, { params: { from, to } });
    }
}

export default new PhoneService();
