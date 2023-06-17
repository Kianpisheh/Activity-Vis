import React, { useState } from "react";

import "./SelectableArea.css";

type Props = {
    children: React.ReactNode;
};

const SelectableArea = (props: Props) => {
    const [selectionStart, setSelectionStart] = useState([0, 0]);
    const [selectionEnd, setSelectionEnd] = useState([0, 0]);
    const [mouseDown, setMouseDown] = useState(false);

    console.log(`Start (${selectionStart[0]}, ${selectionStart[1]})`);
    console.log(`End (${selectionEnd[0]}, ${selectionEnd[1]})`);

    const handleMouseDown = (e: React.MouseEvent) => {
        setSelectionStart([e.pageX, e.pageY]);
        setMouseDown(true);
    };

    const handleMouseMove = (e: React.MouseEvent) => {
        if (mouseDown) {
            setSelectionEnd([e.pageX, e.pageY]);
        }
    };

    const handleMouseUp = (e: React.MouseEvent) => {
        setMouseDown(false);
        setSelectionStart([0, 0]);
        setSelectionEnd([0, 0]);
    };

    const handleTransformBox = () => {
        if (selectionStart[1] > selectionEnd[1] && selectionStart[0] > selectionEnd[0])
            return "scaleY(-1) scaleX(-1)";

        if (selectionStart[1] > selectionEnd[1]) return "scaleY(-1)";
        if (selectionStart[0] > selectionEnd[0]) return "scaleX(-1)";
        return null;
    };

    const baseStyle = {
        zIndex: 10,
        left: selectionStart[0],
        top: selectionStart[1],
        height: Math.abs(selectionEnd[1] - selectionStart[1] - 1),
        width: Math.abs(selectionEnd[0] - selectionStart[0] - 1),
        userSelect: "none",
        transformOrigin: "top left",
        transform: handleTransformBox(),
    };

    const selectionBoxDivStyle = {
        backgroundColor: "transparent",
        border: "1px dashed white",
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
            {props.children}
        </div>
    );
};

export default SelectableArea;
