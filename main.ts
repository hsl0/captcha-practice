const answer = document.getElementById('answer') as HTMLPreElement;
const input = document.getElementById('input') as HTMLInputElement;
const main = document.getElementsByTagName('main')[0];
const form = document.querySelector('main form') as HTMLFormElement;
let last: string = '';
let backspace = false;

// 출처: https://developer.mozilla.org/ko/docs/Web/JavaScript/Reference/Global_Objects/Math/random#%EC%B5%9C%EB%8C%93%EA%B0%92%EC%9D%84_%ED%8F%AC%ED%95%A8%ED%95%98%EB%8A%94_%EC%A0%95%EC%88%98_%EB%82%9C%EC%88%98_%EC%83%9D%EC%84%B1%ED%95%98%EA%B8%B0
function getRandomNumber(max: number): number;
function getRandomNumber(min: number, max: number): number;
function getRandomNumber(min: number, max?: number): number {
    if (!max) {
        max = min;
        min = 0;
    }
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function getRandomChar() {
    return getRandomNumber(35).toString(36).toUpperCase();
}

function getRandomString(length: number = 1): string {
    let str = '';

    while (str.length < length) {
        str += getRandomChar();
    }

    return str;
}

function changeAnswer() {
    answer.innerText = getRandomString(6);
    input.value = '';
    main.classList.remove('wrong');
}

changeAnswer();

input.addEventListener('keydown', (event) => {
    if (event.key === 'Backspace') backspace = true;
});
input.addEventListener('keyup', (event) => {
    if (event.key === 'Backspace') backspace = false;
});
input.addEventListener('input', (event) => {
    const target = event.currentTarget as HTMLInputElement;
    let start = target.selectionStart || 0;
    if ((event as InputEvent).inputType.match(/delete/) && !backspace) {
        target.value = last;
        start++;
    }
    if (target.value.search(/[^0-9A-z]/) >= 0) start--;
    target.value = target.value.replace(/[^0-9A-z]/g, '');
    target.value = target.value.toUpperCase();
    last = target.value;
    target.setSelectionRange(start, start);
});
form.addEventListener(
    'submit',
    (event) => {
        event.preventDefault();
        if (answer.innerText === input.value.toUpperCase()) changeAnswer();
        else main.classList.add('wrong');
        input.focus();
    },
    true
);
form.addEventListener('reset', (event) => {
    changeAnswer();
    input.focus();
});
