const fakeParseJSON = (str) => {
  let i = 0;

  return parseValue();
  /** 
  naming convention:
    We call parseSomething, when we parse the code based on grammar and use the return value
    We call eatSomething, when we expect the character(s) to be there, but we are not using the character(s)
    We call skipSomething, when we are okay if the character(s) is not there.
*/
  function eatComma() {
    if (str[i] !== ",") {
      throw new Error('Expected "," ');
    }
    i++;
  }
  function eatColon() {
    if (str[i] !== ":") {
      throw new Error('Expected ":" ');
    }
    i++;
  }

  function skipWhitespace() {
    while (
      str[i] === " " ||
      str[i] === "\n" ||
      str[i] === "\t" ||
      str[i] === "\r"
    ) {
      i++;
    }
  }

  function parseString() {
    if (str[i] === '"') {
      i++;
      let result = "";
      while (str[i] !== '"') {
        if (str[i] === "\\") {
          const char = str[i + 1];
          if (
            char === '"' ||
            char === "\\" ||
            char === "/" ||
            char === "b" ||
            char === "f" ||
            char === "n" ||
            char === "r" ||
            char === "t"
          ) {
            result += char;
            i++;
          } else if (char === "u") {
            if (
              isHexadecimal(str[i + 2]) &&
              isHexadecimal(str[i + 3]) &&
              isHexadecimal(str[i + 4]) &&
              isHexadecimal(str[i + 5])
            ) {
              result += String.fromCharCode(
                parseInt(str.slice(i + 2, i + 6), 16)
              );
              i += 5;
            }
          }
        } else {
          result += str[i];
        }
        i++;
      }
      i++;
      return result;
    }
  }

  function isHexadecimal(char) {
    return (
      (char >= "0" && char <= "9") ||
      (char.toLowerCase() >= "a" && char.toLowerCase() <= "f")
    );
  }

  function parseArray() {
    if (str[i] == "[") {
      i++;

      let result = [];
      let initial = true;
      while (str[i] !== "]") {
        if (!initial) {
          eatComma();
        }
        const value = parseValue();
        result.push(value);
      }
      // move to the next character of ']'
      i++;
      return result;
    }
  }

  function parseNumber() {
    let start = i;
    if (str[i] === "-") {
      i++;
    }
    if (str[i] === "0") {
      i++;
    } else if (str[i] >= "1" && str[i] <= "9") {
      i++;
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }

    if (str[i] === ".") {
      i++;
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }
    if (str[i] === "e" || str[i] === "E") {
      i++;
      if (str[i] === "-" || str[i] === "+") {
        i++;
      }
      while (str[i] >= "0" && str[i] <= "9") {
        i++;
      }
    }
    if (i > start) {
      return Number(str.slice(start, i));
    }
  }

  function parseValue() {
    skipWhitespace();

    const value =
      parseString() ??
      parseNumber() ??
      parseObject() ??
      parseArray() ??
      parseKeyword("true", true) ??
      parseKeyword("false", false) ??
      parseKeyword("null", null);

    skipWhitespace();
    return value;
  }

  function parseKeyword(name, value) {
    if (String(str).slice(i, i + name.length) === value) {
      i += name.length;
      return value;
    }
  }
  function parseObject() {
    if (str[i] == "{") {
      i++;
      skipWhitespace();

      let result = {};

      let initial = true;

      // if it is not '}',
      // we take the path of string -> whitespace -> ':' -> value -> ...s
      while (str[i] !== "}") {
        if (!initial) {
          eatComma();
          skipWhitespace();
        }

        skipWhitespace();
        const key = parseString();

        skipWhitespace();
        eatColon();
        const value = parseValue();
        result[key] = value;
        initial = false;
      }

      // move to the next character of '}'
      i++;

      return result;
    }
  }
};

const jsonStr1 =
  '{ "data": { "fish": "cake", "array": [1,2,3], "children": [ { "something": "else" }, { "candy": "cane" }, { "sponge": "bob" } ] } } ';
const jsonStr2 = '{ "hello" : "world"}';
const jsonObject = fakeParseJSON(jsonStr1);

console.log(jsonObject);
