export default class SortableTable {
  arrowElement = ``;
  headers = [];

  constructor(headerConfig = [], data = []) {
    this.headerConfig = headerConfig;
    this.data = data;
    this.createHeaders();
    this.createArrowElement();
    this.element = this.createTableElement();
    this.subElements = {
      header: this.element.querySelector('[data-element="header"]'),
      body: this.element.querySelector('[data-element="body"]'),
    };
  }

  createHeaders() {
    const headersFromConfig = [];
    for (const header of this.headerConfig) {
      headersFromConfig.push(header.id);
    }
    this.headers = headersFromConfig;
  }

  createArrowElement() {
    const arrow = document.createElement('div');
    arrow.innerHTML = `
<span data-element="arrow" class="sortable-table__sort-arrow">
  <span class="sort-arrow"></span>
</span>`;
    this.arrowElement = arrow;
  }

  createTableElement() {
    const element = document.createElement('div');
    element.innerHTML = this.createElementTemplate();
    return element.firstElementChild;
  }

  createElementTemplate() {
    return `
<div data-element="productsContainer" class="products-list__container">
  <div class="sortable-table">
    <div data-element="header" class="sortable-table__header sortable-table__row">
      ${this.createHeaderTemplate()}
    </div>
    <div data-element="body" class="sortable-table__body">
      ${this.createTableTemplate()}
    </div>
  </div>
</div>`;
  }

  createHeaderTemplate() {
    let headerTemplate = ``;
    this.headerConfig.forEach(header => {
      headerTemplate += `
<div class="sortable-table__cell" data-id="${header.id}" data-sortable="${header.sortable}">
  <span>${header.title}</span>
</div>`;
    });
    return headerTemplate;
  }

  createTableTemplate() {
    let tableTemplate = ``;
    this.data.forEach(cell => {
      tableTemplate += `
<a href="/products/3d-ochki-optoma-zf2300" class="sortable-table__row">
  ${this.createTableByHeaders(cell)}
</a>
    `;
    });
    return tableTemplate
  }

  createTableByHeaders(cell) {
    let cellTemplate = ``;
    for (const header of this.headers) {
      header === 'images'
        ? cellTemplate += `<div class="sortable-table__cell"> <img class="sortable-table-image" alt="Image" src="${cell.images[0].url}"></div>`
        : cellTemplate += `<div class="sortable-table__cell">${cell[header]}</div>`;

    }
    return cellTemplate;
  }

  sort(fieldValue, orderValue) {
    this.data = this.sortValues(this.data, orderValue, fieldValue);
    this.subElements.body.innerHTML = this.createTableTemplate();
    const headerElement = this.subElements.header.querySelector(`[data-id=${fieldValue}]`);
    headerElement.setAttribute('data-order', orderValue);
    headerElement.appendChild(this.arrowElement);
  }

  sortValues(data, param = "asc", value) {
    const field = this.headerConfig.find(el => el.id === value);
    if (!field.sortable) return
    if (field.sortType === 'string') {
      const locales = ["ru", "en"];
      const options = { sensitivity: "variant", caseFirst: "upper", numeric: true };
      const collator = new Intl.Collator(locales, options);
      const ascended = (a, b) => collator.compare(a[value], b[value]);
      const descended = (a, b) => collator.compare(b[value], a[value]);
      return param === "desc" ? data.sort(descended) : data.sort(ascended);
    } else {
      const ascended = (a, b) => (a[value] - b[value]);
      const descended = (a, b) => (b[value] - a[value]);
      return param === "desc" ? data.sort(descended) : data.sort(ascended);
    }
  }

  remove() {
    this.element.remove()
  }

  destroy() {
    this.remove();
  }
}

