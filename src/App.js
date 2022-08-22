import './App.css';
import {Routes, Route} from "react-router-dom";
import Playground from "./pages/Playground";
import Landing from "./pages/Landing";
import Dashboard from "./pages/Dashboard";
import Article from './pages/Article';
import { getUserDetails } from './actions/loadUser';
import Feed from './pages/Feed';
import Account from './pages/Account';

function App() {

  if(localStorage.getItem('token')){
    getUserDetails(localStorage.getItem('token'));
  }

  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Feed/>}/>
        <Route path="/landing" element={<Landing/>}/>
        <Route path="/account" element={<Account/>}/>
        <Route path="/dashboard" element={<Dashboard/>}/>
        <Route path="/article/:id" element={<Article/>}/>
        <Route path="/playground" element={<Playground/>}/>
      </Routes>
    </div>
  );
}

export default App;
