export default function genrateRandomCode(n) {
  let code = "";
  for (let i = 0; i < n; i++) {
    let randomNum = Math.floor(Math.random() * 9);
    code += randomNum;
  }
  return code;
}
