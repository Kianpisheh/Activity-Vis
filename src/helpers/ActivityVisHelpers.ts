import { Event, Activity } from "../globalInterfaces/interfaces";

type Coords = {
    x1: number;
    x2: number;
};

export const getTimelineCoords = (
    t1: number,
    t2: number,
    tmin: number,
    tmax: number,
    prevT2: number,
    timelineWidth: number
): Coords => {
    let coords: Coords = { x1: 0, x2: 0 };
    // time to pixel
    coords.x1 = Math.round(((t1 - tmin) / tmax) * timelineWidth);
    coords.x2 = Math.round(((t2 - tmin) / tmax) * timelineWidth);

    return coords;
};

export const handleZoomEvent = (
    zoom: string,
    currentTimelineMax: number,
    minTimelineMax: number
): number => {
    if (zoom === "-") {
        return Math.min(minTimelineMax, Math.round(1.5 * currentTimelineMax));
    }

    return Math.round(0.5 * currentTimelineMax);
};

type Tick = {
    x: number;
    label: string;
};

export const getTimelineTicks = (
    visibleTimelineWidth: number,
    timelineWidth: number,
    tmax: number
): Tick[] => {
    const n = 5; // divisions
    const N = n * Math.floor(timelineWidth / visibleTimelineWidth);
    const stepWidth = Math.floor(visibleTimelineWidth / n);
    const stepTimeWidth = Math.floor(tmax / n);

    let ticks: Tick[] = [];

    for (let i = 0; i < N; i++) {
        const x = i * stepWidth;
        const label = (i * stepTimeWidth).toString();

        ticks.push({ x: x, label: label });
    }

    return ticks;
};

type FilterTextHandlerOutput = {
    update: boolean;
    updatedFilterList: string[];
};

export const parseFilterText = (
    currentFilterText: string,
    prevFilterList: string[],
    eventsList: string[]
): FilterTextHandlerOutput => {
    let newFilterList: string[] = [];
    const filterParts: string[] = currentFilterText.split(",");

    for (let item of filterParts) {
        // remove trailing and heading whitespaces
        let filter = item.trim();

        const filterType = getFilterType(filter);

        let queriedEvent = "";

        if (filterType === "inclusion") {
            queriedEvent = filter;
        } else if (filterType === "exclusion") {
            queriedEvent = filter.substring(1);
        } else if (filterType === "duration" || filterType === "frequency") {
            const delimiter = filterType === "duration" ? ":" : "^";
            const filterParts = filter.split(delimiter);

            queriedEvent = filterParts[0];
            // check if the bounds are number
            if (isNaN(Number(filterParts[1]))) {
                continue;
            }
            if ((filterParts[2].trim() !== "", isNaN(Number(filterParts[2])))) {
                continue;
            }

            // check if max > min
            if (filterParts[2].trim() !== "") {
                if (Number(filterParts[2]) <= Number(filterParts[1])) {
                    continue;
                }
            }
        } else {
            continue;
        }

        if (queriedEvent !== "" && eventsList.includes(queriedEvent)) {
            newFilterList.push(filter);
        }
    }

    console.log("newFilterList: ", newFilterList);

    if (arraysEquality(newFilterList, prevFilterList)) {
        return { updatedFilterList: [], update: false };
    }
    return { updatedFilterList: newFilterList, update: true };
};

const getFilterType = (filterText: string): string => {
    if (filterText.startsWith("-")) {
        return "exclusion";
    } else if (filterText.includes(":") && filterText.split(":").length === 3) {
        return "duration";
    } else if (filterText.includes("^") && filterText.split("^").length === 3) {
        return "frequency";
    }

    return "inclusion";
};

const arraysEquality = (arr1: string[], arr2: string[]): boolean => {
    if (arr1.length !== arr2.length) {
        return false;
    }

    const arr11: string[] = Array.from(new Set(arr1).values());
    const arr22: string[] = Array.from(new Set(arr2).values());
    const filteredArr1 = arr11.filter((el) => !arr22.includes(el));

    if (filteredArr1.length === 0) {
        return true;
    }

    return false;
};

export const getEventsClasses = (events: Event[]): string[] => {
    let eventClasses: string[] = [];

    for (let ev of events) {
        eventClasses.push(ev.klass);
    }

    return eventClasses;
};

export const criteriaCheck = (activityEvents: Event[], axiomList: string[]): boolean => {
    const eventClasses = getEventsClasses(activityEvents);

    for (let axiom of axiomList) {
        const axiomType = getFilterType(axiom);
        if (axiomType === "inclusion") {
            if (!eventClasses.includes(axiom)) {
                return false;
            }
        } else if (axiomType === "exclusion") {
            if (eventClasses.includes(axiom)) {
                return false;
            }
        } else if (axiomType === "duration") {
            // check inclusion
            const queriedEvent = axiom.split(":")[0];
            if (!eventClasses.includes(queriedEvent)) {
                return false;
            }

            // check the temporal condition
            const bounds = getAxiomBounds(axiom);
            console.log("bounds", bounds);
            let durationAxiomSatisfied = false;
            for (let ev of activityEvents) {
                if (ev.klass === queriedEvent && temporalCheck(ev, bounds)) {
                    durationAxiomSatisfied = true;
                    break;
                }
            }
            if (!durationAxiomSatisfied) {
                return false;
            }
        } else if (axiomType === "frequency") {
            const queriedEvent = axiom.split("^")[0];
            if (!eventClasses.includes(queriedEvent)) {
                return false;
            }

            // check freqeuncy condition
            const bounds = getAxiomBounds(axiom);
            if (!frequencyCheck(getEventsClasses(activityEvents), queriedEvent, bounds)) {
                return false;
            }
        } else {
            return false;
        }
    }

    return true;
};

export const criteriaCheckL = (activities: Activity[], axiomList: string[]): boolean[] => {
    let checkRes: boolean[] = [];
    for (let activity of activities) {
        checkRes.push(criteriaCheck(activity.events, axiomList));
    }

    return checkRes;
};

const getAxiomBounds = (filter: string): number[] => {
    let bounds: number[] = [];
    const delimiter = getFilterType(filter) === "duration" ? ":" : "^";
    const filterParts = filter.split(delimiter);

    if (!isNaN(Number(filterParts[1]))) {
        bounds.push(Number(filterParts[1]));
    }

    if (!isNaN(Number(filterParts[2]))) {
        if (Number(filterParts[2]) === 0) {
            bounds.push(100000);
        } else {
            bounds.push(Number(filterParts[2]));
        }
    }

    return bounds;
};

const temporalCheck = (ev: Event, bounds: number[]): boolean => {
    const duration = ev.end_time - ev.start_time;

    if (duration < bounds[0]) {
        return false;
    }

    if (bounds.length === 2 && duration > bounds[1]) {
        return false;
    }

    return true;
};

const frequencyCheck = (events: string[], queriedEvent: string, bounds: number[]): boolean => {
    const num = events.filter((ev) => ev === queriedEvent).length;
    return num >= bounds[0] && num <= bounds[1];
};

export const satisfiedInstance = (filterList: string[], ev: Event): boolean => {
    for (let filter of filterList) {
        const filterType = getFilterType(filter);

        if (filterType === "duration") {
            if (filter.includes(ev.klass) && temporalCheck(ev, getAxiomBounds(filter))) {
                return true;
            }
        } else if (filterType === "inclusion") {
            if (ev.klass === filter) {
                return true;
            }
        } else if (filterType === "exclusion") {
            if (filter.includes(ev.klass)) {
                return true;
            }
        }
    }

    return false;
};
