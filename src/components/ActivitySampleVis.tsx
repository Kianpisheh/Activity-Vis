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
    colors: { [key: string]: string };
    filterList: string[];
    visibleSamples: string[];
    sampleID: string;
}

const ActivitySampleVis: React.FC<ActivitySampleVisProp> = ({
    activity,
    settings,
    colors,
    filterList,
    sampleID,
    visibleSamples,
}) => {
    const {
        visibleTimelineWidth,
        timelineHeight,
        timelineRectHeight,
        initialTimelineMax,
        tooltipHeight,
    } = settings;

    const [hoveredEvent, setHoveredEvent] = useState(-1);
    const [timelineMax, setTimelineMax] = useState(initialTimelineMax);
    const [timelineIsHovered, setTimelineIsHovered] = useState(false);

    const tmin = activity.events[0].start_time;
    const last_idx = activity.events.length - 1;
    let timelineWidth = Math.ceil(
        (activity.events[last_idx].end_time / timelineMax) * visibleTimelineWidth
    );

    timelineWidth = timelineWidth < visibleTimelineWidth ? visibleTimelineWidth : timelineWidth;
    const timelineTicks = getTimelineTicks(visibleTimelineWidth, timelineWidth, timelineMax);

    console.log("rendered");
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
                    {
                        <line
                            className="timeline-line"
                            x1={0}
                            x2={timelineWidth}
                            y1={timelineHeight - 28}
                            y2={timelineHeight - 28}
                        ></line>
                    }
                    {/*timeline ticks*/}
                    {timelineTicks.map((tick, idx) => {
                        return (
                            <text
                                key={idx}
                                className="tick-labels"
                                x={tick.x}
                                y={timelineHeight - 14}
                            >
                                {tick.label}
                            </text>
                        );
                    })}

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
                                    y={timelineHeight - timelineRectHeight - 34}
                                    width={coords.x2 - coords.x1}
                                    height={timelineRectHeight}
                                    rx={2}
                                    onMouseEnter={() => setHoveredEvent(idx)}
                                    onMouseLeave={() => setHoveredEvent(-1)}
                                    fill={colors[ev.klass]}
                                ></rect>
                                {/* specify filtered events */}
                                {filterList.includes(ev.klass) && (
                                    <circle
                                        cx={Math.round(0.5 * (coords.x1 + coords.x2))}
                                        cy={timelineHeight - timelineRectHeight - 39}
                                        r={3}
                                        fill={colors[ev.klass]}
                                        onMouseEnter={() => setHoveredEvent(idx)}
                                        onMouseLeave={() => setHoveredEvent(-1)}
                                    ></circle>
                                )}
                                {hoveredEvent === idx && (
                                    <text
                                        className="tooltip-text"
                                        x={coords.x1 + 10}
                                        y={timelineHeight - tooltipHeight - 36}
                                    >
                                        {ev.klass +
                                            "    " +
                                            Math.round(ev.start_time - tmin).toString() +
                                            "-" +
                                            Math.round(ev.end_time - tmin).toString()}
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
                            setTimelineMax(handleZoomEvent("-", timelineMax, initialTimelineMax))
                        }
                    >
                        -
                    </button>
                    <button
                        className="zoom-btn"
                        onClick={() =>
                            setTimelineMax(handleZoomEvent("+", timelineMax, initialTimelineMax))
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
