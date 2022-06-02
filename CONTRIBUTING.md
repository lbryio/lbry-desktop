# Contribute to Odysee

**First:** if you're unsure or afraid of anything, just ask or submit the issue or pull request anyways. You won't be yelled at for giving your best effort. The worst that can happen is that you'll be politely asked to change something. We appreciate any sort of contributions, and don't want a wall of rules to get in the way of that.

However, for those individuals who want a bit more guidance on the best way to contribute to the project, read on. This document will cover what we're looking for. By addressing all the points we're looking for, it raises the chances we can quickly merge or address your contributions.

## TL;DR?

- [Here](https://github.com/OdyseeTeam/odysee-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+no%3Aassignee)
  is a list of help wanted issues.
- Comment on an issue to let us know if you are going to work on it, don't take an issue that someone reserved less than 3 days ago.
- Submit a pull request and get paid in Credits.
- Don't hesitate to contact us with any questions or comments.

## Contents

- [Choose an Issue](#choose-an-issue)
- [Code Overview](#code-overview)
  - [Flow](#flow)
  - [Lint](#lint)
  - [Code Formatting](#code-formatting)
  - [Debug](#debug)
- [Submit a Pull Request](#submit-a-pull-request)
- [Get in Touch](#get-in-touch)

## Choose an Issue

Odysee is an open source project and therefore is developed out in the open for everyone to see. What
you see here are the latest source code changes and issues.

Since Odysee is based on a decentralized community, we believe that the app will be stronger if it
receives contributions from individuals outside the core team -- such as yourself!

To make contributing as easy and rewarding as possible, we have instituted the following system:

- Anyone can view all issues in the system by clicking on the
  [Issues](https://github.com/OdyseeTeam/odysee-frontend/issues) button at the top of the page. Feel free to
  add an issue if you think we have missed something (and you might earn some Credits in the process
  because we do tip people for reporting bugs).
- Once on the [Issues](https://github.com/OdyseeTeam/odysee-frontend/issues) page, a potential contributor can
  filter issues by the
  [Help Wanted (in progress)](https://github.com/OdyseeTeam/odysee-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+no%3Aassignee)
  label to see a curated list of suggested issues with which community members can help.
- Every
  [Help Wanted](https://github.com/OdyseeTeam/odysee-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+no%3Aassignee)
  issue is ranked on a scale from zero to four (in progress)

| Level (in progress)                                                                                                                                         | Description                                                                                         |
| ----------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------- |
| [**level 0**](https://github.com/OdyseeTeam/odysee-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+0%22+no%3Aassignee) | Typos and text edits -- a tech-savvy non-programmer can fix these.                                  |
| [**level 1**](https://github.com/OdyseeTeam/odysee-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+1%22+no%3Aassignee) | Programming issues that require little knowledge of how the Odysee app works.                       |
| [**level 2**](https://github.com/OdyseeTeam/odysee-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+2%22+no%3Aassignee) | Issues of average difficulty that require the developer to dig into how the app works a little bit. |
| [**level 3**](https://github.com/OdyseeTeam/odysee-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+3%22+no%3Aassignee) | Issues that are likely too tricky to be level 2 or require more thinking outside of the box.        |
| [**level 4**](https://github.com/OdyseeTeam/odysee-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+4%22+no%3Aassignee) | Big features or really hard issues.                                                                 |

The process of ranking issues is highly subjective. The purpose of sorting issues like this is to
give contributors a general idea about the type of issues they are looking at. For instance, it could very well be
the case that a level 1 issue is more difficult than a level 2 issue. This system is meant
to help you find relevant issues, not to prevent you from working on issues that you otherwise
would. If these rankings don't work for you, feel free to ignore them.

Although all contributions should have good UX, the [UX label, when applied in conjunction with Help Wanted](https://github.com/OdyseeTeam/odysee-frontend/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3Aux+no%3Aassignee), indicates that the contributor ought to implement the feature in a creative way that specifically focuses on providing a good user experience. These issues often have no set instruction for how the experience should be and leave it to the contributor to figure out. This may be challenging for people who do not like UX, but also more fun and rewarding for those who do.

## Code Overview

This application is primarily written in JavaScript, utilizing [React](https://reactjs.org) and [Redux](https://redux.js.org) for UI and
application state.

The project comes with diverse tools for simplifying the development process and for providing
better code quality. It's recommended to make use of them thoroughly during ongoing development. 

We follow the well-known [Airbnb JavaScript Style Guide](https://airbnb.io/javascript/) for defining
our styling rules and code best practices.

### Flow

[Flow](https://flow.org/) is a static type checker for JavaScript. Flow checks your code for
errors through static type annotations. For using Flow, you need to add the following
annotation to the beginning of the file you're editing:

`// @flow`

After adding this, you can start adding [type annotations](https://flow.org/en/docs/types/) to
the code.

If you add a project dependency and you want to use it with Flow, you need to import its type
definitions in the project by running:

`$ yarn flow-defs`

### Lint

Code linting is ensured by [ESLint](https://eslint.org/) and [Flow CLI](https://flow.org/en/docs/cli/).

You can lint all the project's sources at any time by running:

`$ yarn lint`

If you desire to lint a specific file or directory you can use:

```
$ yarn eslint 'glob/pattern'
$ yarn flow focus-check 'glob/pattern'
```

In addition to those commands, staged files are automatically linted before commit. Please take the
time to fix all staged files' linting problems before committing or suppress them if necessary.

If you want the linting problems to show up on your IDE or text editor, check out
[ESLint integrations](https://eslint.org/docs/user-guide/integrations).

### Code Formatting

Project's sources are formatted using [Prettier](https://prettier.io/).

Staged files are automatically formatted before commit.

You can also use the following command:

`$ yarn format`

for applying formatting rules to the entire project's code. For formatting a specific file or
directory, use:

`$ yarn prettier 'glob/pattern'`

Editor integrations are available [here](https://prettier.io/docs/en/editors.html).

### Debug

There are a few tools integrated to the project that will ease the process of debugging:

- [Chrome DevTools](https://developer.chrome.com/devtools)
  - Also available for the main process as a [remote target](chrome://inspect/#devices).
- [React DevTools](https://github.com/facebook/react-devtools)
- [Redux DevTools](https://github.com/gaearon/redux-devtools)

## Submit a Pull Request

- After deciding what to work on, a potential contributor can
  [fork](https://help.github.com/articles/fork-a-repo/) this repository, make his or her changes,
  and submit a
  [pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/). 
  - A contributor wanting to reserve an issue in advance can leave a comment saying that he or she is
  working on it. Contributors should respect other people's efforts to complete issues in a timely
  manner and, therefore, not begin working on anything reserved (or updated) within the last 3 days.
  If someone has been officially assigned an issue via GitHub's assignment system, it is also not
  available. Contributors are encouraged to ask if they have any questions about issue availability.
- Once the pull request is visible in the Odysee repo, a Odysee team member will review it and make sure
  it is up to our standards. At this point, the contributor may have to change his or her code based
  on our suggestions and comments.
- Then, upon a satisfactory review of the code, we will merge it and send the contributor a tip (in
  Credits or Cash) for the contribution.

We are dedicated to being fair and friendly in this process. In **general**, level 4 issues will be
paid more than level 3 issues which will be paid more than level 2, and so on. However, this is not
due to their labeling, but rather how difficult they end up being. Maybe an issue labeled "level 1"
turns out to be very difficult. In this case, we would be **more than happy** to tip accordingly. If
you do good work, we want you to be rewarded for it.

Also, we are here to enable you. We want you to succeed, so do not hesitate to ask questions. If you
need some information or assistance in completing an issue, please let us know! That is what we are
here for-- pushing development forward.

Lastly, don't feel limited by this list. Should Odysee have built-in Tor support? Add it! It's not in
the issue tracker, but maybe it's a good idea. Do you think the search layout is unintuitive? Change
it! We welcome all feedback and suggestions. That said, it may be the case that we do not wish to
incorporate your change if you don't check with us first (also, please check with us especially if
you are planning on adding Tor support :P). If you want to add a feature that is not listed in the
issue tracker, go ahead and [create an issue](https://github.com/OdyseeTeam/odysee-frontend/issues/new), and
say in the description that you would like to try to implement it yourself. This way we can tell you
in advance if we will accept your changes and we can point you in the right direction.

# Get in Touch

| Name                                  | Role                                                                                                                                                                                                           | Discord  | Email                       |
| ------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | -------- | --------------------------- |
| [Tom](https://github.com/tzarebczan)  | Community manager. He knows more than anyone about the app and all of its flaws. Reach out to him with any questions about how the app works, if a bug has been reported, or if a feature should be requested. | jiggytom | tom@Odysee.com              |
| [Anthony](https://github.com/mayeaux) | The primary engineer working on the app. Feel free to ask any questions about the code.                                                                                                                        | Anthony  | anthony.mayfield@odysee.com |

Join our Discord [here](https://chat.odysee.com/).
