// import React from "react";

// const reactElementToString = (element: React.ReactNode): string => {
//   if (typeof element === "string") {
//     return element;
//   }

//   if (React.isValidElement(element)) {
//     const children = React.Children.map(element.props.children, (child) =>
//       reactElementToString(child)
//     );
//     return children.join("");
//   }

//   return "";
// };

// const getSearchStringRanges = (text : string, searchString: string) => {
//   const ranges = [];
//   const searchStringLC = searchString.toLowerCase();
//   let index = text.toLowerCase().indexOf(searchStringLC);

//   while (index !== -1) {
//     ranges.push({ start: index, end: index + searchString.length - 1 });
//     index = text.toLowerCase().indexOf(searchStringLC, index + 1);
//   }

//   return ranges;
// };

// const highlightStringInReactElement = (
//   element:React.ReactNode,
//   searchString:string,
//   stringCount:number,
//   ranges:{start:number, end:number}[]
// ):{element: React.ReactNode, stringCount: number, range : [{start:number, end:number}]}[] => {
//   if (typeof element === "string") {
//     let returnVal = [];
//     let prev = 0;
//     while (
//       ranges.length > 0 &&
//       ranges[0].start < stringCount + element.length
//     ) {
//       let index = ranges[0].start - stringCount;
//       let searchedString;
//       if (ranges[0].end > stringCount + element.length) {
//         searchedString = (
//           <>
//             {element.substring(prev, index)}
//             <span style={{ backgroundColor: "yellow" }}>
//               {element.substr(index)}
//             </span>
//           </>
//         );
//         ranges[0].start = stringCount + element.length;
//       } else {
//         console.log("index", index);
//         const currRange = ranges[0];
//         searchedString = (
//           <React.Fragment>
//             {element.substring(prev - stringCount, index)}
//             <span style={{ backgroundColor: "yellow" }}>
//               {element.substr(index, currRange.end - currRange.start + 1)}
//             </span>
//             {element.substring(
//               index + currRange.end - currRange.start + 1,
//               ranges[1]
//                 ? ranges[1].start - stringCount
//                 : stringCount + element.length
//             )}
//           </React.Fragment>
//         );
//         console.log(searchedString);
//         ranges.splice(0, 1);
//         prev = ranges[0] ? ranges[0].start : 0;
//       }
//       returnVal.push(searchedString);
//     }
//     stringCount += element.length;
//     return [
//       <>{returnVal.length > 0 ? returnVal.map((e) => e) : element}</>,
//       stringCount,
//       ranges,
//     ];
//   }

//   if (React.isValidElement(element)) {
//     const children = React.Children.map(element.props.children, (child) => {
//       let returnVal = highlightStringInReactElement(
//         child,
//         searchString,
//         stringCount,
//         ranges
//       );
//       stringCount = returnVal[1];
//       ranges = returnVal[2];
//       return returnVal[0];
//     });
//     return [React.cloneElement(element, null, children), stringCount, ranges];
//   }

//   return [element, stringCount, ranges];
// };

// type Proptype = {
//   children: React.ReactNode,
//   searchString: string
// }

// // Example usage
// const NestedElementWithHighlight = ({ children, searchString } : Proptype): React.ReactNode => {
//   const nestedElement = children;
//   const stringCount = 0;
//   console.log("hello");
//   if (searchString == "") return nestedElement;
//   const textContent = reactElementToString(nestedElement);
//   const ranges = getSearchStringRanges(textContent, searchString);
//   console.log(...ranges);
//   return ranges.length == 0 ? (
//     nestedElement
//   ) : (
//     <div>
//       {
//         (highlightStringInReactElement(
//           nestedElement,
//           searchString,
//           stringCount,
//           ranges
//         )[0])
//       }
//     </div>
//   );
// };

// // Usage example:
// const App = () => {
//   const [searchString, setSearchString] = React.useState("");
//   return (
//     <div>
//       <input
//         type="text"
//         onChange={(e) => setSearchString(e.target.value)}
//         value={searchString}
//       />
//       <NestedElementWithHighlight searchString={searchString}>
//         <div>
//           <p>
//             Hi <b>React</b>, this is a nested <b>React </b> element with a{" "}
//             <span>highlighted</span> word.
//           </p>
//           <p>
//             React is great for{" "}
//             <span>
//               <b>building</b>
//             </span>{" "}
//             user interfaces!
//           </p>
//           <p>
//             <b>hi</b> <b>react</b>
//           </p>
//         </div>
//       </NestedElementWithHighlight>
//     </div>
//   );
// };

// export default App;
