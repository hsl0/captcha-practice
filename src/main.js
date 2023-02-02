"use strict";
(() => {
    const answer = document.getElementById('answer');
    const input = document.getElementById('input');
    const main = document.getElementsByTagName('main')[0];
    const form = document.querySelector('main form');
    const stat = document.getElementById('stat');
    const captDone = document.querySelector('#done dd');
    const captSkip = document.querySelector('#skip dd');
    const recentSpent = document.querySelector('.recent.spent dd');
    const first = document.querySelector('#first dd');
    const recentKeys = document.querySelector('.recent.keys dd');
    const recentDel = document.querySelector('.recent.del dd');
    const avgSpent = document.querySelector('.avg.spent dd');
    const avgKeys = document.querySelector('.avg.keys dd');
    const minSpentEl = document.querySelector('.min.spent dd');
    const maxSpentEl = document.querySelector('.max.spent dd');
    const minKeysEl = document.querySelector('.min.keys dd');
    const maxKeysEl = document.querySelector('.max.keys dd');
    const accumDelsEl = document.querySelector('.accum.del dd');
    const maxDelsEl = document.querySelector('.max.del dd');
    const captMistakes = document.querySelector('#mistakes dd');
    const expand = document.getElementById('stat-expand');
    let last = '';
    let backspace = false;
    const beforeStart = Date.now();
    let toStart = null;
    let startTime = null;
    let done = 0;
    let skip = 0;
    let nowDels = 0;
    let accumDels = 0;
    let maxDels = 0;
    let nowKeys = 0;
    let minKeys = null;
    let maxKeys = 0;
    let accumKeys = 0;
    let spents = 0;
    let minSpent = null;
    let maxSpent = 0;
    let mistakes = 0;
    let timeCounts = 0;
    function getRandomNumber(min, max) {
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
    function getRandomString(length = 1) {
        let str = '';
        while (str.length < length) {
            str += getRandomChar();
        }
        return str;
    }
    function changeAnswer() {
        last = '';
        answer.innerText = getRandomString(6);
        input.value = '';
        main.classList.remove('wrong');
        resetStat();
    }
    function countKeys(diff) {
        if (diff < 0)
            nowDels -= diff;
        else if (diff === 0)
            return;
        nowKeys++;
    }
    function updateStat() {
        // 횟수
        captDone.innerText = String(done);
        captSkip.innerText = String(skip);
        if (startTime) {
            timeCounts++;
            // 소요 시간
            const spent = Date.now() - startTime;
            spents += spent;
            minSpent = minSpent ? Math.min(minSpent, spent) : spent;
            maxSpent = Math.max(maxSpent, spent);
            recentSpent.innerText = String(spent);
            avgSpent.innerText = (spents / timeCounts).toFixed();
            minSpentEl.innerText = String(minSpent);
            maxSpentEl.innerText = String(maxSpent);
            if (!toStart) {
                // 시작 시간
                toStart = startTime - beforeStart;
                first.innerText = String(toStart);
            }
            // 타수
            const keys = (nowKeys * 60000) /* 60 * 1000 */ / spent;
            accumKeys += keys;
            minKeys = minKeys ? Math.min(minKeys, keys) : keys;
            maxKeys = Math.max(maxKeys, keys);
            recentKeys.innerText = keys.toFixed();
            avgKeys.innerText = (accumKeys / timeCounts).toFixed();
            minKeysEl.innerText = minKeys.toFixed();
            maxKeysEl.innerText = maxKeys.toFixed();
        }
        // 정정
        if (nowDels)
            mistakes++;
        accumDels += nowDels;
        maxDels = Math.max(maxDels, nowDels);
        recentDel.innerText = String(nowDels);
        captMistakes.innerText = String(mistakes);
        accumDelsEl.innerText = String(accumDels);
        maxDelsEl.innerText = String(maxDels);
    }
    function resetStat() {
        nowDels = 0;
        nowKeys = 0;
        startTime = null;
    }
    changeAnswer();
    input.addEventListener('keydown', (event) => {
        if (event.key === 'Backspace')
            backspace = true;
    });
    input.addEventListener('keyup', (event) => {
        if (event.key === 'Backspace')
            backspace = false;
    });
    input.addEventListener('input', (event) => {
        const target = event.currentTarget;
        startTime !== null && startTime !== void 0 ? startTime : (startTime = Date.now());
        let start = target.selectionStart || 0;
        if (event.inputType.match(/delete/) && !backspace) {
            target.value = last;
            start++;
        }
        if (target.value.search(/[^0-9A-z]/) >= 0)
            start--;
        target.value = target.value.replace(/[^0-9A-z]/g, '');
        target.value = target.value.toUpperCase();
        countKeys(target.value.length - last.length);
        last = target.value;
        target.setSelectionRange(start, start);
    });
    form.addEventListener('submit', (event) => {
        event.preventDefault();
        if (answer.innerText === input.value.toUpperCase()) {
            done++;
            updateStat();
            changeAnswer();
        }
        else
            main.classList.add('wrong');
        input.focus();
    }, true);
    form.addEventListener('reset', (event) => {
        skip++;
        updateStat();
        changeAnswer();
        input.focus();
    });
    expand.addEventListener('click', (event) => {
        if (stat.classList.contains('expanded')) {
            stat.classList.replace('expanded', 'collapsed');
            expand.innerText = '자세히';
        }
        else {
            stat.classList.replace('collapsed', 'expanded');
            expand.innerText = '간략히';
        }
    });
})();
