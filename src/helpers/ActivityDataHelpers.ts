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
