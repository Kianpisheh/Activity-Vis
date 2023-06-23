import React from "react";

import "./EventsListPane.css";

type EventsListProp = {
    eventsList: string[];
    onEventClick: (ev: string) => void;
};

export const EventListPane: React.FC<EventsListProp> = ({ eventsList, onEventClick }) => {
    return (
        <div id="list-pane-container">
            <div id="pane-title">
                <p>{"Events list"}</p>
            </div>
            <div id="events-list">
                <ul>
                    {eventsList.sort().map((ev, idx) => {
                        return (
                            <li key={idx} className="event-item" onClick={() => onEventClick(ev)}>
                                <span>{ev}</span>
                            </li>
                        );
                    })}
                </ul>
            </div>
        </div>
    );
};
