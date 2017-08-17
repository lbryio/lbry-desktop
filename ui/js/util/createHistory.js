class BrowserHistory {
  constructor() {
    this.stack = [];
    this.index = 0;
  }

  push(location) {
    // Extract location
    const { href, hash } = location;

    // Get page
    const page = {
      index: this.stack.length,
      location: { href, hash },
    };

    const lastItem = this.stack.length - 1;

    // Check duplicated
    /*
    const is_duplicate = this.stack.some(
      stack => stack.location.href === page.location.href
    );
    */

    let is_duplicate = false;

    if (lastItem > -1)
      is_duplicate = this.stack[lastItem].location.href === page.location.href;

    // Push to stack
    if (!is_duplicate) {
      this.stack.push(page);

      // Update index
      this.index = page.index;
    }
  }

  back() {
    // Get new index
    const index = this.index - 1;

    // Check if page exist
    if (index > -1) {
      // Get page
      const destination = this.stack[index];

      // Set new location
      window.location.href = destination.location.href;

      // Update curren index
      this.index = index;
    }
  }

  forward() {
    // Get new index
    const index = this.index + 1;

    // Get history length
    const length = this.stack.length - 1;

    // Check if page exist
    if (index <= length) {
      // Get page
      const destination = this.stack[index];

      // Set new location
      window.location.href = destination.location.href;

      // Update index
      this.index = index;
    }

    console.log("Cant' do forward:", false);
  }
}

export default BrowserHistory;
