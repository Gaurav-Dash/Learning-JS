import React from "react";

const Footer = () => {
  return (
    <footer className="page-footer">
      <p>
        Building something with <a href="https://gatsbyjs.com/">Gatsby</a> in{" "}
        {new Date().getFullYear()}
      </p>
    </footer>
  );
};

export default Footer;
