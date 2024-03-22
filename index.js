const numBtns = document.querySelectorAll(".calculator__nums");
const opBtns = document.querySelectorAll(".calculator__op");
const deleteBtn = document.querySelector(".calculator__del");
const resetBtn = document.querySelector(".calculator__reset");
const equalsBtn = document.querySelector(".calculator__equals");
const currentOperandElement = document.querySelector(
  ".output__current-operand"
);
const previousOperandElement = document.querySelector(
  ".output__previous-operand"
);

const themes = document.querySelectorAll('[name="theme"]');

let currentOperand = "";
let previousOperand = "";
let operation;

function reset() {
  currentOperand = "";
  previousOperand = "";
  operation = undefined;
}

function deleteNum() {
  currentOperand = currentOperand.toString().slice(0, -1);
}

function appendNumber(num) {
  if (num == "." && currentOperand.toString().includes(".")) return;
  currentOperand = currentOperand.toString() + num.toString();
}

function chooseOperation(op) {
  if (currentOperand == "") return;
  if (previousOperand != "") {
    compute();
  }
  if (op == "x") op = "*";
  operation = op;
  previousOperand = currentOperand;
  currentOperand = "";
}

function compute() {
  let result;

  const prev = parseFloat(previousOperand);
  const curr = parseFloat(currentOperand);

  if (isNaN(prev) || isNaN(curr)) return;

  switch (operation) {
    case "+":
      result = prev + curr;
      break;
    case "-":
      result = prev - curr;
      break;
    case "*":
      result = prev * curr;
      break;
    case "/":
      result = prev / curr;
      break;
    default:
      return;
  }

  if (result % 1 !== 0 && result.toString().split(".")[1].length > 2) {
    currentOperand = result.toFixed(2);
  } else {
    currentOperand = result;
  }

  operation = undefined;
  previousOperand = "";
}

function getDisplayNum(num) {
  const stringNum = num.toString();
  const integerDigits = parseFloat(stringNum.split(".")[0]);
  const decimalDigits = stringNum.split(".")[1];
  let integerDisplay;

  if (isNaN(integerDigits)) {
    integerDisplay = "";
  } else {
    integerDisplay = integerDigits.toLocaleString("en");
  }

  if (decimalDigits != null) {
    return `${integerDisplay}.${decimalDigits}`;
  } else {
    return integerDisplay;
  }
}

function updateDisplay() {
  currentOperandElement.textContent = getDisplayNum(currentOperand);
  if (operation != null) {
    previousOperandElement.textContent = `${getDisplayNum(
      previousOperand
    )} ${operation}`;
  } else {
    previousOperandElement.textContent = "";
  }
}

numBtns.forEach((numBtn) => {
  numBtn.addEventListener("click", () => {
    appendNumber(numBtn.textContent);
    updateDisplay();
  });
});

opBtns.forEach((opBtn) => {
  opBtn.addEventListener("click", () => {
    chooseOperation(opBtn.textContent);
    updateDisplay();
  });
});

equalsBtn.addEventListener("click", () => {
  compute();
  updateDisplay();
});

resetBtn.addEventListener("click", () => {
  reset();
  updateDisplay();
});

deleteBtn.addEventListener("click", () => {
  deleteNum();
  updateDisplay();
});

window.addEventListener("keydown", (event) => {
  if (isFinite(event.key) || event.key == ".") {
    appendNumber(event.key);
  }

  if (
    event.key == "+" ||
    event.key == "-" ||
    event.key == "*" ||
    event.key == "/"
  ) {
    chooseOperation(event.key);
  }

  if (event.key == "Enter") {
    compute();
  }

  if (event.key == "Backspace") {
    deleteNum();
  }

  updateDisplay();
});

function retrieveTheme() {
  let set = false;
  themes.forEach((theme) => {
    if (theme.id == localStorage.getItem("theme")) {
      set = true;
      setTheme(theme);
    }
  });

  if (!set) {
    if (window.matchMedia("(prefers-color-scheme: light)").matches) {
      setTheme(themes[1]);
    } else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
      setTheme(themes[2]);
    } else {
      setTheme(themes[0]);
    }
  }
}

function setTheme(theme) {
  theme.checked = true;
  document.documentElement.className = theme.id;
  localStorage.setItem("theme", theme.id);
}

themes.forEach((theme) => {
  theme.addEventListener("click", () => {
    setTheme(theme);
  });
});

window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', event => {
  event.matches ? setTheme(themes[2]) : setTheme(themes[1]);
});

document.onload = retrieveTheme();
