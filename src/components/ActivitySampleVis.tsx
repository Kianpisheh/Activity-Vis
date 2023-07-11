import React, { useEffect, useRef, useState } from "react";

import { Activity, VisPanelSettings } from "../globalInterfaces/interfaces";
import {
    getTimelineCoords,
    handleZoomEvent,
    getTimelineTicks,
    satisfiedInstance,
    formatTime,
} from "../helpers/ActivityVisHelpers";

import "./ActivitySampleVis.css";

import SelectableArea from "./SelectableArea";
import { cropActivity } from "../helpers/ActivityDataHelpers";

interface ActivitySampleVisProp {
    activity: Activity;
    settings: VisPanelSettings;
    colors: { [key: string]: string };
    filterList: string[];
    onTitleSelected: (title: string) => void;
    onVideoTimeChange: (time: number) => void;
}

const ActivitySampleVis: React.FC<ActivitySampleVisProp> = React.memo(
    ({ activity, settings, colors, filterList, onTitleSelected, onVideoTimeChange }) => {
        const {
            visibleTimelineWidth,
            timelineHeight,
            timelineRectHeight,
            initialTimelineDuration,
            tooltipHeight,
        } = settings;

        const [hoveredEvent, setHoveredEvent] = useState(-1);
        const [timelineDuration, setTimelineDuration] = useState(initialTimelineDuration);
        const [svgStartX, setSvgStartX] = useState(0);
        const [timelineIsHovered, setTimelineIsHovered] = useState(false);
        const [cutPoint, setCutPoint] = useState(-1);

        const svgContainerRef = useRef<HTMLDivElement>(null);

        // const tmin = activity.events[0].start_time;
        const tmin = 0;
        const last_idx = activity.events.length - 1;
        let timelineWidth = Math.ceil(
            ((activity.events[last_idx].end_time - tmin) / timelineDuration) * visibleTimelineWidth
        );

        timelineWidth = timelineWidth < visibleTimelineWidth ? visibleTimelineWidth : timelineWidth;
        const timelineTicks = getTimelineTicks(
            visibleTimelineWidth,
            timelineWidth,
            timelineDuration
        );

        useEffect(() => {
            if (svgContainerRef && svgContainerRef.current) {
                svgContainerRef.current.scrollTo(svgStartX, 0);
            }
        }, [svgStartX]);

        const handleScroll = (e: React.UIEvent<HTMLDivElement>) => {
            setSvgStartX(e.currentTarget.scrollLeft);
        };

        return (
            <div
                className="activity-sample-vis-container"
                onMouseEnter={() => setTimelineIsHovered(true)}
                onMouseLeave={() => setTimelineIsHovered(false)}
            >
                <div
                    className="sample-title"
                    style={{ width: settings.activityTitleWidth }}
                    onClick={() => onTitleSelected(activity.name)}
                >
                    <p>{activity.name}</p>
                </div>
                <div
                    className="activity-timeline-container"
                    ref={svgContainerRef}
                    style={{ width: "81%" }}
                    onScroll={handleScroll}
                >
                    <SelectableArea
                        settings={settings}
                        selectableStartX={svgStartX}
                        onSelectionDone={(selectionStartX, selectionWidth) => {
                            console.log(`selection x: ${selectionStartX}`);
                            const newTimelineDuration = Math.round(
                                timelineDuration * (selectionWidth / visibleTimelineWidth)
                            );
                            setSvgStartX(
                                Math.round(
                                    (selectionStartX + svgStartX) *
                                        (timelineDuration / newTimelineDuration)
                                )
                            );
                            setTimelineDuration(newTimelineDuration);
                        }}
                    >
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
                                    timelineDuration,
                                    0,
                                    visibleTimelineWidth
                                );

                                let tooltip =
                                    ev.klass2 == "" || ev.klass2 == ev.klass
                                        ? "(" + ev.klass + ")"
                                        : "(" + ev.klass + ", " + ev.klass2 + ")";
                                tooltip += `  [${formatTime(Math.round(ev.start_time - tmin))}, 
                                     ${formatTime(Math.round(ev.end_time - tmin))}]`;

                                return (
                                    <g key={idx}>
                                        <rect
                                            key={idx}
                                            x={coords.x1}
                                            y={timelineHeight - timelineRectHeight - 34}
                                            width={coords.x2 - coords.x1}
                                            height={timelineRectHeight}
                                            rx={2}
                                            onMouseEnter={() => {
                                                setHoveredEvent(idx);
                                            }}
                                            onMouseLeave={() => setHoveredEvent(-1)}
                                            fill={colors[ev.klass]}
                                            onMouseDown={(m_ev) => {
                                                if (m_ev.shiftKey) {
                                                    if (cutPoint === -1) {
                                                        setCutPoint(ev.start_time);
                                                    } else {
                                                        // cut and save data
                                                        const jsonString = `data:text/json;chatset=utf-8,${encodeURIComponent(
                                                            JSON.stringify(
                                                                cropActivity(
                                                                    activity,
                                                                    cutPoint,
                                                                    ev.start_time
                                                                )
                                                            )
                                                        )}`;
                                                        const link = document.createElement("a");
                                                        link.href = jsonString;
                                                        link.download = `${
                                                            activity.name
                                                        }_${Math.round(cutPoint)}_${Math.round(
                                                            ev.start_time
                                                        )}.json`;

                                                        link.click();
                                                        setCutPoint(-1);
                                                    }
                                                } else {
                                                    onVideoTimeChange(ev.start_time);
                                                }
                                            }}
                                        ></rect>
                                        {/* specify filtered events */}
                                        {satisfiedInstance(filterList, ev) && (
                                            <circle
                                                cx={Math.round(0.5 * (coords.x1 + coords.x2))}
                                                cy={timelineHeight - timelineRectHeight - 39}
                                                r={3}
                                                fill={colors[ev.klass]}
                                                onMouseEnter={() => setHoveredEvent(idx)}
                                                onMouseLeave={() => setHoveredEvent(-1)}
                                                onMouseDown={() => {
                                                    onVideoTimeChange(ev.start_time);
                                                }}
                                            ></circle>
                                        )}
                                        {hoveredEvent === idx && (
                                            <text
                                                className="tooltip-text"
                                                x={coords.x1 + 10}
                                                y={timelineHeight - tooltipHeight - 36}
                                            >
                                                {tooltip}
                                            </text>
                                        )}
                                    </g>
                                );
                            })}
                        </svg>
                    </SelectableArea>
                </div>
                {timelineIsHovered && (
                    <div className="zoom-buttons-container">
                        <button
                            className="zoom-btn"
                            onClick={() =>
                                setTimelineDuration(
                                    handleZoomEvent("-", timelineDuration, initialTimelineDuration)
                                )
                            }
                        >
                            -
                        </button>
                        <button
                            className="zoom-btn"
                            onClick={() =>
                                setTimelineDuration(
                                    handleZoomEvent("+", timelineDuration, initialTimelineDuration)
                                )
                            }
                        >
                            +
                        </button>
                    </div>
                )}
            </div>
        );
    }
);

export default ActivitySampleVis;
