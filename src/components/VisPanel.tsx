import React, { useEffect, useRef, useState } from "react";

import "./VisPanel.css";
import { Activity, VisPanelSettings } from "../globalInterfaces/interfaces.ts";
import ActivitySampleVis from "./ActivitySampleVis.tsx";
import FilterField from "./FilterField.tsx";
import { handleFilterTextChange, includesAll } from "../helpers/ActivityVisHelpers.ts";
import { getEventsClasses } from "../helpers/utils.ts";
import SelectableArea from "./SelectableArea.tsx";

interface VisPanelProps {
    activities: Activity[];
    colors: { [key: string]: string };
    settings: VisPanelSettings;
    eventsList: string[];
}

const VisPanel: React.FC<VisPanelProps> = ({ activities, settings, colors, eventsList }) => {
    const [filterList, setFilterList] = useState<string[]>([]);
    const [visibleSamples, setVisibleSamples] = useState<string[]>([]);

    const activitySamplesContainerRef = useRef<HTMLDivElement | null>(null);
    const activitySampleRefs = useRef<Array<HTMLDivElement | null>>([]);

    useEffect(() => {
        const options = {
            root: activitySamplesContainerRef.current,
            threshold: 0.0,
            rootMargin: "1000px",
        };

        const observerCallback = (entries: IntersectionObserverEntry[]) => {
            let addedSamples: string[] = [];
            let removedSamples: string[] = [];
            for (let i = 0; i < entries.length; i++) {
                const idd = entries[i].target.getAttribute("sample-id");
                if (entries[i].isIntersecting && entries[i].target) {
                    if (idd !== null) {
                        addedSamples.push(idd);
                    }
                } else if (!entries[i].isIntersecting) {
                    if (idd !== null) {
                        removedSamples.push(idd);
                    }
                }
            }

            setVisibleSamples((prevVisibleSamples) => {
                return [...prevVisibleSamples, ...addedSamples].filter(
                    (prevVisSample) => !removedSamples.includes(prevVisSample)
                );
            });
        };

        let observer = new IntersectionObserver(observerCallback, options);
        activitySampleRefs.current = activitySampleRefs.current.slice(0, activities.length);
        activitySampleRefs.current.forEach((sampleRef) => {
            if (sampleRef) {
                observer.observe(sampleRef);
            }
        });

        return () => {
            observer.disconnect();
        };
    }, [activities]);

    return (
        <div id="panel-container" style={{ width: settings.width, height: settings.height }}>
            <FilterField
                onFilterTextChange={(currentFilterText: string) => {
                    const { updatedFilterList, update } = handleFilterTextChange(
                        currentFilterText,
                        filterList,
                        eventsList
                    );
                    if (update) {
                        console.log("updated");
                        console.log(updatedFilterList);
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
                            {(includesAll(getEventsClasses(activity.events), filterList) ||
                                !filterList.length) && (
                                <SelectableArea>
                                    <ActivitySampleVis
                                        activity={activity}
                                        settings={settings}
                                        colors={colors}
                                        filterList={filterList}
                                        sampleID={idx.toString()}
                                        visibleSamples={visibleSamples}
                                    />
                                </SelectableArea>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VisPanel;
