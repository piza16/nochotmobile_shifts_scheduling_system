export const checkWeeklyConstraintArrHasZeroOrOne = (arr) => {
  if (arr.length !== 7) {
    return false;
  }

  for (let subArr of arr) {
    if (!Array.isArray(subArr) || subArr.length !== 3) {
      return false;
    }

    for (let num of subArr) {
      if (num !== 0 && num !== 1) {
        return false;
      }
    }
  }

  return true;
};
