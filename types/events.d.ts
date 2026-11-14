// Ambient aliases for common React event types, so handlers don't need
// imports (matching the ergonomics of the other global types). The change
// event intersects the form element types so `.value` and `.checked` are
// both reachable; narrow at the use site when it matters.
type FormFieldChangeEvent = import("react").ChangeEvent<HTMLInputElement & HTMLTextAreaElement & HTMLSelectElement>;
type MouseClickEvent = import("react").MouseEvent<HTMLElement>;
type KeyEvent = import("react").KeyboardEvent<HTMLElement>;
type FormSubmitEvent = import("react").FormEvent<HTMLFormElement>;
