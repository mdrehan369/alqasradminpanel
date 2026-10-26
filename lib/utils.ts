import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";
import { DAYS, MONTHS } from "./constants";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function getFormattedCurrDateAndTime() {
    const curr = new Date();
    const date = curr.getDate();
    const day = DAYS[curr.getDay()];
    const month = MONTHS[curr.getMonth()];

    let suff = "th";

    switch (date % 10) {
        case 1: {
            suff = "st";
            break;
        }
        case 2: {
            suff = "nd";
            break;
        }
        case 3: {
            suff = "rd";
        }
    }

    return `${date}${suff} ${month}, ${day}`;
}
