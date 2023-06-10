export interface Activity {
    klass: string;
    name: string; // unique
    events: Event[];
}

interface Event {
    klass: string;
    name: string;
    start_time: number;
    end_time: number;
}

export interface VisPanelSettings {
    width: number;
    height: number;
    timelineWidth: number;
    timelineHeight: number;
    timelineMax: number;
    timelineRectHeight: number;
}
