import React from 'react';
import Button from 'component/button';
// Allow screen reader users ( or keyboard navigation )
// to jump to main content
export default function SkipNavigationButton() {
  const skipNavigation = (e: unknown) => {
    // Match any focusable element
    const focusableElementQuery = `
      #main-content [tabindex]:not([tabindex="-1"]):not(:disabled),
      #main-content a:not([aria-hidden]):not([tabindex="-1"]):not(:disabled),
      #main-content button:not([aria-hidden]):not([tabindex="-1"]):not(:disabled)
    `;
    // Find first focusable element
    const element = document.querySelector(focusableElementQuery);
    // Trigger focus to skip navigation
// @ts-expect-error - TS2339 - Property 'focus' does not exist on type 'Element'.
    if (element && element.focus) {
// @ts-expect-error - TS2339 - Property 'focus' does not exist on type 'Element'.
      element.focus();
    }
  };
  // @ts-expect-error - TS2322 (ts-migration)
  return <Button className={'skip-button'} onClick={skipNavigation} label={__('Skip Navigation')} button={'link'} />;
}
