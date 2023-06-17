export interface Activity {
    klass: string;
    name: string; // unique
    events: Event[];
}

export interface Event {
    klass: string;
    name: string;
    start_time: number;
    end_time: number;
}

export interface VisPanelSettings {
    width: number;
    height: number;
    visibleTimelineWidth: number;
    timelineHeight: number;
    initialTimelineMax: number;
    timelineRectHeight: number;
    tooltipHeight: number;
}
