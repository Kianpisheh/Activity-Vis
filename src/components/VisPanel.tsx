import React, { useCallback, useRef, useState } from "react";

import debounce from "lodash.debounce";

import "./VisPanel.css";
import { Activity, VisPanelSettings } from "../globalInterfaces/interfaces.ts";
import ActivitySampleVis from "./ActivitySampleVis.tsx";
import FilterField from "./FilterField.tsx";
import { EventListPane } from "./EventsListPane.tsx";
import { parseFilterText, criteriaCheckL } from "../helpers/ActivityVisHelpers.ts";
import { VideoPlayer } from "./VideoPlayer.tsx";

interface VisPanelProps {
    activities: Activity[];
    colors: { [key: string]: string };
    settings: VisPanelSettings;
    eventsList: string[];
}

const VisPanel: React.FC<VisPanelProps> = ({ activities, settings, colors, eventsList }) => {
    const [filterList, setFilterList] = useState<string[]>([]);
    const [filterText, setFilterText] = useState("");
    const [focusedSample, setFocusedSample] = useState("");
    const [jumpToSecond, setJumpToSecond] = useState(0);

    const activitySamplesContainerRef = useRef<HTMLDivElement | null>(null);
    const activitySampleRefs = useRef<Array<HTMLDivElement | null>>([]);

    // check filter criteria
    const criteriaCheckResults = criteriaCheckL(activities, filterList);

    const handleTitleClick = useCallback((sampleTitle: string) => {
        setFocusedSample((prevFocusedSample) =>
            prevFocusedSample === sampleTitle ? "" : sampleTitle
        );
        setJumpToSecond(0);
    }, []);

    const handleVideoTimeChange = useCallback((time: number) => {
        setJumpToSecond(time);
    }, []);

    const handleFilterUpdate = (currentFilterText: string) => {
        setFilterText(currentFilterText);
        debouncedUpdateFilterList(currentFilterText, filterList, eventsList);
    };

    const debouncedUpdateFilterList = useCallback(
        debounce(
            (currentFilterText: string, filterList: string[], eventsList: string[]): string[] => {
                console.log("called");
                const { updatedFilterList, update } = parseFilterText(
                    currentFilterText,
                    filterList,
                    eventsList
                );
                if (update) {
                    setFilterList(updatedFilterList);
                }

                return updatedFilterList;
            },
            250
        ),
        []
    );

    return (
        <div id="panel-container" style={{ width: settings.width, height: settings.height }}>
            <FilterField onFilterTextChange={handleFilterUpdate} filterText={filterText} />
            <div
                id="activity-samples"
                ref={activitySamplesContainerRef}
                style={{
                    width: Math.round(settings.visibleTimelineWidth),
                    height: Math.round(0.8 * settings.height),
                }}
            >
                {activities.map((activity, idx) => {
                    return (
                        <div>
                            <div
                                key={idx}
                                className="activity-sample-container"
                                ref={(el) => (activitySampleRefs.current[idx] = el)}
                                sample-id={idx.toString()}
                            >
                                {(criteriaCheckResults[idx] || !filterList.length) && (
                                    <ActivitySampleVis
                                        activity={activity}
                                        settings={settings}
                                        colors={colors}
                                        filterList={filterList}
                                        onTitleSelected={handleTitleClick}
                                        onVideoTimeChange={handleVideoTimeChange}
                                    />
                                )}
                            </div>
                            {focusedSample === activity.name && (
                                <div className="video-player-container">
                                    <VideoPlayer
                                        videoName={activity.name}
                                        jumpRequest={jumpToSecond}
                                    />
                                    <button onClick={() => setFocusedSample("")}>
                                        Close video
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
            <div id="events-list-pane" style={{ height: Math.round(0.8 * settings.height) }}>
                <EventListPane
                    eventsList={eventsList}
                    onEventClick={useCallback((eventKlass: string) => {
                        setFilterText(
                            (filterText.trim().replace(/,\s*$/, "") + ", " + eventKlass).replace(
                                /^,\s*/,
                                ""
                            )
                        );
                    }, [])}
                ></EventListPane>
            </div>
            <span className="item-num">{`${
                criteriaCheckResults.filter(Boolean).length
            } items`}</span>
        </div>
    );
};

export default VisPanel;
