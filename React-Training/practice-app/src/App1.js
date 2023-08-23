import React from "react";

const reactElementToString = (element) => {
  if (typeof element === "string") {
    return element;
  }

  if (React.isValidElement(element)) {
    const children = React.Children.map(element.props.children, (child) =>
      reactElementToString(child)
    );
    return children.join("");
  }

  return "";
};

const getSearchStringRanges = (text, searchString) => {
  const ranges = [];
  const searchStringLC = searchString.toLowerCase();
  let index = text.toLowerCase().indexOf(searchStringLC);

  while (index !== -1) {
    ranges.push({ start: index, end: index + searchString.length - 1 });
    index = text.toLowerCase().indexOf(searchStringLC, index + 1);
  }

  return ranges;
};

const highlightStringInReactElement = (element, searchString) => {
  let stringCount = 0;
  let ranges = [];

  if (typeof element === "string") {
    let returnVal = [];
    while (
      ranges.length > 0 &&
      ranges[0].start < stringCount + element.length
    ) {
      let index = ranges[0].start - stringCount;
      let searchedString;
      if (ranges[0].end > stringCount + element.length) {
        searchedString = (
          <>
            {element.substring(0, index)}
            <span style={{ backgroundColor: "yellow" }}>
              {element.substr(index)}
            </span>
          </>
        );
        ranges[0].start = stringCount + element.length;
      } else {
        searchedString = (
          <>
            {element.substring(0, index)}
            <span style={{ backgroundColor: "yellow" }}>
              {element.substr(index, ranges[0].end - ranges[0].start + 1)}
            </span>
            {element.substring(index + ranges[0].end - ranges[0].start + 1)}
          </>
        );
        ranges.splice(0, 1);
      }
      returnVal.push(searchedString);
    }
    stringCount += element.length;
    return <>{returnVal.length > 0 ? returnVal.map((e) => e) : element}</>;
  }

  if (React.isValidElement(element)) {
    const children = React.Children.map(element.props.children, (child) =>
      highlightStringInReactElement(child, searchString)
    );

    return React.cloneElement(element, null, children);
  }

  return element;
};

// Example usage
const NestedElementWithHighlight = ({ children, searchString }) => {
  const nestedElement = children;
  if (searchString === "") return nestedElement;
  const textContent = reactElementToString(nestedElement, []);
  ranges = getSearchStringRanges(textContent, searchString);
  return ranges.length === 0 ? (
    nestedElement
  ) : (
    <div>
      {highlightStringInReactElement(
        nestedElement,
        searchString,
        searchCount,
        ranges
      )}
    </div>
  );
};

// Usage example:
const App = () => {
  const [searchString, setSearchString] = React.useState("");
  return (
    <div>
      <input
        type="text"
        onChange={(e) => setSearchString(e.target.value)}
        value={searchString}
      />
      <NestedElementWithHighlight searchString={searchString}>
        <div>
          <p>
            Hi <b>React</b>, this is a nested <b>React </b> element with a{" "}
            <span>highlighted</span> word.
          </p>
          <p>
            React is great for{" "}
            <span>
              <b>building</b>
            </span>{" "}
            user interfaces!
          </p>
          <p>
            <b>hi</b> <b>react</b>
          </p>
        </div>
      </NestedElementWithHighlight>
    </div>
  );
};

export default App;
