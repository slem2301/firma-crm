import { useCallback, useMemo } from "react";
import { IUser } from "../models/IUser";
import { useAppSelector } from "./redux";

export const ROLES = {
    ADMIN: "ADMIN",
    DEALER: "DEALER",
    MANAGER: "MANAGER",
} as const;

// ✅ Нормализуем любые форматы ролей к string[]
const normalizeRoles = (roles: any): string[] => {
    if (!roles) return [];

    if (Array.isArray(roles) && (roles.length === 0 || typeof roles[0] === "string")) {
        return roles.filter(Boolean);
    }

    if (Array.isArray(roles)) {
        return roles
            .map((r) => r?.role?.role ?? r?.role?.name ?? r?.role ?? r?.name ?? r?.code)
            .filter(Boolean);
    }

    if (typeof roles === "string") {
        return roles.split(",").map((s) => s.trim()).filter(Boolean);
    }

    return [];
};

// ✅ ВАЖНО: экспорт оставляем как раньше, чтобы импорты не сломались
export const userHasRoles = (user: IUser | null, required: string[]) => {
    const userRoles = normalizeRoles(user?.roles);
    if (!required || required.length === 0) return true;
    return required.some((r) => userRoles.includes(r)); // OR
};

export const useRoles = () => {
    const { user } = useAppSelector((state) => state.user);

    // возвращаем string[] (нормализованные роли)
    const roles = useMemo(() => normalizeRoles(user?.roles), [user?.roles]);


    const hasRoles = useCallback(
        (required: string[]) => userHasRoles(user, required),
        [user]
    );




    return {
        roles,
        hasRoles,
    };
};
