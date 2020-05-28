// @flow
import * as ACTIONS from 'constants/action_types';
import Lbry from 'lbry';

export const doToggleTagFollow = (name: string) => ({
  type: ACTIONS.TOGGLE_TAG_FOLLOW,
  data: {
    name,
  },
});

export const doAddTag = (name: string) => ({
  type: ACTIONS.TAG_ADD,
  data: {
    name,
  },
});

export const doDeleteTag = (name: string) => ({
  type: ACTIONS.TAG_DELETE,
  data: {
    name,
  },
});
