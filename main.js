let globalText = '';

const selectRowSize = document.querySelector('select.selectRowSize');
const selectColSize = document.querySelector('select.selectColSize');
const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', () => {
  document.getElementById('calcArea').innerHTML = '';
  globalText = '';
  const inputElements = document.querySelectorAll('input');
  for (let i = 0; i < inputElements.length; i++) {
    inputElements[i].value = '';
  }
})

selectEventHandler(selectRowSize);
selectEventHandler(selectColSize);

const row = document.getElementById('row');
const col = document.getElementById('col');
const buttonMatrixSize = document.getElementById('clickSize');
setMatrixSize(buttonMatrixSize, row, col);

const sumButton = document.getElementById('sumButton');
const subtractionButton = document.getElementById('subtractionButton');
const calcButton = document.getElementById('calcButton');
sumButton.addEventListener('click', () => {
  globalText += ' $+$ ';
  const calcArea = document.getElementById('calcArea');
  calcArea.innerHTML = globalText;
  MathJax.Hub.Typeset(calcArea);
});
subtractionButton.addEventListener('click', () => {
  globalText += ' $-$ ';
  const calcArea = document.getElementById('calcArea');
  calcArea.innerHTML = globalText;
  MathJax.Hub.Typeset(calcArea);
});

calcButton.addEventListener('click', calc);

function selectEventHandler(element) {
  element.addEventListener('change', (event) => {
    if (event.target.getAttribute('class') === 'selectRowSize') {
      document.getElementById('row').innerHTML = event.target.value;
    } else {
      document.getElementById('col').innerHTML = event.target.value;
    }
  });
}

function setMatrixSize(element, matRow, matCol) {
  element.addEventListener('click', () => {

    const matrixTable = document.querySelector('div.matrixTable');

    setMatrixTable(matrixTable, matRow, matCol);

    const matrixTableComment = document.querySelector('span.matrixTableComment');
    matrixTableComment.innerHTML = '行列の値';
    const displayButton = setElement(
      matrixTableComment, 'after', 'button',
      {
        id: 'matrixSubmitButton',
        style: 'margin: 10px;'
      }, '決定'
    );
    displayButton.addEventListener('click', displayMatirix)
  });
}

function setMatrixTable(element, matRow, matCol) {
  const matTable =  setElement(
    element, 'appendChild', 'table',
    {
      id: 'table',
      border: '1'
    }, null
  );
  for (let i = 0; i < matRow.innerHTML; i++) {
    const rowElement = setElement(
      matTable, 'appendChild', 'tr', {}, null
    );  
    for (let j = 0; j < matCol.innerHTML; j++) {
      const colElement = setElement(
        rowElement, 'appendChild', 'td', {}, null
      );
      setElement(
        colElement, 'appendChild', 'input',
        {
          type: 'text',
          style: 'height: 20px;'
        }, null
      );
    }
  }
}

function displayMatirix() {
  const table = document.getElementById('table');
  let text = '';
  for (let row of table.rows) {
    for (let cell of row.cells) {
      if (cell.cellIndex === row.cells.length - 1) {
        text += cell.querySelector('input').value;
      } else {
        text += cell.querySelector('input').value + ' & ';
      }
    }
    text += ' \\\\ ';
  }
  text = '\\left(\\begin{array}{c}' + text + '\\end{array}\\right)';
  text = '$' + text + '$';
  if (globalText === '') {
    globalText = text;
  } else {
    globalText += text;
  }
  calcArea.innerHTML = globalText;
  MathJax.Hub.Typeset(calcArea);
}

function calc() {
  if (globalText.split('+').length === 2) {
    addition();
  } else if (globalText.split('-').length === 2) {
    subtraction();
  }
}

