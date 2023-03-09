const inputNumber = Array.from(document.querySelectorAll(".number"));
const multiply = document.querySelector(".multiply");
const division = document.querySelector(".divide");
const dot = document.querySelector(".dot");
const plus = document.querySelector(".plus");
const minus = document.querySelector(".minus");
const reset = document.querySelector(".reset");
const equal = document.querySelector(".equal");
const question = document.querySelector(".question");
const resultDisplay = document.querySelector(".result-display");
const display = document.querySelector(".display");
const del = document.querySelector(".backspace");
let input;
let keyPressed;
let result;
// console.log(inputNumber);
let specialKey = Array.from(document.querySelectorAll(`.key`));
let btnClick = [1, 2, 3, 4, 5, 6, 7, 8, 9, 0];
let totalText;
let calculationResult;
let answerAfterResult;
let key = ["*", "+", "-", "/"];

// function to clear display
function clearDisplay() {
    question.innerText = ``;
    resultDisplay.innerText = ``;
    keyPressed = false;
    question.classList.remove("input-display");
}

function afterResult() {
    resultDisplay.classList.add("hidden");
    question.classList.remove("input-display");
    // question.innerText = `${result}`;
}

function pressEqual() {
    // result = (question.innerText);
    // console.log(result);
    result = Function("return " + `${question.innerText}`)();
    resultDisplay.innerText = result;
    // console.log(result);
    question.classList.add("input-display");
    resultDisplay.classList.remove("hidden");
}
// click event on reset
reset.addEventListener("click", clearDisplay);

// finding key pressed

// for the click on no
for (let i = inputNumber.length - 1; i >= 0; i--) {
    //   console.log(inputNumber[i]);
    //   console.log(i);
    inputNumber[i].addEventListener(`click`, function() {
        question.innerText += `${inputNumber[i].innerText}`;
        calculationResult += Number(inputNumber[i]);
        afterResult();
        // afterResult();
        // console.log(calculationResult);
    });
    document.addEventListener("keydown", (e) => {
        if (e.key == btnClick[i]) {
            question.innerText += `${e.key}`;
            afterResult();
        }
    });
}
dot.addEventListener("click", function() {
    question.innerText += `.`;
});
document.addEventListener("keydown", (e) => {
    if (e.key === `.`) {
        question.innerText += e.key;
        afterResult();
    }
});
for (let j = 0; j < specialKey.length; j++) {
    specialKey[j].addEventListener(`click`, () => {
        question.innerText += `${specialKey[j].innerText}`;
        afterResult();
    });
    document.addEventListener("keydown", (e) => {
        if (e.key === key[j]) {
            question.innerText += `${e.key}`;
            afterResult();
        }
    });
}
// For deleting last text
function removeText() {
    totalText = question.innerText;
    let delText = totalText.substring(totalText.length - 1, 0);
    question.innerText = delText;
}
del.addEventListener("click", function() {
    removeText();
    afterResult();
});
document.addEventListener("keydown", (e) => {
    if (e.key === `Backspace`) {
        removeText();
        afterResult();
    }
    if (e.key === `=` || e.key === `Enter`) {
        pressEqual();
        // afterResult();
    }
});
equal.addEventListener("click", function() {
    pressEqual();
});