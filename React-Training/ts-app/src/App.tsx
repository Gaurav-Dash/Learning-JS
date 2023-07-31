import "./App.css";
// import { Polymorphic } from "./components/Polymorphic";
// import Greet from "./components/Greet";
// import User from "./components/User";
// import { UserContextProvider } from "./components/UserContext";
import Highlight from "./components/Highlight";

function App() {
  return (
    <div className="App">
      {/* <Greet name="GD" /> */}
      {/* <UserContextProvider> */}
      {/* <User /> */}
      {/* </UserContextProvider> */}
      {/* <Polymorphic as="p">Some heading</Polymorphic> */}
      <Highlight>some text here some text there</Highlight>
    </div>
  );
}

export default App;
