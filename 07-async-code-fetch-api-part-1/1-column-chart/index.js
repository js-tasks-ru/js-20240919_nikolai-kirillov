import fetchJson from './utils/fetch-json.js';
import ColumnChart from '../../04-oop-basic-intro-to-dom/1-column-chart/index.js';

const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ColumnChartV2 extends ColumnChart {
    constructor(options = {}) {
        super(options)
        this.url = options.url;
    }

    async update(from, to) {
        this.element.className = 'column-chart column-chart_loading';
        let fetchURL = new URL(this.url, BACKEND_URL);
        fetchURL.searchParams.set('from', from);
        fetchURL.searchParams.set('to', to);
        const data = await fetchJson(fetchURL);
        super.update(Object.values(data));
        return data;
    }
}
