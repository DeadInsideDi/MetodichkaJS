'use client';

class Calculator {
  grabLastElement(array: Array<any>) {
    const lastElement = array[array.length-1] // взяли последний элемент
    array.length-- // сделали массив на 1 меньше
    return lastElement
  }

  extractElements(array: Array<any>,range: Array<number>) {
    let startIndex = range[0] // берём первый элемент от range
    let endIndex = array.length // по умолчанию не ставим границы
    if (range.length === 2) {endIndex = range[1]}

    const newArray = []
    for (let i = startIndex; i < endIndex; i++) {
      newArray[newArray.length] = array[i]
    }
    return newArray
  }

  math(sign: string, number1: any, number2: any) {
    if (sign === '+') { // сложение
      return number1 + number2
    } else if (sign === '-') { // разность
      return number1 - number2
    } else if (sign === '*') { // умножение
      return number1 * number2
    } else if (sign === '/') { // деление
      return number1 / number2
    }
  }

  solve(tokens: Array<any>) {
    let value = 0 // Задаём начальное значения
    let sign = '+'; // начальный знак
    for (let i = 0; i < tokens.length; i++) {
      const token = tokens[i]
      if (typeof token === 'number') {
        value = this.math(sign, value, token)
      } else {
        sign = token
      }
    }
    return value;
  }
  parseToTokens(expression: any) {
    const tokens = [] // массив
    const startBrakets = [] // массив
    const brakets: any = {} // объект

    for (let i = 0; i < expression.length; i++) {
      const char = expression[i]
      if (char > -1) { // проверяем что это число
        let number = char
        i++
        while (i < expression.length && (expression[i] > -1 || expression[i] === '.')) {
          number += expression[i]
          i++
        }

        tokens[tokens.length] = +number
        i--;
      } else {
        if (char === '(') {
          startBrakets[startBrakets.length] = tokens.length
        } else if (char === ')') {
          brakets[this.grabLastElement(startBrakets)] = tokens.length
        }

        tokens[tokens.length] = char
      }
    }
    const result = [tokens, brakets]
    return result;
  }

  rangedCalculation(tokens: Array<any>, brakets: Array<any>, startIndex: number, endIndex: number) {
    // Этап 1 // Убрать скобки
    const noBraketsTokens = []; // массив токенов без скобок

    while (startIndex < endIndex) {
      if (tokens[startIndex] === '(') {
        const value = this.rangedCalculation(tokens, brakets, startIndex + 1, brakets[startIndex]);
        noBraketsTokens[noBraketsTokens.length] = value
        startIndex = brakets[startIndex];
      } else {
        noBraketsTokens[noBraketsTokens.length] = tokens[startIndex]
      }
      startIndex++
    }
    // Этап 2 // Убрать минусы как отдельные токены
    const noMinusTokens = []
    
    for (startIndex = 0; startIndex < noBraketsTokens.length; startIndex++) {
      if (noBraketsTokens[startIndex] === '-') {
        if (startIndex > 0 && typeof noBraketsTokens[startIndex - 1] === 'number') {
          noMinusTokens[noMinusTokens.length] = '-'
        } else {
          const startCount = startIndex;
          startIndex++
          while (noBraketsTokens[startIndex] === '-') {
            startIndex++
          };
          const value = noBraketsTokens[startIndex] * (-1) ** ((startIndex - startCount) % 2)
          noMinusTokens[noMinusTokens.length] = value
        }
      } else {
        noMinusTokens[noMinusTokens.length] = noBraketsTokens[startIndex]
      }
    }
    // Этап 3 // Финальный счёт
    const signIndexes = [-1];

    for (let i = 0; i < noMinusTokens.length; i++) {
      const char = noMinusTokens[i]
      if (char === '+' || char === '-') {
        signIndexes[signIndexes.length] = i
      }
    }

    let value = 0
    let sign = '+';
    
    for (let i = 1; i < signIndexes.length; i++) {
      const beforeIndex = signIndexes[i - 1];
      const afterIndex = signIndexes[i];
      const solvedTokens = this.solve(this.extractElements(noMinusTokens, [beforeIndex + 1, afterIndex]))
      value = this.math(sign, value, solvedTokens);
      sign = noMinusTokens[afterIndex];
    }
    const solvedTokens = this.solve(this.extractElements(noMinusTokens, [this.grabLastElement(signIndexes) + 1]))
    return this.math(sign, value, solvedTokens);
  }

  calc(expression: string|null) {
    if (expression === null) {return}
    let newExpression: string = ''
    for (let i = 0; i < expression.length; i++) {
      if (expression[i] !== ' ') {
        newExpression += expression[i]
      }
    }
    const allTokens = this.parseToTokens(newExpression); // разбор на токены
    const tokens = allTokens[0]
    const brakets = allTokens[1]

    return this.rangedCalculation(tokens,brakets,0, tokens.length);
  }
}

const calculator = new Calculator()

function culc() {
  const req = document.querySelector('input')?.value
  const span = document.querySelector('span')
  if (req && span !== null) {
    span.innerText = String(calculator.calc(req))
  }
}

export default function Home() {
  return (
    <div>
      <input type="text" />
      <button onClick={culc}>culc</button>
      <span></span>
    </div>
    
  );
}

