import React, { useEffect, useState } from "react";

import "./App.css";
import VisPanel from "./components/VisPanel";
import { Activity } from "./globalInterfaces/interfaces";
import { readActivityData, readEventsList } from "./helpers/ActivityDataHelpers";
import { assignColors } from "./helpers/colorHelper";

function App() {
    const [activityData, setActivityData] = useState<Activity[]>([]);
    const [eventsList, setEventsList] = useState<string[]>([]);
    const [eventColors, setEventColors] = useState<{ [key: string]: string }>({});

    const visPanelSettings = {
        width: 1300,
        height: 800,
        visibleTimelineWidth: 900,
        timelineHeight: 80,
        initialTimelineMax: 500,
        timelineRectHeight: 8,
        tooltipHeight: 15,
    };

    // read activity data
    const dataPath = "/EPIC_100_train.json";
    const eventsPath = "/EPIC_events.txt";

    useEffect(() => {
        readActivityData(dataPath, "epic")
            .then((res) => setActivityData(res))
            .catch((err) => console.log(err));

        readEventsList(eventsPath)
            .then((res) => {
                setEventsList(res);
                setEventColors(assignColors(res));
            })
            .catch((err) => {
                console.log(err);
                setEventsList([]);
            });
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
                <VisPanel
                    activities={activityData}
                    settings={visPanelSettings}
                    colors={eventColors}
                    eventsList={eventsList}
                ></VisPanel>
            </div>
        </div>
    );
}

export default App;
