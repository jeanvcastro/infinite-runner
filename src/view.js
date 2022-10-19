export default class View {
  createView(html) {
    const element = document.createElement("div");
    element.innerHTML = html;
    this.view = element.firstChild;
  }

  destroy() {
    this.view.remove();
  }

  getWidth() {
    if (this.view.offsetWidth) {
      this.width = this.view.offsetWidth;
    }
    return this.width;
  }

  setWidth(width) {
    this.width = width;
    this.view.style.width = this.width + "px";
  }

  getHeight() {
    if (this.view.offsetHeight) {
      this.height = this.view.offsetHeight;
    }
    return this.height;
  }

  setHeight(height) {
    this.height = height;
    this.view.style.height = this.height + "px";
  }

  getLeft() {
    this.left = parseFloat(window.getComputedStyle(this.view).left);
    return this.left;
  }

  setLeft(left) {
    this.left = left;
    this.view.style.left = this.left + "px";
  }

  getTop() {
    this.top = parseFloat(window.getComputedStyle(this.view).top);
    return this.top;
  }

  setTop(top) {
    this.top = top;
    this.view.style.top = this.top + "px";
  }
}
