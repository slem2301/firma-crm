import BaseService from "./base-service";

export type AddMaskProps = {
    mask: string;
};

class MaskService extends BaseService {
    getAll() {
        return this.api.get("/mask/");
    }

    add(data: AddMaskProps) {
        return this.api.post("/mask/", data);
    }
}

export default new MaskService();
