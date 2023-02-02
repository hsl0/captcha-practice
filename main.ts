(() => {
    const answer = document.getElementById('answer') as HTMLPreElement;
    const input = document.getElementById('input') as HTMLInputElement;
    const main = document.getElementsByTagName('main')[0];
    const form = document.querySelector('main form') as HTMLFormElement;
    const stat = document.getElementById('stat') as HTMLTableElement;
    const captDone = document.querySelector('#done dd') as HTMLElement;
    const captSkip = document.querySelector('#skip dd') as HTMLElement;
    const recentSpent = document.querySelector('.recent.spent dd') as HTMLElement;
    const first = document.querySelector('#first dd') as HTMLElement;
    const recentKeys = document.querySelector('.recent.keys dd') as HTMLElement;
    const recentDel = document.querySelector('.recent.del dd') as HTMLElement;
    const avgSpent = document.querySelector('.avg.spent dd') as HTMLElement;
    const avgKeys = document.querySelector('.avg.keys dd') as HTMLElement;
    const minSpentEl = document.querySelector('.min.spent dd') as HTMLElement;
    const maxSpentEl = document.querySelector('.max.spent dd') as HTMLElement;
    const minKeysEl = document.querySelector('.min.keys dd') as HTMLElement;
    const maxKeysEl = document.querySelector('.max.keys dd') as HTMLElement;
    const accumDelsEl = document.querySelector('.accum.del dd') as HTMLElement;
    const maxDelsEl = document.querySelector('.max.del dd') as HTMLElement;
    const captMistakes = document.querySelector('#mistakes dd') as HTMLElement;
    const expand = document.getElementById('stat-expand') as HTMLButtonElement;
    let last: string = '';
    let backspace = false;
    const beforeStart = Date.now();
    let toStart: number | null = null;
    let startTime: number | null = null;
    let done = 0;
    let skip = 0;
    let nowDels = 0;
    let accumDels = 0;
    let maxDels = 0;
    let nowKeys = 0;
    let minKeys: number | null = null;
    let maxKeys = 0;
    let accumKeys = 0;
    let spents = 0;
    let minSpent: number | null = null;
    let maxSpent = 0;
    let mistakes = 0;
    let timeCounts = 0;

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
        last = '';
        answer.innerText = getRandomString(6);
        input.value = '';
        main.classList.remove('wrong');
        resetStat();
    }

    function countKeys(diff: number): void {
        if (diff < 0) nowDels -= diff;
        else if (diff === 0) return;

        nowKeys++;
    }

    function updateStat(): void {
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
            const keys = (nowKeys * 60_000) /* 60 * 1000 */ / spent;
            accumKeys += keys;
            minKeys = minKeys ? Math.min(minKeys, keys) : keys;
            maxKeys = Math.max(maxKeys, keys);
            recentKeys.innerText = keys.toFixed();
            avgKeys.innerText = (accumKeys / timeCounts).toFixed();
            minKeysEl.innerText = minKeys.toFixed();
            maxKeysEl.innerText = maxKeys.toFixed();
        }

        // 정정
        if (nowDels) mistakes++;
        accumDels += nowDels;
        maxDels = Math.max(maxDels, nowDels);
        recentDel.innerText = String(nowDels);
        captMistakes.innerText = String(mistakes);
        accumDelsEl.innerText = String(accumDels);
        maxDelsEl.innerText = String(maxDels);
    }

    function resetStat(): void {
        nowDels = 0;
        nowKeys = 0;
        startTime = null;
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
        startTime ??= Date.now();
        let start = target.selectionStart || 0;
        if ((event as InputEvent).inputType.match(/delete/) && !backspace) {
            target.value = last;
            start++;
        }
        if (target.value.search(/[^0-9A-z]/) >= 0) start--;
        target.value = target.value.replace(/[^0-9A-z]/g, '');
        target.value = target.value.toUpperCase();
        countKeys(target.value.length - last.length);
        last = target.value;
        target.setSelectionRange(start, start);
    });
    form.addEventListener(
        'submit',
        (event) => {
            event.preventDefault();
            if (answer.innerText === input.value.toUpperCase()) {
                done++;
                updateStat();
                changeAnswer();
            } else main.classList.add('wrong');
            input.focus();
        },
        true
    );
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
        } else {
            stat.classList.replace('collapsed', 'expanded');
            expand.innerText = '간략히';
        }
    });
})();
