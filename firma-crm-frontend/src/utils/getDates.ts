import { format } from "date-fns";

export const FORMAT_PATTERN = "dd-MM-yyyy";

export const getDates = (from: Date, to: Date) => {
    const currentDate = to;
    const fromDate = from;

    currentDate.setHours(12, 0, 0, 0);
    fromDate.setHours(12, 0, 0, 0);

    const dates = [];

    const diffrents = Math.ceil(
        (to.getTime() - fromDate.getTime()) / (1000 * 3600 * 24)
    );

    for (let i = 0; i <= diffrents; i++) {
        const date = new Date(currentDate);
        date.setDate(date.getDate() - i);
        dates.push(format(date, FORMAT_PATTERN));
    }

    return dates;
};
