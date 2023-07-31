export type MyNode = {
  val: number;
  left?: MyNode;
  right?: MyNode;
};

type ReturnValue = {
  count: number;
  value: number;
  ansFound: boolean;
};

const inorderTraverse = (
  root: MyNode,
  k: number,
  prevVal: ReturnValue
): ReturnValue => {
  let leftVal: ReturnValue = root?.left
    ? inorderTraverse(root.left, k, prevVal)
    : prevVal;
  if (leftVal.ansFound) return leftVal;

  let count: number = leftVal.count + 1;
  if (count === k) {
    return { count: count, ansFound: true, value: root.val };
  }

  let currState = {
    count: count,
    ansFound: false,
    value: -1,
  };

  return root?.right ? inorderTraverse(root.right, k, currState) : currState;
};

/* Using a global variable */

// type ReturnValueGlobalVariableVariant = {
//   value?: number,
//   ansFound: boolean,
// }

// let currCount: number = 0;
// const inorderTraverseGlobalVariableVariant = (root: MyNode, k: number): ReturnValueGlobalVariableVariant => {
//   if(root == null) return {  ansFound: false};
//   let leftVal: ReturnValueGlobalVariableVariant = inorderTraverseGlobalVariableVariant(root.left, k)
//   if(leftVal.ansFound) return leftVal;
//   currCount++
//   if(currCount === k){
//     return {value: root.val, ansFound: true};
//   }

//   return inorderTraverseGlobalVariableVariant(root.right, k)

// }

function getKthSmallestValue(root: MyNode, k: number): number {
  // return inorderTraverseGlobalVariableVariant(root, k).value;
  let ans: ReturnValue = inorderTraverse(root, k, {
    count: 0,
    value: -1,
    ansFound: false,
  });
  return ans.value;
}

export { getKthSmallestValue };
