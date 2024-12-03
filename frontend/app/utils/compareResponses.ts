type Difference = {
  path: string[];
  left: any;
  right: any;
  type: 'missing' | 'added' | 'changed';
};

export function compareResponses(left: any, right: any): Difference[] {
  const differences: Difference[] = [];

  function compare(leftObj: any, rightObj: any, path: string[] = []) {
    if (leftObj === rightObj) return;

    // Handle null/undefined cases
    if (!leftObj || !rightObj) {
      differences.push({
        path,
        left: leftObj,
        right: rightObj,
        type: !leftObj ? 'added' : 'missing',
      });
      return;
    }

    // Handle different types
    if (typeof leftObj !== typeof rightObj) {
      differences.push({
        path,
        left: leftObj,
        right: rightObj,
        type: 'changed',
      });
      return;
    }

    // Handle arrays
    if (Array.isArray(leftObj) && Array.isArray(rightObj)) {
      const maxLength = Math.max(leftObj.length, rightObj.length);
      for (let i = 0; i < maxLength; i++) {
        if (i >= leftObj.length) {
          differences.push({
            path: [...path, i.toString()],
            left: undefined,
            right: rightObj[i],
            type: 'added',
          });
        } else if (i >= rightObj.length) {
          differences.push({
            path: [...path, i.toString()],
            left: leftObj[i],
            right: undefined,
            type: 'missing',
          });
        } else {
          compare(leftObj[i], rightObj[i], [...path, i.toString()]);
        }
      }
      return;
    }

    // Handle objects
    if (typeof leftObj === 'object' && typeof rightObj === 'object') {
      const allKeys = new Set([...Object.keys(leftObj), ...Object.keys(rightObj)]);
      
      for (const key of allKeys) {
        if (!(key in leftObj)) {
          differences.push({
            path: [...path, key],
            left: undefined,
            right: rightObj[key],
            type: 'added',
          });
        } else if (!(key in rightObj)) {
          differences.push({
            path: [...path, key],
            left: leftObj[key],
            right: undefined,
            type: 'missing',
          });
        } else {
          compare(leftObj[key], rightObj[key], [...path, key]);
        }
      }
      return;
    }

    // Handle primitive values
    if (leftObj !== rightObj) {
      differences.push({
        path,
        left: leftObj,
        right: rightObj,
        type: 'changed',
      });
    }
  }

  compare(left, right);
  return differences;
}
