/* eslint-disable import/no-extraneous-dependencies */
import { danger, warn } from 'danger';
import eslint from 'danger-plugin-eslint';

// No PR is too small to include a description of why you made a change
if (!danger.github.pr.body || danger.github.pr.body.length < 10) {
  const title = ':grey_question: No Description';
  const idea = 'Please include a description of your PR changes.';
  warn(`${title} - <i>${idea}</i>`);
}

// Tags big PRs
const bigPRThreshold = 600;
if (danger.github.pr.additions + danger.github.pr.deletions > bigPRThreshold) {
  const title = ':exclamation: Big PR';
  const idea = `This PR is extremely unlikely to get reviewed because it touches ${danger.github.pr
    .additions + danger.github.pr.deletions} lines.`;
  warn(`${title} - <i>${idea}</i>`);
} else if (
  danger.git.modified_files + danger.git.added_files + danger.git.deleted_files >
  bigPRThreshold
) {
  const title = ':exclamation: Big PR';
  const idea = `This PR is extremely unlikely to get reviewed because it touches ${danger.git
    .modified_files +
    danger.git.added_files +
    danger.git.deleted_files} files.`;
  warn(`${title} - <i>${idea}</i>`);
}

// Check for a CHANGELOG entry
const hasChangelog = danger.git.modified_files.some(f => f === 'CHANGELOG.md');
if (!hasChangelog) {
  const title = ':page_facing_up: Changelog Entry Missing';
  const idea = 'Please add a changelog entry for your changes.';
  warn(`${title} - <i>${idea}</i>`);
}

// Check for ESLint problems
eslint();
