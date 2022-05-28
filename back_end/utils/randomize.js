const randomize = (arr) => {
  let randomArr = [];

  let random = Math.floor(Math.random() * arr.length);
  let itemOfArr = 1;
  for (let i = 0; i < arr.length; i++) {
    if (i === random) {
      randomArr[i] = arr[0];
    } else {
      randomArr[i] = arr[itemOfArr];
      itemOfArr++;
    }
  }

  return randomArr;
};

module.exports = randomize;
