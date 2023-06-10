import React from "react";

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
        timelineRectHeight: 10,
    };

    let activities: Activity[] = [
        {
            klass: "cooking",
            name: "cooking_1",
            events: [
                { klass: "mug", name: "mug_1", start_time: 10, end_time: 20 },
                { klass: "stove", name: "stove_1", start_time: 70, end_time: 120 },
                { klass: "fridge", name: "fridge_1", start_time: 130, end_time: 135 },
            ],
        },
    ];

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
