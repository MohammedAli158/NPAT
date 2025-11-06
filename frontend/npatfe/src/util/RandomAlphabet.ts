const alphabets = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

export function getRandomAlphabet():string {
  const index = Math.floor(Math.random() * alphabets.length);
  const randomAlphabet = alphabets[index];
  alphabets.splice(index, 1); // remove used letter
  return randomAlphabet;
}
