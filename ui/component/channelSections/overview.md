## Overview
- This folder covers all components related to "channel-sections".
- Sections are implemented as `Collection` with a special tag.
  - Tag format: `__section__<section_type>__`
    - e.g. `__section__featured__` 
    - e.g. `__section__subscriptions__`
  - These tags are added automatically during the publish process. 
- The only section available for now is "Featured Channels" (FC). Channel owners   
  can create multiple Featured Channels lists.

### _2022-10-28:_ Re-implementation Notes
- The collection-based implementation did not turn out well, as the dependency on the blockchain made certain operations like editing and sorting harder to use/implement.
- The Commentron's `setting.List|Update` API is now used to store the data instead.

## Behavioral

### Channel Page: Tabs
- Content
- Playlists
- About
- Community
- *--new--* Channels: `ChannelSections\FeaturedChannelsList`

### Channel Page: Edit Buttons
- *--new--* Customize Sections
- Edit

> Given that both editing a Channel and editing an FC (a collection) requires a 
'publish' action, the FC action is moved outside the Channel publish sequence
(i.e. not part of the Channel Edit Form).

> Also, given that we only have 1 type of Sections for now, we'll just edit the
FCs directly from the [Channels] tab. The "Add featured channels" button will
be visible if a user owns the channel.

### General
- Initially, FCs are filtered out from `/$/playlists`, but decided to keep them
  since it is quite convenient to see all of them in one screen.
  - In the "Channel Page > Playlist Tab", FCs are filtered out. 

## Code Structure

### Components (`ui/component` directory) 
- `ChannelSections/`
  - `Section/` Summary card for a section. 
    Equivalent to a ClaimPreview for a regular collection claims.   
  - `SectionList/` Lists all available sections (only "Featured Channels" for now).
    Equivalent to ClaimList for regular collection claims.
  - `FeaturedChannelsEdit/` Simplified version of a playlist edit form, catered to Featured Channels. 
  - `SubscriptionsEdit/` (future example)
  - `ShortsEdit/` (future example)
  - `channelSectionsEdit/` Equivalent to `ChannelEdit` but specialized for Featured Channels.
    See notes in "Channel Page: Edit Buttons" above.
  - ...

### Modal
- `modalChannelSectionCreate`: houses `FeaturedChannelsEdit` to create/edit featured channel playlist.
