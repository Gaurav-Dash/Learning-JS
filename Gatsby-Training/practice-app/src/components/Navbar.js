import React from "react";
import { Link } from "gatsby";
const Navbar = () => {
  return (
    <div>
      <Link to="/"> Home </Link>
      <Link to="/about"> About </Link>
      <Link to="/contact"> Contact </Link>
      <Link to="/recipes"> Recipe </Link>
      <Link to="/tags"> Tags </Link>
    </div>
  );
};

export default Navbar;
