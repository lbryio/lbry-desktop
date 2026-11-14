// A simple function to detect if a user is typing:
// useful when handling shortcut keys.

export default function isUserTyping(): boolean {
  const activeElement = document.activeElement;

  if (activeElement) {
    const elementType = activeElement.tagName.toLowerCase();
    return (
      elementType === "input" || elementType === "textarea" || (activeElement as HTMLElement).isContentEditable === true
    );
  }

  return false;
}
