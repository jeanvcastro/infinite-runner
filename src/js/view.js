export default class View {
  setView(html) {
    const element = document.createElement("div");
    element.innerHTML = html;
    this.view = element.firstChild;
  }

  getView() {
    return this.view;
  }

  destroy() {
    this.getView().remove();
  }

  getWidth() {
    if (this.getView().offsetWidth) {
      this.width = this.getView().offsetWidth;
    }
    return this.width;
  }

  setWidth(width) {
    this.width = width;
    this.getView().style.width = this.width + "px";
  }

  getHeight() {
    if (this.getView().offsetHeight) {
      this.height = this.getView().offsetHeight;
    }
    return this.height;
  }

  setHeight(height) {
    this.height = height;
    this.getView().style.height = this.height + "px";
  }

  getLeft() {
    this.left = parseFloat(window.getComputedStyle(this.getView()).left);
    return this.left;
  }

  setLeft(left) {
    this.left = left;
    this.getView().style.left = this.left + "px";
  }

  getTop() {
    this.top = parseFloat(window.getComputedStyle(this.getView()).top);
    return this.top;
  }

  setTop(top) {
    this.top = top;
    this.getView().style.top = this.top + "px";
  }
}
