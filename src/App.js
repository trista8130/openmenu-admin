import React from 'react';
import './App.css';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import ProtectPages from '../src/constants/page';
import PageNotFound from '../src/pages/404/index';
import LoginPage from './pages/login';
import { useState, useEffect } from 'react';
import axios from 'axios';

import NavBar from './components/NavBar';

export const UserContext = React.createContext({});

function App() {
  const [user, setUser] = useState({});
  useEffect(() => {
    const token = window.localStorage.getItem('token');
    const fetchUser = async () => {
      const response = await axios.get(
        'https://om.demo.bctc.io/employees/current',
        { headers: { authorization: `Bearer ${token}` } }
      );
      setUser({ ...response.data.data });
    };
    if (token) {
      fetchUser();
    }
  }, []);

  return (
    <Router>
      {window.location.href.split('/')[3] !== '' && <NavBar user={user} />}
      <UserContext.Provider value={user}>
        <Switch>
          <Route exact path='/' component={LoginPage} />
          {ProtectPages &&
            ProtectPages.map((v) => (
              <Route
                exact={v.isExact}
                render={() => v.component}
                path={v.path}
                key={v.path}
              />
            ))}
          <Route component={PageNotFound} />
        </Switch>
      </UserContext.Provider>
    </Router>
  );
}

export default App;
