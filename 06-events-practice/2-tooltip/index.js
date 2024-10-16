class Tooltip {
  static instance;
  element;

  constructor() {
    if (Tooltip.instance) {
      return Tooltip.instance;
    }
    Tooltip.instance = this;
  }

  initialize() {
    document.addEventListener('pointerover', this.handlePointerover);
  }

  handlePointerover = (event) => {
    const closestElement = event.target.closest("div");
    if (!closestElement) return;
    if (!closestElement.dataset.tooltip) return;
    document.addEventListener('pointerout', this.handlePointerout);
    document.addEventListener('pointermove', this.handlePointermove);
    this.render(closestElement.dataset.tooltip);
  }

  render(tooltip) {
    const tooltipElement = document.createElement('div');
    tooltipElement.innerHTML = `<div class="tooltip">${tooltip}</div>`;
    this.element = tooltipElement.firstElementChild;
    document.body.append(tooltipElement);
  }

  handlePointerout = (event) => {
    document.removeEventListener('pointerout', this.handlePointerout);
    document.removeEventListener('pointermove', this.handlePointermove);
    this.remove();
  }

  handlePointermove = (event) => {
    this.element.style.left = event.clientX + 8 + 'px';
    this.element.style.top = event.clientY + 8 + 'px';
  }

  removeListeners() {
    document.removeEventListener('pointerover', this.handlePointerover);
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }

  remove() {
    if (this.element) this.element.parentElement.remove();
  }
}

export default Tooltip;
