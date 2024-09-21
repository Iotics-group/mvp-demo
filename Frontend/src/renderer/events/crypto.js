
module.exports.sessionParse = (hash, key) => {
  const code = hash[hash.length - 1]
  const sliceCode = hash.slice(0, -1);
  if(code == 1) {
      return verifyHash(key, 16)(sliceCode)
    } else if(code == 2) {
      return verifyHash(key, 32)(sliceCode)
  }
}
module.exports.sessionCreate = (id, key) => {
  // const SECRET_KEY = '123456789mnhgdfvdxasfgm'
  const hash = localStorage.getItem('session')
  const code = hash[hash.length - 1]
  const reqcode = (code == 1) ? 2 : 1
  return "" + createHash(key, code == 1 ? 32 : 16)(id) + reqcode
}
const createHash = (key, x) => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const byteHex = n => ("0" + Number(n).toString(x)).substr(-2);
  const applySaltToChar = code => textToChars(key).reduce((a,b) => a ^ b, code);
  return text => text.split('')
  .map(textToChars)
  .map(applySaltToChar)
  .map(byteHex)
  .join('');
}
const verifyHash = (key, x) => {
  const textToChars = text => text.split('').map(c => c.charCodeAt(0));
  const applySaltToChar = code => textToChars(key).reduce((a,b) => a ^ b, code);
  return encoded => encoded.match(/.{1,2}/g)
  .map(hex => parseInt(hex, x))
  .map(applySaltToChar)
  .map(charCode => String.fromCharCode(charCode))
  .join('');
}