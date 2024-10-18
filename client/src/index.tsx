import React from "react";
import ReactDOM from "react-dom";
import './styles/styles.css';
const App = () => {
  return (
    <div>
      <body >
      <h2>Hello from React in Electron with TypeScript!</h2>
   
        <label>Username:</label> 
        <input type="text"></input>

        <label>Password:</label>
        <input type="text"></input>
        <button>Sign Up</button>
        </body>
    </div>
  );
};

ReactDOM.render(<App />, document.getElementById("root"));