function addition() {
  const calcArea = document.getElementById('calcArea');
  const arrayAll = transformTextToTwoArray('+');
  const matrixSize = getSize('+');
  let result = getZeroMatrix(matrixSize.rowLength, matrixSize.colLength);

    for (let j = 0; j < arrayAll[0].length; j++) {
      for (let k = 0; k < matrixSize.colLength; k++) {
        result[j][k] = parseInt(arrayAll[0][j][k], 10) + parseInt(arrayAll[1][j][k], 10);
      }
    }
  resultText = transformArrayToText(result)
  globalText += giveMathjaxCharacter(resultText);
  calcArea.innerHTML = globalText;
  MathJax.Hub.Typeset(calcArea);
}
function subtraction() {
  const calcArea = document.getElementById('calcArea');
  const arrayAll = transformTextToTwoArray('-');
  const matrixSize = getSize('-');
  let result = getZeroMatrix(matrixSize.rowLength, matrixSize.colLength);

    for (let j = 0; j < arrayAll[0].length; j++) {
      for (let k = 0; k < matrixSize.colLength; k++) {
        result[j][k] = parseInt(arrayAll[0][j][k], 10) - parseInt(arrayAll[1][j][k], 10);
      }
    }
  resultText = transformArrayToText(result)
  globalText += giveMathjaxCharacter(resultText);
  calcArea.innerHTML = globalText;
  MathJax.Hub.Typeset(calcArea);
}

function getSize(operator) {
  let matrixSize = {};
  let rowLength = 0;
  let colLength = 0;
  let array = globalText.split(operator);
  splitArray = array[0].replace(/[^\d^&^\\^-]/g, '').split('\\\\');

  for (let i = 0; i < splitArray.length; i++) {
    if (splitArray[i] !== '') {
      rowLength += 1;
    }
  }
  for (let i = 0; i < splitArray.length; i++) {
    if (splitArray[i] !== '') {
      for (let j = 0; j < splitArray[i].split('&').length; j++) {
        colLength += 1;
      }
      break;
    }
  }
  matrixSize.rowLength = rowLength;
  matrixSize.colLength = colLength;
  return matrixSize;
}

function transformTextToTwoArray(operator) {
  let array = globalText.split(operator);
  let arrayAll = [];
  for (let k = 0; k < array.length; k++) {
    tmpArray = [];
    let splitArray = array[k].replace(/[^\d^&^\\]/g, '').split('\\\\');
    for (let i = 0; i < splitArray.length; i++) {
      if (splitArray[i] !== '') {
        tmpArray.push(splitArray[i].split('&'));
      }
    }
    arrayAll.push(tmpArray)
  }
  return arrayAll;
}

function transformArrayToText(array) {
  let text = '';
  for (i = 0; i < array.length; i++) {
    for (j = 0; j < array[i].length; j++) {
      if (j === array[i].length - 1) {
        text += array[i][j];
      } else {
        text += array[i][j] + ' & ';
      }
    }
    text += ' \\\\ ';
  }
  return text
}

function giveMathjaxCharacter(resultText) {
  let text = '\\left(\\begin{array}{c}' + resultText + '\\end{array}\\right)';
  text = '$ =' + text + '$';
  return text;
}

function getZeroMatrix(rowLength, colLength) {
  const array = [];
  for (let i = 0; i < rowLength; i++) {
    array.push([]);
    for (let j = 0; j < colLength; j++){
      array[i].push(0);
    }
  }
  return array;
}

function setElement(dependent, insertMethod, tag, attrObj, text) {
  let dependentElement;
  if (typeof (dependent) === 'string') {
    dependentElement = document.getElementById(dependent);
  } else {
    dependentElement = dependent;
  }
  const createElement = document.createElement(tag);
  keys = Object.keys(attrObj)
  if (keys.length > 0) {
    for (let i = 0; i < keys.length; i++) {
      createElement.setAttribute(keys[i], attrObj[keys[i]])
    }
  }
  if (text !== null) {
    createElement.innerHTML = text;
  }
  if (insertMethod === 'appendChild') {
    dependentElement.appendChild(createElement);
  } else if (insertMethod === 'after') {
    dependentElement.after(createElement);
  } else if (insertMethod === 'before') {
    dependentElement.before(createElement);
  }
  return createElement;
}
