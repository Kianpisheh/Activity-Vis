import React, { useEffect, useRef, useState } from "react";

import "./VisPanel.css";
import { Activity, VisPanelSettings } from "../globalInterfaces/interfaces.ts";
import ActivitySampleVis from "./ActivitySampleVis.tsx";
import FilterField from "./FilterField.tsx";
import {
    handleFilterTextChange,
    inclusionCheck,
    getEventsClasses,
} from "../helpers/ActivityVisHelpers.ts";

interface VisPanelProps {
    activities: Activity[];
    colors: { [key: string]: string };
    settings: VisPanelSettings;
    eventsList: string[];
}

const VisPanel: React.FC<VisPanelProps> = ({ activities, settings, colors, eventsList }) => {
    const [filterList, setFilterList] = useState<string[]>([]);

    const activitySamplesContainerRef = useRef<HTMLDivElement | null>(null);
    const activitySampleRefs = useRef<Array<HTMLDivElement | null>>([]);

    // check filter criteria
    const filterResult: boolean[] = activities.map(
        (activity) =>
            inclusionCheck(getEventsClasses(activity.events), filterList) || !filterList.length
    );

    return (
        <div id="panel-container" style={{ width: settings.width, height: settings.height }}>
            <FilterField
                onFilterTextChange={(currentFilterText: string) => {
                    const { updatedFilterList, update } = handleFilterTextChange(
                        currentFilterText,
                        filterList,
                        eventsList
                    );
                    console.log(`list: ${updatedFilterList}`);
                    if (update) {
                        setFilterList(updatedFilterList);
                    }
                }}
            />
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
                        <div
                            key={idx}
                            className="activity-sample-container"
                            ref={(el) => (activitySampleRefs.current[idx] = el)}
                            sample-id={idx.toString()}
                        >
                            {(inclusionCheck(getEventsClasses(activity.events), filterList) ||
                                !filterList.length) && (
                                <ActivitySampleVis
                                    activity={activity}
                                    settings={settings}
                                    colors={colors}
                                    filterList={filterList}
                                />
                            )}
                        </div>
                    );
                })}
            </div>
            <span className="item-num">{`${filterResult.filter(Boolean).length} items`}</span>
        </div>
    );
};

export default VisPanel;
