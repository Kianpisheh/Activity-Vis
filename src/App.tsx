import React, { useEffect, useState } from "react";
import jsonData from "./activity_data.json";

import "./App.css";
import VisPanel from "./components/VisPanel";
import { Activity } from "./globalInterfaces/interfaces";
import { readActivityData } from "./helpers/ActivityDataHelpers";

function App() {
    const [activityData, setActivityData] = useState([]);

    const visPanelSettings = {
        width: 1300,
        height: 800,
        initialVisibleTimelineWidth: 900,
        timelineHeight: 50,
        timelineMax: 500,
        timelineRectHeight: 8,
        tooltipHeight: 15,
    };

    // read activity data
    const dataPath = "/EPIC_100_train.json";
    let activities: Activity[] = jsonData;
    let acts: Activity[] = [];

    useEffect(() => {
        readActivityData(dataPath, "epic")
            .then((res) => setActivityData(res))
            .catch((err) => console.log(err));
    }, []);

    return (
        <div className="App">
            <div
                id="vis-panel"
                style={{
                    width: visPanelSettings.width,
                    height: visPanelSettings.height,
                }}
            >
                <VisPanel activities={activityData} settings={visPanelSettings}></VisPanel>
            </div>
        </div>
    );
}

export default App;
