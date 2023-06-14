export const readActivityData = (path: string, dataset: string) => {
    if (dataset === "epic") {
        return fetch(path, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        }).then((res) => res.json());
    }
    const reason = new Error("Something went wrong");
    const failedPromise = Promise.reject(reason);
    return failedPromise;
};

export const readEventsList = (path: string): Promise<string[]> => {
    return fetch(path)
        .then((res) => res.text())
        .then((data) => {
            const lines = data.split("\n");
            let events: string[] = [];
            for (let l of lines) {
                events.push(l);
            }
            return events;
        })
        .catch((err) => {
            console.log(err);
            return [];
        });
};
