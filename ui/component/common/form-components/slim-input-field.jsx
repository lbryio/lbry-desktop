// @flow
import React from 'react';
import Drawer from '@mui/material/Drawer';
import CommentSelectors from 'component/commentCreate/comment-selectors';

type TextareaWrapperProps = {
  slimInput?: boolean,
  slimInputButtonRef?: any,
  children: any,
  isDrawerOpen: boolean,
  showSelectors?: boolean,
  commentSelectorsProps?: any,
  tipModalOpen?: boolean,
  onSlimInputClose?: () => void,
  toggleDrawer: () => void,
  closeSelector?: () => void,
};

export const TextareaWrapper = (wrapperProps: TextareaWrapperProps) => {
  const {
    children,
    slimInput,
    slimInputButtonRef,
    isDrawerOpen,
    commentSelectorsProps,
    showSelectors,
    tipModalOpen,
    onSlimInputClose,
    toggleDrawer,
    closeSelector,
  } = wrapperProps;

  function handleCloseAll() {
    toggleDrawer();
    if (closeSelector) closeSelector();
    if (onSlimInputClose) onSlimInputClose();
  }

  return slimInput ? (
    !isDrawerOpen ? (
      <div ref={slimInputButtonRef} role="button" onClick={toggleDrawer}>
        {children}
      </div>
    ) : (
      <Drawer
        className="comment-create--drawer"
        anchor="bottom"
        open
        onClose={handleCloseAll}
        // The Modal tries to enforce focus when open and doesn't allow clicking or changing any
        // other input boxes, so in this case it is disabled when trying to type in a custom tip
        ModalProps={{ disableEnforceFocus: tipModalOpen }}
      >
        {children}

        {showSelectors && <CommentSelectors closeSelector={closeSelector} {...commentSelectorsProps} />}
      </Drawer>
    )
  ) : (
    children
  );
};
