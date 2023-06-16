import React, { useEffect, useRef, useState } from "react";

import "./VisPanel.css";
import { Activity, VisPanelSettings } from "../globalInterfaces/interfaces.ts";
import ActivitySampleVis from "./ActivitySampleVis.tsx";
import FilterField from "./FilterField.tsx";

interface VisPanelProps {
    activities: Activity[];
    colors: { [key: string]: string };
    settings: VisPanelSettings;
}

const VisPanel: React.FC<VisPanelProps> = ({ activities, settings, colors }) => {
    const [filterText, setFilterText] = useState<string>("");
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
                        console.log("first");
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
                filterText={filterText}
                handleFilterChange={(filterText: string) => {
                    setFilterText(filterText);
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
                            <ActivitySampleVis
                                activity={activity}
                                settings={settings}
                                colors={colors}
                                filterList={filterText.split(",")}
                                sampleID={idx.toString()}
                                visibleSamples={visibleSamples}
                            />
                        </div>
                    );
                })}
            </div>
        </div>
    );
};

export default VisPanel;

// const onFilterTextChange = (txt: string): string[] => {
//     const events = txt.split(",");
//     if (events.length !== currentFilterList.length) {
//         return events;
//     }

//     for (let ev of events) {
//         if (!currentFilterList.includes(ev)) {
//             return events;
//         }
//     }

//     return [];
// };
