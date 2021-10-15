import './App.css';
import MusicPlayer from './Components/MusicPlayer/MusicPlayer';
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import LandingPage from './Components/LandingPage/LandingPage';
import {
  BrowserRouter as Router,
  Switch,
} from "react-router-dom";
import PrivateRoute from './Components/Route/PrivateRoute'
import PublicRoute from './Components/Route/PublicRoute';

function sayHello(){
  return(
    <h1>Hello</h1>
  )
}

function App() {
  return (
    <Router>
      <Switch>
        <PublicRoute restricted={false} exact path="/" component={LandingPage}/>
        <PublicRoute restricted={false} exact path="/register" component={Register}/>
        <PublicRoute restricted={true} exact path="/login" component={Login}/>
        <PrivateRoute exact path="/player" component={MusicPlayer}/>

      </Switch>
    </Router>
  );
}

export default App;
