import { ICountry } from "./ICountry";
import { IOrder } from "./IOrder";
import { IProject } from "./IProject";

export interface IPhone {
    id: number;
    phone: string;
    regionId: number;
    projectId: number;
    project?: IProject;
    isReserved: boolean;
    history?: IPhoneHistory[];
    region?: ICountry;
    calls: IPhoneCall[];
}

export interface IPhoneOptions {
    id: number;
    options: string;
    projectId: number;
}

export interface IPhoneHistory {
    id: number;
    projectId: number;
    phoneId: number;
    showDate: string;
    clearDate: string;
}

export interface IPhoneCall {
    id: number;
    phoneId: number;
    client_number: string;
    order?: IOrder;
}
