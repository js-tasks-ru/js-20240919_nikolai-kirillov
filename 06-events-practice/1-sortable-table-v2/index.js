import SortableTable from '../../05-dom-document-loading/2-sortable-table-v1/index.js';

export default class SortableTableV2 extends SortableTable {
  currentSortedHeader;

  constructor(headersConfig, {
    data = [],
    sorted = {},
    isSortLocally = true,
  } = {}) {
    super(headersConfig, data);
    this.currentSortedHeader = sorted.id;
    this.isSortLocally = isSortLocally;
    this.sort(sorted.id, sorted.order);
    this.addListeners();
  }

  addListeners() {
    this.subElements.header.addEventListener('pointerdown', this.handleHeaderPointerdown);
  }

  handleHeaderPointerdown = (event) => {
    const closestHeader = event.target.closest('.sortable-table__cell');
    if (!closestHeader) return;

    const id = closestHeader.dataset.id;
    const isSortable = this.headerConfig.find(el => el.id === id).sortable;
    if (!isSortable) return;

    let order = closestHeader.dataset.order;
    if (this.currentSortedHeader === id) {
      order === 'asc' ? order = 'desc' : order = 'asc';
      this.sort(id, order);
    } else {
      order = 'desc';
      this.currentSortedHeader = id;
      this.sort(id, order);
    }
  }

  destroy() {
    this.removeListeners();
    super.destroy();
  }

  removeListeners() {
    this.subElements.header.removeEventListener('pointerdown', this.handleHeaderPointerdown);
  }
}