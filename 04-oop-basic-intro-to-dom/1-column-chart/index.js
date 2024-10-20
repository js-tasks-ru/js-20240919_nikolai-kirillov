export default class ColumnChart {
    chartHeight = 50;
    subElements = {};

    constructor(options = {}) {
        const {
            formatHeading = (el) => el,
        }
            = options;

        this.options = { ...options };
        this.data = options.data;
        this.label = options.label;
        this.value = options.value;
        this.link = options.link;
        this.formatHeading = formatHeading;
        this.element = this.createElement();
        this.getSubElements();
    }

    getSubElements() {
        this.element.querySelectorAll('[data-element]').forEach(element => {
            this.subElements[element.dataset.element] = element;
        });
    }

    createElement() {
        const element = document.createElement('div');
        element.innerHTML = this.createTemplate();
        return element.firstElementChild;
    }

    createTemplate() {
        return `
          <div class="column-chart ${!this.data ? 'column-chart_loading' : ''}" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.createLinkTemplate()}
      </div>
      <div class="column-chart__container">
        ${this.createHeaderTemplate()}
        <div data-element="body" class="column-chart__chart">
        ${this.createBodyTemplate()}
        </div>
      </div>
    </div>
        `
    }

    createLinkTemplate() {
        if (!!this.link) return `<a href='${this.link}' class="column-chart__link">View all</a>`
        return ''
    }

    createHeaderTemplate() {
        return `<div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>`
    }

    createBodyTemplate() {
        let resultTemplate = ``;
        if (this.data) {
            const chartValues = this.calculateChartValues(this.data);
            for (const [value, percent] of chartValues) {
                resultTemplate += `<div style="--value:${value}" data-tooltip="${percent}%"></div>`
            }
        }
        return resultTemplate;
    }

    calculateChartValues(data) {
        const result = [];
        const maxValue = Math.max(...data);
        const scale = this.chartHeight / maxValue;
        for (const el of data) {
            const value = Math.floor(el * scale);
            const percent = (el / maxValue * 100).toFixed(0);
            result.push([value, percent])
        }
        return result;
    }

    update(newData) {
        this.data = newData;
        this.value = newData.reduce((acc, item) => acc + item, 0);
        this.subElements.header.innerHTML = this.createHeaderTemplate();
        this.subElements.body.innerHTML = this.createBodyTemplate();
        this.element.className = 'column-chart';
    }

    remove() {
        this.element.remove();
    }

    destroy() {
        this.remove();
    }
}
