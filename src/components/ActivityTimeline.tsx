import React from "react";
import { VisPanelSettings } from "../globalInterfaces/interfaces";

interface ActivityTimelineProps {
    settings: VisPanelSettings;
}

const ActivityTimeline: React.FC<ActivityTimelineProps> = ({ settings }) => {
    const { timelineHeight, timelineWidth } = settings;

    return (
        <div>
            <line
                className="timeline-line"
                x1={0}
                x2={timelineWidth}
                y1={timelineHeight - 3}
                y2={timelineHeight - 3}
            ></line>
        </div>
    );
};

export default ActivityTimeline;
