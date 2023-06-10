import axios from "axios";

import { Activity } from "../globalInterfaces/interfaces";

export const readActivityData = (path: string, dataset: string) => {
    if (dataset === "epic") {
        fetch(path, {
            headers: {
                "Content-Type": "application/json",
                Accept: "application/json",
            },
        })
            .then((res) => res.json())
            .then((jsonData) => {
                console.log(jsonData);
                return jsonData;
            });
    }
};
