import { Activity } from "../globalInterfaces/interfaces";

export const readActivityData = async (path: string, dataset: string) => {
    if (dataset === "epic") {
        const res = await fetch(path, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        });
        return await res.json();
    }
    const reason = new Error("Something went wrong");
    const failedPromise = Promise.reject(reason);
    return failedPromise;
};

export const readEventsList = async (path: string): Promise<string[]> => {
    try {
        const res = await fetch(path);
        const data = await res.text();
        const lines = data.split("\n");
        let events: string[] = [];
        for (let l of lines) {
            events.push(l);
        }
        return events;
    } catch (err) {
        console.log(err);
        return [];
    }
};

export const cropActivity = (activity: Activity, startTime: number, endTime: number): Activity => {
    const events = activity.events;
    let croppedActivity: Activity = {
        klass: activity.klass,
        name: activity.name + "_" + Math.round(startTime) + "_" + Math.round(endTime),
        events: [],
    };
    for (let ev of events) {
        if (ev.start_time >= startTime && ev.end_time <= endTime) {
            croppedActivity.events.push(ev);
        }
    }

    return croppedActivity;
};
