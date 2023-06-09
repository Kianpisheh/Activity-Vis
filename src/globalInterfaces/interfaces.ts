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