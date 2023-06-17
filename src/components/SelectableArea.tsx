import React, { useState } from "react";

import "./SelectableArea.css";

type SelectableAreaProps = {
    onSelectionDone: (selectionStartX: number, selectionWidth: number) => void;
};

const SelectableArea: React.FC<SelectableAreaProps> = ({ onSelectionDone }) => {
    const [selectionStart, setSelectionStart] = useState([0, 0]);
    const [selectionEnd, setSelectionEnd] = useState([0, 0]);
    const [mouseDown, setMouseDown] = useState(false);

    console.log(`Start (${selectionStart[0]}, ${selectionStart[1]})`);
    console.log(`End (${selectionEnd[0]}, ${selectionEnd[1]})`);

    const handleMouseDown = (e: React.MouseEvent) => {
        setSelectionStart([
            e.nativeEvent.clientX - e.currentTarget.getBoundingClientRect().left,
            e.nativeEvent.clientY - e.currentTarget.getBoundingClientRect().top,
        ]);
        setMouseDown(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (mouseDown) {
            setSelectionEnd([
                e.nativeEvent.clientX - e.currentTarget.getBoundingClientRect().left,
                e.nativeEvent.clientY - e.currentTarget.getBoundingClientRect().top,
            ]);
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        onSelectionDone(selectionStart[0], Math.round(selectionEnd[0] - selectionStart[0]));
        setMouseDown(false);
        setSelectionStart([0, 0]);
        setSelectionEnd([0, 0]);
    };

    return (
        <div
            className="selectable-area-container"
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
        >
            {mouseDown && (
                <div
                    className="selected-area"
                    style={{
                        zIndex: 10,
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
