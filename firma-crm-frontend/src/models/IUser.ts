

export interface IUser {
    id: string;
    email?: string;
    name?: string;

    // если старое поле login ещё есть — оставим опциональным
    login?: string;
    tag?: string;

    roles: string[]; // ["ADMIN","MANAGER"]
    createdAt: string;
    updatedAt?: string;
}

