import React, { useEffect, useRef, useState } from "react";

import "./SelectableArea.css";

type SelectableAreaProps = {
    children: React.ReactNode;
};

const SelectableArea: React.FC<SelectableAreaProps> = ({ children }) => {
    const [selectionStart, setSelectionStart] = useState([0, 0]);
    const [selectionEnd, setSelectionEnd] = useState([0, 0]);
    const [mouseDown, setMouseDown] = useState(false);

    const selectionContainerRef = useRef<HTMLDivElement>(null);

    // console.log(`Start (${selectionStart[0]}, ${selectionStart[1]})`);
    // console.log(`End (${selectionEnd[0]}, ${selectionEnd[1]})`);

    const handleMouseDown = (e: React.MouseEvent) => {
        setSelectionStart([
            e.nativeEvent.pageX - e.currentTarget.getBoundingClientRect().left + 80,
            e.nativeEvent.clientY - e.currentTarget.getBoundingClientRect().top,
        ]);
        setSelectionEnd([
            e.nativeEvent.pageX - e.currentTarget.getBoundingClientRect().left + 81,
            e.nativeEvent.clientY - e.currentTarget.getBoundingClientRect().top + 1,
        ]);
        setMouseDown(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (mouseDown) {
            setSelectionEnd([
                e.nativeEvent.pageX - e.currentTarget.getBoundingClientRect().left + 80,
                e.nativeEvent.clientY - e.currentTarget.getBoundingClientRect().top,
            ]);
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
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
                        top: selectionStart[1],
                        left: selectionStart[0],
                        height: Math.abs(selectionEnd[1] - selectionStart[1] - 1),
                        width: Math.abs(selectionEnd[0] - selectionStart[0] - 1),
                    }}
                ></div>
            )}
        </div>
    );
};

export default SelectableArea;
