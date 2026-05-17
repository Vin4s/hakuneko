import Connector from '../engine/Connector.mjs';
import Manga from '../engine/Manga.mjs';

// Base for MangaLivre
export default class Leitor extends Connector {

    constructor() {
        super();

        super.id = 'leitor';
        super.label = 'Leitor';

        this.tags = [ 'manga', 'webtoon', 'portuguese' ];

        this.url = 'https://mangalivre.blog';
    }

    async _initializeConnector() {
    return;
    }

    async _getMangaFromURI(uri) {

        const request = new Request(uri, this.requestOptions);

        const data = await this.fetchDOM(
            request,
            '.manga-title, h1'
        );

        const id = uri.pathname;

        const title = data[0].textContent.trim();

        return new Manga(this, id, title);
    }

    async _getMangas() {

        let mangaList = [];

        for(let page = 1, run = true; run; page++) {

            const mangas = await this._getMangasFromPage(page);

            mangas.length > 0
                ? mangaList.push(...mangas)
                : run = false;
        }

        return mangaList;
    }

    async _getMangasFromPage(page) {

        const path = page === 1
            ? '/manga/'
            : `/manga/page/${page}/`;

        const uri = new URL(path, this.url);

        const request = new Request(uri, this.requestOptions);

        const data = await this.fetchDOM(
            request,
            '.manga-card-content'
        );

        return data.map(card => {

            const container =
                card.closest('a') ||
                card.querySelector('a');

            const title =
                card.querySelector('.manga-card-title');

            if(!container || !title)
                return null;

            return {
                id: container.href,
                title: title.textContent.trim()
            };

        }).filter(Boolean);
    }

    async _getChapters(manga) {

    const uri = new URL(manga.id, this.url);

    const request = new Request(uri, this.requestOptions);

    const data = await this.fetchDOM(
        request,
        'a[href*="/capitulo/"]'
    );

    return data.map(link => {

        const titleElement =
            link.querySelector('.chapter-number');

        if(!titleElement)
            return null;

        return {
            id: link.href,
            title: titleElement.textContent.trim()
        };

    }).filter(Boolean);
    }

    async _getPages(chapter) {

    const uri = new URL(chapter.id, this.url);

    const request = new Request(uri, this.requestOptions);

    const response = await fetch(request);

    const text = await response.text();

    const parser = new DOMParser();

    const dom = parser.parseFromString(
        text,
        'text/html'
    );

    const images = [
        ...dom.querySelectorAll(
            '.chapter-image-container img.chapter-image'
        )
    ];

    console.log('Images found:', images.length);

    return images
        .map(image => image.getAttribute('src'))
        .filter(Boolean);
    }
}
