import React, { useEffect } from "react";
import jsonData from "./activity_data.json";

import "./App.css";
import VisPanel from "./components/VisPanel";
import { Activity } from "./globalInterfaces/interfaces";
import { readActivityData } from "./helpers/ActivityDataHelpers";

function App() {
    const visPanelSettings = {
        width: 900,
        height: 600,
        timelineWidth: 600,
        timelineHeight: 40,
        timelineMax: 200,
        timelineRectHeight: 8,
        tooltipHeight: 15,
    };

    // read activity data
    const dataPath = "/EPIC_100_train.json";
    let activities: Activity[] = jsonData;
    let acts: Activity[] = [];

    useEffect(() => {
        readActivityData(dataPath, "epic");
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
                <VisPanel activities={activities} settings={visPanelSettings}></VisPanel>
            </div>
        </div>
    );
}

export default App;
