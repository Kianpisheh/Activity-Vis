import React, { useState } from "react";

import { Activity, VisPanelSettings } from "../globalInterfaces/interfaces";
import { getTimelineCoords } from "../helpers/ActivityVisHelpers";

interface ActivitySampleVisProp {
    activity: Activity;
    settings: VisPanelSettings;
}

const ActivitySampleVis: React.FC<ActivitySampleVisProp> = ({ activity, settings }) => {
    const [hovered, setHovered] = useState(-1);

    const {
        timelineWidth,
        timelineHeight,
        timelineRectHeight,
        timelineMax,
        tooltipHeight,
    } = settings;
    const tmin = activity.events[0].start_time;
    return (
        <div className="activity-sample-vis-container">
            <div className="sample-title">
                <p>{activity.klass}</p>
            </div>
            <div className="activity-timeline-container">
                <svg className="timeline-svg" width={timelineWidth} height={timelineHeight}>
                    <line
                        className="timeline-line"
                        x1={0}
                        x2={timelineWidth}
                        y1={timelineHeight - 3}
                        y2={timelineHeight - 3}
                    ></line>
                    {activity.events.map((ev, idx) => {
                        const coords = getTimelineCoords(
                            ev.start_time,
                            ev.end_time,
                            tmin,
                            timelineMax,
                            0,
                            timelineWidth
                        );
                        return (
                            <g>
                                <rect
                                    key={idx}
                                    x={coords.x1}
                                    y={timelineHeight - timelineRectHeight - 6}
                                    width={coords.x2 - coords.x1}
                                    height={timelineRectHeight}
                                    rx={2}
                                    onMouseEnter={() => setHovered(idx)}
                                    onMouseLeave={() => setHovered(-1)}
                                ></rect>
                                {hovered === idx && (
                                    <text
                                        className="tooltip-text"
                                        x={coords.x1 + 10}
                                        y={timelineHeight - tooltipHeight - 4}
                                    >
                                        {ev.klass +
                                            "    " +
                                            (ev.start_time - tmin).toString() +
                                            "-" +
                                            (ev.end_time - tmin).toString()}
                                    </text>
                                )}
                            </g>
                        );
                    })}
                </svg>
            </div>
        </div>
    );
};

export default ActivitySampleVis;
