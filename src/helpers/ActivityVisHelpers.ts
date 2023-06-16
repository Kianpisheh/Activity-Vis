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
        return Math.min(minTimelineMax, Math.round(1.2 * currentTimelineMax));
    }

    return Math.round(0.8 * currentTimelineMax);
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
    prevFilterText: string,
    prevFilterList: string[],
    eventsList: string[]
): FilterTextHandlerOutput => {
    let newFilterList: string[] = [];
    const filterParts: string[] = currentFilterText.split(",");
    for (let item of filterParts) {
        if (item.trim() !== "" && eventsList.includes(item.trim())) {
            newFilterList.push(item.trim());
        }
    }

    if (arraysEquality(newFilterList, prevFilterList)) {
        return { updatedFilterList: [], update: false };
    }
    return { updatedFilterList: newFilterList, update: true };

    // const currentFilterList = currentFilterText.split(",");
    // const lastItem = currentFilterList[currentFilterList.length - 1].trim();
    // let updatedFilterList: string[] = [];
    // let update: boolean = false;

    // // new character entered
    // if (currentFilterText.length > prevFilterText.length) {
    //     if (lastItem.length !== 0) {
    //         // not a valid event
    //         if (eventsList.includes(lastItem) && !prevFilterList.includes(lastItem)) {
    //             update = true;
    //             updatedFilterList = [...prevFilterList, lastItem];
    //         }
    //     }
    // } else {
    //     // remove the last item from prevList
    //     const prevParts = prevFilterText.split(",");
    //     const prevLastItem = prevParts[prevParts.length - 1].trim();
    //     if (prevLastItem !== lastItem) {
    //         // item removal
    //         if (!arraysEquality(prevFilterList, currentFilterList)) {
    //             update = true;
    //         }
    //         // if the new last item is also valid
    //         else if (
    //             eventsList.includes(lastItem) &&
    //             lastItem.length !== 0 &&
    //             !prevFilterList.includes(lastItem)
    //         ) {
    //             updatedFilterList.push(lastItem);
    //             update = true;
    //         }
    //     }
    // }

    // console.log(prevFilterList);
    // console.log(updatedFilterList);
    // console.log(update);
    // return { updatedFilterList: updatedFilterList, update: update };
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
