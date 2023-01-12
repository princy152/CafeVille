import React, { useEffect, useState } from "react";
import "./assets/css/Style.css";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import Login from "./login/Login";
import Dashboard from "./pages/Dashboard";
import Item from "./pages/AddItem";
import Size from "./pages/AddSize";
import Orders from "./pages/Orders";
import Customer from "./pages/Customer";

function App() {
  const [token, setToken] = useState();

  useEffect(() => {
    const data = localStorage.getItem("userdata");
    setToken(JSON.parse(data));
  }, []);

  if (!token) {
    return <Login setToken={setToken} />;
  }
  return (
    <>
      <Router>
        <Switch>
          <Route path="/" exact component={Login} />
          <Route path="/dashboard" exact component={Dashboard} />
          <Route path="/add-item" exact component={Item} />
          <Route path="/add-size" exact component={Size} />
          <Route path="/orders" exact component={Orders} />
          <Route path="/customers" exact component={Customer} />
        </Switch>
      </Router>
    </>
  );
}

export default App;
