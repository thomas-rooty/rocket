import './App.css';
import MusicPlayer from './Components/MusicPlayer/MusicPlayer';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/">
          <MusicPlayer/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
