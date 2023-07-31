// import React, { cloneElement } from "react";

// const interleave = (arr, thing) =>
//   [].concat(...arr.map((n) => [n, thing])).slice(0, -1);

// const modifyNode = (node, searchString) => {
//   const highlightedText = React.createElement(
//     "span",
//     { style: { background: "yellow" } },
//     searchString
//   );
//   console.log(node);
//   let modifiedcontent = `${node.props.children}`;
//   let modifiedChildren = interleave(
//     modifiedcontent.split(searchString),
//     highlightedText
//   );

//   console.log(modifiedChildren);

//   const clonedElement = cloneElement(node, {}, modifiedChildren);

//   return clonedElement;
// };

// const recurseJSX = (node, searchString) => {
//   if (!node) return node;
//   if (typeof node == "string" && node.includes(searchString))
//     return modifyNode(node, searchString);
//   if (Array.isArray(node))
//     return node.map((ele) => {
//       return recurseJSX(ele, searchString);
//     });
//   return {
//     ...node,
//     props: {
//       ...node.props,
//       children:
//         typeof node.props.children === "string" &&
//         node.props.children.includes(searchString)
//           ? modifyNode(node, searchString)
//           : recurseJSX(node.props.children),
//     },
//   };
// };

// const Highlight = ({ children }) => {
//   return <>{recurseJSX(children, "hi. bdw")}</>;
// };

// export default Highlight;

import React from "react";

const highlightString = (element, searchString) => {
  if (typeof element === "string") {
    const index = element.toLowerCase().indexOf(searchString.toLowerCase());
    if (index !== -1) {
      return (
        <>
          {element.substring(0, index)}
          <span style={{ backgroundColor: "yellow" }}>
            {element.substr(index, searchString.length)}
          </span>
          {element.substring(index + searchString.length)}
        </>
      );
    }
    return element;
  }

  if (React.isValidElement(element)) {
    const children = React.Children.map(element.props.children, (child) =>
      highlightString(child, searchString)
    );
    return React.cloneElement(element, null, children);
  }

  return element;
};

const NestedElement = ({ children, searchString }) => {
  const nestedElement = <div>{children}</div>;

  return <div>{highlightString(nestedElement, searchString)}</div>;
};

export default NestedElement;
