import { ICountry } from "./ICountry";

export interface ISale {
    id: number;
    countryId: number;
    country: ICountry;
    productId: number;
    count: number;
    date: string;
}
