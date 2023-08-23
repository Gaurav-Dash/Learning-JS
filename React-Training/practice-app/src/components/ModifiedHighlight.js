import React from "react";

// Function to convert a nested React element to a string representation
const reactElementToString = (element, ranges) => {
  if (typeof element === "string") {
    return element;
  }

  if (React.isValidElement(element)) {
    const children = React.Children.map(element.props.children, (child) =>
      reactElementToString(child, ranges)
    );
    return children.join("");
  }

  return "";
};

// Function to search and get the ranges of the target string in the given text
const getSearchStringRanges = (text, searchString) => {
  const ranges = [];
  const searchStringLC = searchString.toLowerCase();
  let index = text.toLowerCase().indexOf(searchStringLC);

  while (index !== -1) {
    ranges.push({ start: index, end: index + searchString.length });
    index = text.toLowerCase().indexOf(searchStringLC, index + 1);
  }

  return ranges;
};

// Function to highlight the target string in the nested React element
const highlightStringInReactElement = (element, searchString) => {
  const text = reactElementToString(element);
  const ranges = getSearchStringRanges(text, searchString);

  let currentIndex = 0;
  const highlightedText = ranges.map(({ start, end }) => {
    const nonHighlightedText = text.substring(currentIndex, start);
    const highlightedPart = text.substring(start, end);

    currentIndex = end;

    return (
      <>
        {nonHighlightedText}
        <span style={{ backgroundColor: "yellow" }}>{highlightedPart}</span>
      </>
    );
  });

  highlightedText.push(text.substring(currentIndex)); // Add the remaining text after the last match

  return <>{highlightedText}</>;
};

// Example usage
const NestedElementWithHighlight = ({ searchString }) => {
  const nestedElement = (
    <div>
      <p>
        Hi <b>React</b>, this is a nested React element with a{" "}
        <span>highlighted</span> word.
      </p>
      <p>React is great for building user interfaces!</p>
    </div>
  );

  return (
    <div>{highlightStringInReactElement(nestedElement, searchString)}</div>
  );
};

// Usage example:
const App = () => {
  return (
    <div>
      <NestedElementWithHighlight searchString="hi React" />
    </div>
  );
};

export default App;
