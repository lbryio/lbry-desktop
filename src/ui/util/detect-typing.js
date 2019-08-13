// A simple function to detect if a user is typing:
// useful when hanlding shorcut keys.

export default function isUserTyping() {
  const activeElement = document.activeElement;

  if (activeElement) {
    const elementType = activeElement.tagName.toLowerCase();
    return elementType === 'input' || elementType === 'textarea';
  }

  return false;
}
