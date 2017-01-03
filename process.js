/**
 * This file converts ./letter.data dataset
 * into an object with the following structure:
 * {
 *   id: // unique id++
 *   data: // ocr data sample
 *   letter: // binary array from ascii code
 * }
 * letter.data source:
 * http://ai.stanford.edu/~btaskar/ocr/
 */
const fs = require("fs");

const DATA_SIZE = 0x80;
const SPLIT_KEY = String.fromCharCode(0x7c);

module.exports = (() => {

  let src = fs.readFileSync("./letter.data", "utf8");

  let intToBits = (n) => {
    let out = [];
    while(n >= 1) {
      out.unshift(n % 2 | 0);
      n = n / 2;
    }
    return (out);
  };

  let parse = (str) => {

    let idx = 0;

    let data = [];
    let row = "";
    let ch = null;
    let cc = 0;
    while (true) {
      ch = str[idx++];
      if (ch === void 0) break;
      cc = ch.charCodeAt(0);
      if (cc === 0x9) { // whitespace
        row += SPLIT_KEY;
        continue;
      }
      if (cc === 0xa || cc === 0xd) { // new line
        let field = parseField(row);
        data.push(field);
        row = "";
      } else {
        row += ch;
      }
    };

    return (data);

  };

  let parseField = (str) => {
    let idx = 0;
    let byte = 0;
    let array = str.split(SPLIT_KEY);
    let obj = {
      id: 0,
      data: [],
      letter: null
    };
    while (idx < array.length) {
      switch (idx) {
        // id
        case 0:
          obj.id = array[idx] | 0;
        break;
        // letter
        case 1:
          obj.letter = intToBits(array[idx].charCodeAt(0) & 255);
        break;
        // ignore
        case 2:
        case 3:
        case 4:
        case 5:
        case 6:
        break;
        // data
        default:
          byte = array[idx] & 1;
          // validate byte size
          if (byte > 1 || byte < 0) {
            throw new Error(`Line:${obj.id} => Invalid data key '${byte}'`);
          }
          obj.data.push(byte);
        break;
      };
      idx++;
    };
    // validate data size
    if (obj.data.length !== DATA_SIZE) {
      throw new Error(`Line:${obj.id} => Expected '${DATA_SIZE}' bytes but got '${obj.data.length}' bytes`);
    }
    return (obj);
  }

  let result = parse(src);

  console.log(`Successfully generated ${result.length} fields á ${DATA_SIZE} bytes`);

  return (result);

})();