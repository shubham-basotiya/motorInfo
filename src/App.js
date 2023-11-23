import logo from './logo.svg';
import './App.css';
// import SignInSide from './template/sign-in-side/SignInSide';
import { Route, Switch } from 'react-router-dom';
import Home from './pages/Home';
import Blog from './pages/Blog';
import Contact from './pages/Contact';
import Navbar from './pages/Navbar';
import BlogDetail from './pages/BlogDetail';

function App() {
  return (
    <div className="App">
        <Home />
    </div>
  );
}

export default App;
