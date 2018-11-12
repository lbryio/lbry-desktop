/* eslint-disable import/no-extraneous-dependencies */
import { danger, warn } from 'danger';

// No PR is too small to include a description of why you made a change
if (!danger.github.pr.body || danger.github.pr.body.length < 10) {
  const title = ':grey_question: No Description';
  const idea = 'Please include a description of your PR changes.';
  warn(`${title} - <i>${idea}</i>`);
}

// Check for a CHANGELOG entry
const hasChangelog = danger.git.modified_files.some(f => f === 'CHANGELOG.md');
if (!hasChangelog) {
  const title = ':page_facing_up: Changelog Entry Missing';
  const idea = 'Please add a changelog entry for your changes.';
  warn(`${title} - <i>${idea}</i>`);
}
