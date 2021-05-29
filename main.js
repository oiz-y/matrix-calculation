let globalText = '';

const selectRowSize = document.querySelector('select.selectRowSize');
const selectColSize = document.querySelector('select.selectColSize');
const clearButton = document.getElementById('clear');
clearButton.addEventListener('click', () => {
  document.getElementById('calcArea').innerHTML = '';
  globalText = '';
})

selectEventHandler(selectRowSize);
selectEventHandler(selectColSize);

const row = document.getElementById('row');
const col = document.getElementById('col');
const buttonMatrixSize = document.getElementById('clickSize');
setMatrixSize(buttonMatrixSize, row, col);

const matrixSum = document.getElementById('matrixSum');
const matrixCalc = document.getElementById('matrixCalc');
matrixSum.addEventListener('click', () => {
  globalText += ' $+$ ';
  const calcArea = document.getElementById('calcArea');
  calcArea.innerHTML = globalText;
  MathJax.Hub.Typeset(calcArea);
});

matrixCalc.addEventListener('click', addition);

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

function addition() {
  const calcArea = document.getElementById('calcArea');
  const arrayAll = transformTextToTwoArray();
  let result = getZiroMatrix(arrayAll.length, arrayAll[0].length);

  for (let i = 0; i < arrayAll.length; i++) {
    for (let j = 0; j < arrayAll[i].length; j++) {
      for (let k = 0; k < arrayAll[i][j].length; k++){
        result[j][k] = Number(result[j][k]) + Number(arrayAll[i][j][k]);
      }
    }
  }
  resultText = transformArrayToText(result)
  globalText += giveMathjaxCharacter(resultText);
  calcArea.innerHTML = globalText;
  MathJax.Hub.Typeset(calcArea);
}

function transformTextToTwoArray () {
  let array = globalText.split('+');
  let arrayAll = [];
  for (let i = 0; i < array.length; i++) {
    let arrayTmp = [];
    const rowMat =
      globalText.split('+')[i].replace(/[^\d^&^\\]/g, '').split('\\\\');
    for (let j = 0; j < rowMat.length - 1; j++) {
      if (rowMat[j] !== '') {
        arrayTmp.push(rowMat[j].split('&'));
      }
    }
    arrayAll.push(arrayTmp);
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

function getZiroMatrix(rowLength, colLength) {
  const array = []
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
