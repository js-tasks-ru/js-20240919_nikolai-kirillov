export default class ColumnChart {
    chartHeight = 50;

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
        this.element = this.createEl();
    }

    createEl() {
        const element = document.createElement('div');
        (!!this.data && !!this.data.length) ? '' : element.classList.add('column-chart_loading');
        element.innerHTML = this.createTemplate();
        return element;
    }

    createTemplate() {
        return `
          <div class="column-chart" style="--chart-height: ${this.chartHeight}">
      <div class="column-chart__title">
        Total ${this.label}
        ${this.addLink()}
      </div>
      <div class="column-chart__container">
        <div data-element="header" class="column-chart__header">${this.formatHeading(this.value)}</div>
        <div data-element="body" class="column-chart__chart">
        ${this.createCharts()}
        </div>
      </div>
    </div>
        `
    }

    addLink() {
        if (!!this.link) return `<a href='${this.link}' class="column-chart__link">View all</a>`
        return ''
    }

    createCharts() {
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
        this.element.innerHTML = this.createTemplate();
    }

    remove(el = this.element) {
        el.remove();
    }

    destroy() {
        this.remove();
    }
}
