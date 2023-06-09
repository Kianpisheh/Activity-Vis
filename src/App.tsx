import React from 'react';

import './App.css';
import VisPanel from './components/VisPanel';
import { Activity } from './globalInterfaces/interfaces';

function App() {

  let activities: Activity[] = [{klass: "cooking", name: "cooking_1", events: [{klass: "mug", name: "mug_1", start_time: 100, end_time: 200}]}]


  return (
    <div className="App">
      <header className="App-header">
        <div id='vis-panel'>
          <VisPanel activities={activities}></VisPanel>
        </div>
      </header>
    </div>
  );
}

export default App;
