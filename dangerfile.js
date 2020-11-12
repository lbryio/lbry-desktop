import { danger, warn } from 'danger';

// Check for a CHANGELOG entry
const hasChangelog = danger.git.modified_files.some(f => f === 'CHANGELOG.md');
if (!hasChangelog) {
  const title = ':page_facing_up: Changelog Entry Missing';
  const idea = 'Please add a changelog entry for your changes.';
  warn(`${title} - <i>${idea}</i>`);
}
