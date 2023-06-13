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
