import './App.css';
import MusicPlayer from './Components/MusicPlayer/MusicPlayer';
import Login from './Components/Login/Login';
import {
  BrowserRouter as Router,
  Route,
  Switch,
} from "react-router-dom";

function App() {
  return (
    <Router>
      <Switch>
        <Route exact path="/login">
          <Login/>
        </Route>
        <Route exact path="/">
          <MusicPlayer/>
        </Route>
      </Switch>
    </Router>
  );
}

export default App;
