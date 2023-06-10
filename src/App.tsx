import React from "react";
import jsonData from "./activity_data.json";

import "./App.css";
import VisPanel from "./components/VisPanel";
import { Activity } from "./globalInterfaces/interfaces";

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
    let activities: Activity[] = jsonData;

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
