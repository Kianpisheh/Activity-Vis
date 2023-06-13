import React, { useState } from "react";

import { Activity, VisPanelSettings } from "../globalInterfaces/interfaces";
import {
    getTimelineCoords,
    handleZoomEvent,
    getTimelineTicks,
} from "../helpers/ActivityVisHelpers";

interface ActivitySampleVisProp {
    activity: Activity;
    settings: VisPanelSettings;
}

const ActivitySampleVis: React.FC<ActivitySampleVisProp> = ({ activity, settings }) => {
    const {
        initialVisibleTimelineWidth,
        timelineHeight,
        timelineRectHeight,
        timelineMax,
        tooltipHeight,
    } = settings;

    const [hoveredEvent, setHoveredEvent] = useState(-1);
    const [visibleTimelineWidth, setVisibleTimelineWidth] = useState(initialVisibleTimelineWidth);
    const [timelineIsHovered, setTimelineIsHovered] = useState(false);

    const tmin = activity.events[0].start_time;

    const last_idx = activity.events.length - 1;
    let timelineWidth = Math.ceil(
        (activity.events[last_idx].end_time / timelineMax) * visibleTimelineWidth
    );
    timelineWidth = timelineWidth < visibleTimelineWidth ? visibleTimelineWidth : timelineWidth;

    const timelineTicks = getTimelineTicks(visibleTimelineWidth, timelineWidth, timelineMax);

    return (
        <div
            className="activity-sample-vis-container"
            onMouseEnter={() => setTimelineIsHovered(true)}
            onMouseLeave={() => setTimelineIsHovered(false)}
        >
            <div className="sample-title">
                <p>{activity.name}</p>
            </div>
            <div className="activity-timeline-container">
                <svg className="timeline-svg" width={timelineWidth} height={timelineHeight}>
                    <line
                        className="timeline-line"
                        x1={0}
                        x2={timelineWidth}
                        y1={timelineHeight - 14}
                        y2={timelineHeight - 14}
                    ></line>
                    {/*timeline ticks*/}
                    {/* {[0, 0.25, 0.5, 0.75, 1].map((c) => {
                        return (
                            <text
                                key={c}
                                className="tick-labels"
                                x={Math.round(c)}
                                y={timelineHeight}
                            >
                                {"0"}
                            </text>
                        );
                    })} */}

                    {activity.events.map((ev, idx) => {
                        const coords = getTimelineCoords(
                            ev.start_time,
                            ev.end_time,
                            tmin,
                            timelineMax,
                            0,
                            visibleTimelineWidth
                        );
                        return (
                            <g key={idx}>
                                <rect
                                    key={idx}
                                    x={coords.x1}
                                    y={timelineHeight - timelineRectHeight - 20}
                                    width={coords.x2 - coords.x1}
                                    height={timelineRectHeight}
                                    rx={2}
                                    onMouseEnter={() => setHoveredEvent(idx)}
                                    onMouseLeave={() => setHoveredEvent(-1)}
                                ></rect>
                                {hoveredEvent === idx && (
                                    <text
                                        className="tooltip-text"
                                        x={coords.x1 + 10}
                                        y={timelineHeight - tooltipHeight - 22}
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
            {timelineIsHovered && (
                <div className="zoom-buttons-container">
                    <button
                        className="zoom-btn"
                        onClick={() =>
                            setVisibleTimelineWidth(
                                handleZoomEvent(
                                    "-",
                                    visibleTimelineWidth,
                                    initialVisibleTimelineWidth
                                )
                            )
                        }
                    >
                        -
                    </button>
                    <button
                        className="zoom-btn"
                        onClick={() =>
                            setVisibleTimelineWidth(
                                handleZoomEvent(
                                    "+",
                                    visibleTimelineWidth,
                                    initialVisibleTimelineWidth
                                )
                            )
                        }
                    >
                        +
                    </button>
                </div>
            )}
        </div>
    );
};

export default ActivitySampleVis;
