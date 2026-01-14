export const monthsAssociations: Record<number, string> = {
    1: "Январь",
    2: "Февраль",
    3: "Март",
    4: "Апрель",
    5: "Май",
    6: "Июнь",
    7: "Июль",
    8: "Август",
    9: "Сентябрь",
    10: "Октябрь",
    11: "Ноябрь",
    12: "Декабрь",
};

export const getDefaultAccountName = (date?: Date) => {
    const currentDate = date ? date : new Date();

    return `${
        monthsAssociations[currentDate.getMonth() + 1]
    } - ${currentDate.getFullYear()}`;
};
