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
