import { useContext } from "react";
import { UserContext } from "./UserContext";

function User() {
  const { usr, setUser } = useContext(UserContext);
  const handleLogin = () => {
    setUser({
      name: "GD",
      email: "some@something.com",
    });
  };
  const handleLogout = () => {
    setUser({ name: "", email: "" });
  };
  return (
    <>
      <button onClick={handleLogin}>Login</button>
      <button onClick={handleLogout}>Logout</button>
      <div>Username - {usr?.name}</div>
      <div>email - {usr?.email} </div>
    </>
  );
}

export default User;
