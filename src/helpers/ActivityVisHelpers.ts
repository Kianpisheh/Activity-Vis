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

export const handleFilterTextChange = (
    currentFilterText: string,
    prevFilterList: string[],
    eventsList: string[]
): FilterTextHandlerOutput => {
    let newFilterList: string[] = [];
    const filterParts: string[] = currentFilterText.split(",");
    for (let item of filterParts) {
        // remove trailing and heading whitespaces
        let trItem = item.trim();
        // exclusion handling (e.g, -mug)
        let pureItem = trItem.startsWith("-") ? trItem.substring(1) : trItem;
        if (trItem !== "" && eventsList.includes(pureItem)) {
            newFilterList.push(trItem);
        }
    }

    if (arraysEquality(newFilterList, prevFilterList)) {
        return { updatedFilterList: [], update: false };
    }
    return { updatedFilterList: newFilterList, update: true };
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

export const includesAny = (arr1: string[], arr2: string[]): boolean => {
    for (let el2 of arr2) {
        if (arr1.includes(el2)) {
            return true;
        }
    }

    return false;
};

export const includesAll = (arr1: string[], arr2: string[]): boolean => {
    for (let el2 of arr2) {
        if (!arr1.includes(el2)) {
            return false;
        }
    }

    return true;
};

export const inclusionCheck = (arr1: string[], arr2: string[]): boolean => {
    const excludedItems = arr2.filter((item) => item.startsWith("-"));
    const includedItems = arr2.filter((item) => !item.startsWith("-"));

    if (excludedItems.length) {
        console.log("excludedItems", excludedItems);
    }

    for (let exItem of excludedItems) {
        if (arr1.includes(exItem.substring(1))) {
            return false;
        }
    }

    for (let inItem of includedItems) {
        if (!arr1.includes(inItem)) {
            return false;
        }
    }

    return true;
};
