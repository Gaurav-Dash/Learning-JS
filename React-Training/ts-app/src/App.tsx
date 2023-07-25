import "./App.css";
import { Polymorphic } from "./components/Polymorphic";
import Greet from "./components/Greet";
import User from "./components/User";
import { UserContextProvider } from "./components/UserContext";

function App() {
  return (
    <div className="App">
      <Greet name="GD" />
      <UserContextProvider>
        <User />
      </UserContextProvider>
      <Polymorphic as="p">Some heading</Polymorphic>
    </div>
  );
}

export default App;
