export interface CompareDate {
    main: string;
    firma: string;
}

export interface ISaleStatistick {
    id: number;
    name: string;
    [key: string]: number | string | CompareDate;
}
