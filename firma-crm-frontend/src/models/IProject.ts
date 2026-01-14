import { IAd } from "./IAd";
import { ICountry } from "./ICountry";
import { IMask } from "./IMask";
import { IPhone, IPhoneOptions } from "./IPhone";
import { IProduct } from "./IProduct";

export interface IProject {
    id: number;
    name: string;
    url: string;
    mailTo: string;
    telegramChatId: string;
    telegramBotToken: string;
    deleted: boolean;
    requestsCount: number;
    createdAt: string;
    updatedAt: string;
    domain: string;
    isTesting: boolean;
    randomRedirect: number;
    thankUrl: string;
    fakeThankUrl: string;
    countryId: number;
    productId: number;
    maskId: number;
    mask?: IMask;
    phones: IPhone[];
    autoPhoneMode: boolean;
    country: ICountry;
    product: IProduct;
    projects?: IProject[];
    ads: IAd[];
    phoneOptions?: IPhoneOptions;
}

export const projectSignature: IProject = {
    id: 1,
    name: "1",
    url: "1",
    mailTo: "1",
    telegramChatId: "1",
    telegramBotToken: "1",
    deleted: true,
    requestsCount: 0,
    createdAt: "1",
    updatedAt: "1",
    domain: "1",
    isTesting: true,
    randomRedirect: 1,
    thankUrl: "1",
    phones: [],
    autoPhoneMode: false,
    maskId: 0,
    fakeThankUrl: "1",
    countryId: 0,
    country: {
        id: 1,
        name: "",
        key: "",
    },
    product: {
        id: 1,
        name: "",
    },
    productId: 1,
    ads: [],
};

export interface IProjectStatisticks {
    earn: number;
    orderCost: number;
    requestCost: number;
    expenses: number;
    orders: number;
    requests: number;
}

export interface IProjectYandexSettings {
    id: number;
    projectId: number;
    counterId: number;
    callEvent: string;
    requestEvent: string;
}

export interface IGoogleConversion {
    id: number;
    projectId: number;
    counterId: string;
    callEvent: string;
    requestEvent: string;
    isAnalytics: boolean;
}
