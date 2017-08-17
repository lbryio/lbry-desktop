class BrowserHistory {
  constructor() {
    this.stack = [];
    this.index = 0;
  }

  push(location) {
    // Get page
    const page = {
      index: this.stack.length,
      location,
    };

    const lastItem = this.stack.length - 1;

    // Check duplicated
    /*
    const is_duplicate = this.stack.some(
      stack => stack.location.href === page.location.href
    );
    */

    let is_duplicate = lastItem > -1
      ? this.stack[lastItem].location === page.location
      : false;

    // Push to stack
    if (!is_duplicate) {
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

      // Update index
      this.index = index;

      // Return location
      return destination.location;
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

      // Update index
      this.index = index;

      // Return location
      return destination.location;
    }

    console.log("Cant' do forward:", false);
  }
}

export default BrowserHistory;
