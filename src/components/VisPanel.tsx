import React, { useEffect, useRef } from "react";

import "./VisPanel.css";
import { Activity, VisPanelSettings } from "../globalInterfaces/interfaces.ts";
import ActivitySampleVis from "./ActivitySampleVis.tsx";

interface VisPanelProps {
    activities: Activity[];
    settings: VisPanelSettings;
}

const VisPanel: React.FC<VisPanelProps> = ({ activities, settings }) => {
    return (
        <div id="panel-container" style={{ width: settings.width, height: settings.height }}>
            <div
                id="activity-samples"
                style={{
                    width: Math.round(settings.visibleTimelineWidth),
                    height: Math.round(0.8 * settings.height),
                }}
            >
                {activities.map((activity, idx) => {
                    return (
                        <div key={idx} className="activity-sample-container">
                            <ActivitySampleVis activity={activity} settings={settings} />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VisPanel;
