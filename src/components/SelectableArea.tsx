import React, { useRef, useState } from "react";

import "./SelectableArea.css";
import { VisPanelSettings } from "../globalInterfaces/interfaces";

type SelectableAreaProps = {
    children: React.ReactNode;
    onSelectionDone: (selectionStartX: number, selectionWidth: number) => void;
    settings: VisPanelSettings;
    selectableStartX: number;
};

const SelectableArea: React.FC<SelectableAreaProps> = ({
    children,
    onSelectionDone,
    settings,
    selectableStartX,
}) => {
    const [selectionStart, setSelectionStart] = useState([0, 0]);
    const [selectionEnd, setSelectionEnd] = useState([0, 0]);
    const [mouseDown, setMouseDown] = useState(false);

    const selectionContainerRef = useRef<HTMLDivElement>(null);

    const { activityTitleWidth, visibleTimelineWidth, timelineHeight } = settings;

    const handleMouseDown = (e: React.MouseEvent) => {
        setSelectionStart([
            e.nativeEvent.pageX -
                e.currentTarget.getBoundingClientRect().left +
                activityTitleWidth -
                selectableStartX,
            e.nativeEvent.clientY - e.currentTarget.getBoundingClientRect().top,
        ]);
        setSelectionEnd([
            e.nativeEvent.pageX -
                e.currentTarget.getBoundingClientRect().left +
                activityTitleWidth +
                1 -
                selectableStartX,
            e.nativeEvent.clientY - e.currentTarget.getBoundingClientRect().top + 1,
        ]);
        setMouseDown(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (mouseDown) {
            let endX =
                e.nativeEvent.pageX -
                e.currentTarget.getBoundingClientRect().left +
                activityTitleWidth -
                selectableStartX;
            let endY = e.nativeEvent.clientY - e.currentTarget.getBoundingClientRect().top;

            // ensure valid coordinates
            endX = endX > 0 ? endX : 0;
            endX = endX < visibleTimelineWidth ? endX : visibleTimelineWidth;
            endY = endY > 0 ? endY : 0;
            endY = endY < timelineHeight ? endY : timelineHeight;
            setSelectionEnd([endX, endY]);
        }
    };

    const handleMouseUp = () => {
        let startX = selectionStart[0] - activityTitleWidth;
        if (selectionStart[0] > selectionEnd[0]) {
            startX = selectionEnd[0] - activityTitleWidth;
        }
        startX = startX > 0 ? startX : 0;

        if (
            Math.round(Math.abs(selectionEnd[0] - selectionStart[0])) > 5 &&
            Math.round(Math.abs(selectionEnd[1] - selectionStart[1])) > 5
        ) {
            onSelectionDone(startX, Math.round(Math.abs(selectionEnd[0] - selectionStart[0])));
        }

        setMouseDown(false);
        setSelectionStart([0, 0]);
        setSelectionEnd([0, 0]);
    };

    return (
        <div
            className="selectable-area-container"
            ref={selectionContainerRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {children}
            {mouseDown && (
                <div
                    className="selected-area"
                    style={{
                        zIndex: 2,
                        position: "absolute",
                        top: Math.min(selectionStart[1], selectionEnd[1]),
                        left: Math.min(selectionStart[0], selectionEnd[0]),
                        height: Math.abs(selectionEnd[1] - selectionStart[1] - 1),
                        width: Math.abs(selectionEnd[0] - selectionStart[0] - 1),
                    }}
                ></div>
            )}
        </div>
    );
};

export default SelectableArea;
