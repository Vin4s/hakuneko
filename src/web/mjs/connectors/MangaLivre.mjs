import Leitor from './Leitor.mjs';

export default class MangaLivre extends Leitor {

    constructor() {
        super();
        super.id = 'mangalivre';
        super.label = 'Manga Livre';
        this.tags = [ 'manga', 'webtoon', 'portuguese' ];
        this.url = 'https://mangalivre.blog';
    }

    _key(e, t, i) {
        var o = Math.max(i % 7, 1)
            , a = t.match(/.{1,5}/gi);
        t = (t = a.slice(o).concat(a.slice(0, o)).join("")).split("");
        var s = e.split("").reverse()
            , c = e.split("").sort(function() {
                return Math.random() - .5;
            })
            , u = e.split("").sort(function() {
                return Math.random() - .5;
            });
        return e.split("").reduce(function(e, n, r) {
            return e + u[r] + n + s[r] + t[r] + c[r];
        }, "").match(new RegExp(".{1," + Math.max(i % 11, 1) + "}", "gi")).map(e => {
            return this.r(Math.max(i % 7, 1)) + e;
        }).join("");
    }

    r(e) {
        const r = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (var t = "", n = r.length, i = 0; i < e; i++)
            t += r.charAt(Math.floor(Math.random() * n));
        return t;
    }
}
