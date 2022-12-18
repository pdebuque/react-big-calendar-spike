import './App.css';
import Calendar from '../Calendar/Calendar'

function App() {
  return (
    <main>
      <h1>react-big-calendar spike</h1>
      <h2>objectives: monthly view</h2>
      <ul>
        <li>
          display events
        </li>
        <li>
          add events - click on any white space
        </li>
        <li>
          edit events - click on an existing event
        </li>
        <li>
          drag/drop events
        </li>
      </ul>

<Calendar/>

    </main>
  );
}

export default App;
