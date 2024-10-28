import escapeHtml from './utils/escape-html.js';
import fetchJson from './utils/fetch-json.js';

const IMGUR_CLIENT_ID = '28aaa2e823b03b1';
const BACKEND_URL = 'https://course-js.javascript.ru';

export default class ProductForm {
  element;
  subElements = {};
  productData;

  constructor(productId) {
    this.productId = productId;
  }

  async render() {
    this.categories = await this.collectCategories();
    if (!this.productId) {
      this.element = this.createEmptyElement();
    } else {
      const url = new URL('api/rest/products', BACKEND_URL);
      url.searchParams.set('id', this.productId);
      const response = await fetchJson(url);
      if (response.length != 0) {
        this.productData = response[0];
        this.element = this.createElementByID();
        this.selectActiveOption();
      }
    }
    this.selectSubElements();
    this.createListeners();
    return this.element;
  }

  async collectCategories() {
    try {
      const url = new URL('api/rest/categories', BACKEND_URL);
      url.searchParams.set('_refs', 'subcategory');
      url.searchParams.set('_sort', 'weight');
      return await fetchJson(url);
    } catch (error) {
      console.log(error);
    }
  }

  createEmptyElement() {
    const element = document.createElement('div');
    element.innerHTML = `
<div class="product-form">
    <form data-element="productForm" class="form-grid">
        <div class="form-group form-group__half_left">
            <fieldset>
                <label class="form-label">Название товара</label>
                <input id='title' required="" type="text" name="title" class="form-control"
                    placeholder="Название товара">
            </fieldset>
        </div>
        <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id='description' required="" class="form-control" name="description"
                data-element="productDescription" placeholder="Описание товара"></textarea>
        </div>
        <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
        </div>
        <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" name="subcategory" id="subcategory">
            </select>
        </div>
        <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
                <label class="form-label">Цена ($)</label>
                <input id="price" required="" type="number" name="price" class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
                <label class="form-label">Скидка ($)</label>
                <input id="discount" required="" type="number" name="discount" class="form-control" placeholder="0">
            </fieldset>
        </div>
        <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" required="" type="number" class="form-control" name="quantity" placeholder="1">
        </div>
        <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id='status' class="form-control" name="status">
                <option value="1">Активен</option>
                <option value="0">Неактивен</option>
            </select>
        </div>
        <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
                Сохранить товар
            </button>
        </div>
    </form>
</div>`;
    return element.firstElementChild;
  }

  createElementByID() {
    const element = document.createElement('div');
    element.innerHTML = `
        <div class="product-form">
    <form data-element="productForm" class="form-grid">
        <div class="form-group form-group__half_left">
            <fieldset>
                <label class="form-label">Название товара</label>
                <input id='title' value='${escapeHtml(this.productData?.title)}' required="" type="text" name="title"
                    class="form-control" placeholder="Название товара">
            </fieldset>
        </div>
        <div class="form-group form-group__wide">
            <label class="form-label">Описание</label>
            <textarea id='description' required="" class="form-control" name="description"
                data-element="productDescription"
                placeholder="Описание товара">${escapeHtml(this.productData?.description)}</textarea>
        </div>
        <div class="form-group form-group__wide" data-element="sortable-list-container">
            <label class="form-label">Фото</label>
            <div data-element="imageListContainer">
                <ul class="sortable-list">
                    ${this.createAttachTemplate()}
                </ul>
            </div>
            <button type="button" name="uploadImage" class="button-primary-outline"><span>Загрузить</span></button>
        </div>
        <div class="form-group form-group__half_left">
            <label class="form-label">Категория</label>
            <select class="form-control" name="subcategory" id="subcategory">
                ${this.createSubcategoryTemplate()}
            </select>
        </div>
        <div class="form-group form-group__half_left form-group__two-col">
            <fieldset>
                <label class="form-label">Цена ($)</label>
                <input id="price" value='${escapeHtml(this.productData?.price?.toString())}' required="" type="number" name="price"
                    class="form-control" placeholder="100">
            </fieldset>
            <fieldset>
                <label class="form-label">Скидка ($)</label>
                <input id="discount" value='${escapeHtml(this.productData?.discount?.toString())}' required="" type="number"
                    name="discount" class="form-control" placeholder="0">
            </fieldset>
        </div>
        <div class="form-group form-group__part-half">
            <label class="form-label">Количество</label>
            <input id="quantity" value='${escapeHtml(this.productData?.quantity?.toString())}' required="" type="number"
                class="form-control" name="quantity" placeholder="1">
        </div>
        <div class="form-group form-group__part-half">
            <label class="form-label">Статус</label>
            <select id='status' class="form-control" name="status">
                <option value="1">Активен</option>
                <option value="0">Неактивен</option>
            </select>
        </div>
        <div class="form-buttons">
            <button type="submit" name="save" class="button-primary-outline">
                Сохранить товар
            </button>
        </div>
    </form>
</div>`;
    return element.firstElementChild;
  }

  createAttachTemplate() {
    if (!this.productData.images || this.productData.images.length === 0) return '';
    let attachTemplate = ``;
    for (const attach of this.productData.images) {
      attachTemplate += `<li class="products-edit__imagelist-item sortable-list__item" style="">
    <input type="hidden" name="url" value="${escapeHtml(attach.url)}">
    <input type="hidden" name="source" value="${escapeHtml(attach.source)}">
    <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(attach.url)}">
        <span>${escapeHtml(attach.source)}</span>
    </span>
    <button type="button" class="binButton">
        <img src="icon-trash.svg" data-delete-handle="" alt="delete">
    </button>
</li>`;
    }
    return attachTemplate;
  }

