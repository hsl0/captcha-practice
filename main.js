!(function () {
    'use strict';
    const n = document.getElementById('answer'),
        t = document.getElementById('input'),
        o = document.getElementsByTagName('main')[0],
        u = document.querySelector('main form');
    function r() {
        return ((n = 35),
        t || ((t = n), (n = 0)),
        (n = Math.ceil(n)),
        (t = Math.floor(t)),
        Math.floor(Math.random() * (t - n + 1)) + n)
            .toString(36)
            .toUpperCase();
        var n, t;
    }
    function c() {
        (n.innerText = (function (n = 1) {
            let t = '';
            for (; t.length < n; ) t += r();
            return t;
        })(6)),
            (t.value = ''),
            o.classList.remove('wrong');
    }
    c(),
        t.addEventListener('input', (n) => {
            const t = n.currentTarget;
            t.value[t.value.length - 1].match(/[0-9a-z]/i) ||
                (t.value = t.value.slice(0, -1)),
                (t.value = t.value.toUpperCase());
        }),
        u.addEventListener(
            'submit',
            (u) => {
                u.preventDefault(),
                    n.innerText === t.value.toUpperCase()
                        ? c()
                        : o.classList.add('wrong'),
                    t.focus();
            },
            !0
        ),
        u.addEventListener('reset', (n) => {
            c(), t.focus();
        });
})();
