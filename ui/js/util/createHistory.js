class BrowserHistory {
  constructor() {
    this.stack = [];
    this.index = 0;
  }

  push(location) {
    // Get page
    const page = {
      index: this.stack.length,
      location: location.replace(/^#/, ""),
    };

    const lastItem = this.stack.length - 1;

    // Check duplicated
    let is_duplicate = lastItem > -1
      ? this.stack[lastItem].location === page.location
      : false;

    if (!is_duplicate) {
      // Push to stack
      this.stack.push(page);

      // Update index
      this.index = page.index;
    }
  }

  getBack() {
    // Get new index
    const index = this.index - 1;

    // Check if page exist
    if (index > -1) {
      // Get page
      const destination = this.stack[index];

      // Return location
      return destination;
    }
  }

  getForward() {
    // Get new index
    const index = this.index + 1;

    // Get history length
    const length = this.stack.length - 1;

    // Check if page exist
    if (index <= length) {
      // Get page
      const destination = this.stack[index];

      // Return location
      return destination;
    }
  }
}

export default BrowserHistory;
