import { Event } from "../globalInterfaces/interfaces";

export const getEventsClasses = (events: Event[]): string[] => {
    let eventClasses: string[] = [];

    for (let ev of events) {
        eventClasses.push(ev.klass);
    }

    return eventClasses;
};
