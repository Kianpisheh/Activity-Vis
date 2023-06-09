import React from 'react';
import {Activity} from "../globalInterfaces/interfaces.ts";

interface VisPanelProps {
    activities: Activity[];
}

const VisPanel:React.FC<VisPanelProps>=({activities}) => {

    return <div id='panel-container'>
        <div id='vis-panel'>
            {activities.map((activity, idx) => {
                return <div key={idx} className='activity-sample-container'>
                    <ActivitySampleVis></ActivitySampleVis>
                </div>
            })}
        </div>
    </div>
}


export default VisPanel