  createSubcategoryTemplate() {
    let categoryTemplate = ``;
    for (const category of this.categories) {
      if (category.subcategories.length) {
        category.subcategories.forEach(subcategory => {
          const isSelected = this.productData.subcategory === subcategory.id ? 'selected' : '';
          categoryTemplate += `<option ${isSelected} value="${escapeHtml(subcategory.id)}">${escapeHtml(category.title)} > ${escapeHtml(subcategory.title)}</option>`;
        });
      } else {
        const isSelected = this.productData.subcategory === category.id ? 'selected' : '';
        categoryTemplate += `<option ${isSelected} value="${escapeHtml(category.id)}">${escapeHtml(category.title)}</option>`;
      }
    }
    return categoryTemplate;
  }

  selectActiveOption() {
    this.element.querySelector('#status').value = this.productData.status;
  }

  selectSubElements() {
    this.element.querySelectorAll('[data-element]').forEach(element => {
      this.subElements[element.dataset.element] = element;
    });
  }

  createListeners() {
    const binButtons = this.element.querySelectorAll(".binButton");
    for (const button of binButtons) {
      button.addEventListener('pointerdown', this.handleAttachDelete);
    }
    const uploadButton = this.element.querySelector("[name='uploadImage']");
    uploadButton.addEventListener('pointerdown', this.handleAttachUpload);
    this.subElements.productForm.addEventListener('submit', this.handleSubmit);
  }

  removeListeners() {
    const binButtons = this.element.querySelectorAll(".binButton");
    for (const button of binButtons) {
      button.removeEventListener('pointerdown', this.handleAttachDelete);
    }
    const uploadButton = this.element.querySelector("[name='uploadImage']");
    uploadButton.removeEventListener('pointerdown', this.handleAttachUpload);
    this.subElements.productForm.removeEventListener('submit', this.handleSubmit);
  }

  handleAttachUpload = async () => {
    const inputElement = document.createElement('input');
    inputElement.type = 'file';
    inputElement.accept = 'image/png, image/jpeg';
    const hangleNewAttach = async (event) => {
      try {
        const attach = event.target.files[0];
        const form = new FormData();
        form.set('file', attach)
        const response = await fetchJson('https://api.imgur.com/3/image', {
          method: 'POST',
          headers: {
            Authorization: `Client-ID ${IMGUR_CLIENT_ID}`,
          },
          body: form
        });
        this.newAttach = { url: response.data.link, source: attach.name };
        this.appendNewAttachElement();
      } catch (error) {
        console.error(error);
      }
    }
    inputElement.addEventListener('change', hangleNewAttach);
    inputElement.click();
    inputElement.remove();
  }

  appendNewAttachElement() {
    const attachElement = this.element.querySelector('ul.sortable-list');
    const newAttachElement = document.createElement('div');
    newAttachElement.innerHTML = `<li class="products-edit__imagelist-item sortable-list__item" style="">
    <input type="hidden" name="url" value="${escapeHtml(this.newAttach.url)}">
    <input type="hidden" name="source" value="${escapeHtml(this.newAttach.source)}">
    <span>
        <img src="icon-grab.svg" data-grab-handle="" alt="grab">
        <img class="sortable-table__cell-img" alt="Image" src="${escapeHtml(this.newAttach.url)}">
        <span>${escapeHtml(this.newAttach.source)}</span>
    </span>
    <button type="button" class="binButton">
        <img src="icon-trash.svg" data-delete-handle="" alt="delete">
    </button>
</li>`;
    newAttachElement.querySelector(".binButton").addEventListener('pointerdown', this.handleAttachDelete);
    attachElement.appendChild(newAttachElement.firstElementChild);
  }

  handleAttachDelete = (event) => {
    event.target.closest("li").remove();
  }

  handleSubmit = async (event) => {
    event.preventDefault();
    this.save();
  }

  async save() {
    const hasProduct = !!this.productData;
    const product = this.collectProductData();
    product.id = hasProduct ? this.productId : '';
    const method = hasProduct ? 'PATCH' : 'POST';
    const eventName = hasProduct ? 'product-updated' : 'product-created';
    try {
      const patchURL = new URL('api/rest/products', BACKEND_URL);
      let response = await fetchJson(patchURL, {
        method: method,
        headers: {
          'Content-Type': 'application/json;charset=utf-8'
        },
        body: JSON.stringify(product),
      });
      throw (response.status)
    }
    catch (error) {
      console.log(error)
    }
    const event = new Event(eventName);
    this.element.dispatchEvent(event);
  }

  collectProductData() {
    const product = {};
    const attachments = [];
    const images = this.element.querySelectorAll("[data-element='imageListContainer']");
    for (const image of images) {
      const attachObj = {};
      attachObj.url = image.querySelector('input[name="url"]').value;
      attachObj.source = image.querySelector('input[name="source"]').value;
      attachments.push(attachObj)
    }
    const dataFields = ['title', 'subcategory', 'description', 'discount', 'price', 'quantity', 'status'];
    for (const field of dataFields) {
      product[field] = this.element.querySelector(`#${field}`).value;
    }
    product.images = attachments;
    return product;
  }

  destroy() {
    this.remove();
    this.removeListeners();
  }

  remove() {
    if (this.element) this.element.remove();
  }
}
