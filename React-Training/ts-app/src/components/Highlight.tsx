import React from "react";

interface Props {
  children?: React.ReactNode;
}

// const modifyJSX = (Node: React.ReactNode, searchText:string):React.ReactNode => {

// }

const Highlight: React.FC<Props> = ({ children }) => {
  console.log(typeof children);

  return <div>{children}</div>;
};

export default Highlight;
