# Contribute to LBRY


**First:** if you're unsure or afraid of anything, just ask or submit the issue or pull request anyways. You won't be yelled at for giving your best effort. The worst that can happen is that you'll be politely asked to change something. We appreciate any sort of contributions, and don't want a wall of rules to get in the way of that.

However, for those individuals who want a bit more guidance on the best way to contribute to the project, read on. This document will cover what we're looking for. By addressing all the points we're looking for, it raises the chances we can quickly merge or address your contributions.


## TL;DR?

* [Here](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+no%3Aassignee)
  is a list of help wanted issues.
* Comment on an issue to let us know if you are going to work on it, don't take an issue that
  someone reserved less than 3 days ago
* Submit a pull request and get paid in LBC
* Don't hesitate to contact us with any questions or comments

## Choose an Issue

LBRY is an open source project and therefore is developed out in the open for everyone to see. What
you see here are the latest source code changes and issues.

Since LBRY is based on a decentralized community, we believe that the app will be stronger if it
receives contributions from individuals outside the core team -- such as yourself!

To make contributing as easy and rewarding of possible, we have instituted the following system:

* Anyone can view all issues in the system by clicking on the
  [Issues](https://github.com/lbryio/lbry-desktop/issues) button at the top of the page. Feel free to
  add an issue if you think we have missed something (and you might earn some LBC in the process
  because we do tip people for reporting bugs).
* Once on the [Issues](https://github.com/lbryio/lbry-desktop/issues) page, a potential contributor can
  filter issues by the
  [Help Wanted](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+no%3Aassignee)
  label to see a curated list of suggested issues with which community members can help.
* Every
  [Help Wanted](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+no%3Aassignee)
  issue is ranked on a scale from zero to four.

| Level                                                                                                                                            | Description                                                                                        |
| ------------------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------- |
| [**level 0**](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+0%22+no%3Aassignee) | Typos and text edits -- a tech-savvy non-programmer can fix these                                  |
| [**level 1**](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+1%22+no%3Aassignee) | Programming issues that require little knowledge of how the LBRY app works                         |
| [**level 2**](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+2%22+no%3Aassignee) | Issues of average difficulty that require the developer to dig into how the app works a little bit |
| [**level 3**](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+3%22+no%3Aassignee) | Issues that are likely too tricky to be level 2 or require more thinking outside of the box        |
| [**level 4**](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3A%22level%3A+4%22+no%3Aassignee) | Big features or really hard issues                                                                 |

The process of ranking issues is highly subjective. The purpose of sorting issues like this is to
give contributors a general idea about the type of issues they are looking at. It could very well be
the case that a level 1 issue is more difficult than a level 2, for instance. This system is meant
to help you find relevant issues, not to prevent you from working on issues that you otherwise
would. If these rankings don't work for you, feel free to ignore them.

Although all contributions should have good UX, the [UX label, when applied in conjunction with Help Wanted](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22help+wanted%22+label%3Aux+no%3Aassignee), indicates that the contributor ought to implement the feature in a creative way that specifically focuses on providing a good user experience. These issues often have no set instruction for how the experience should be and leave it to the contributor to figure out. This may be challenging for people who do not like UX, but also more fun and rewarding for those who do.

## Code Overview

The entry point for this application is `src/renderer/index.js`

This application is primarily written in JavaScript and is built on [Electron](https://electronjs.org)
while utilizing [React](https://reactjs.org) and [Redux](https://redux.js.org) for UI and
application state.

The project comes with diverse tools for simplifying the development process and for providing
better code quality. It's recommended to make use of them thoroughly during ongoing development. We follow the well-known [Airbnb JavaScript Style Guide](http://airbnb.io/javascript/) for defining
our styling rules and code best practices.

### lbry-redux

This project uses [lbry-redux](https://github.com/lbryio/lbry-redux) to share Redux code with [lbry-android](https://github.com/lbryio/lbry-android) and other LBRY apps. Over time, more Redux code that is suitable to be shared will be moved into lbry-redux. If modifying Redux code, you may be asked to make some of your changes in lbry-redux rather than lbry-desktop. The steps to work with lbry-redux locally can be found [here](https://github.com/lbryio/lbry-redux#local-development).


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

for applying formatting rules to all project's code sources. For formatting a specific file or
directory use:

`$ yarn prettier 'glob/pattern'`

Editor integrations are available [here](https://prettier.io/docs/en/editors.html).

### Debug

There are a few tools integrated to the project that will ease the process of debugging:

* [Chrome DevTools](https://developer.chrome.com/devtools)
  * Also available for the main process as a [remote target](chrome://inspect/#devices).
* [Electron Devtron](https://electronjs.org/devtron)
* [React DevTools](https://github.com/facebook/react-devtools)
* [Redux DevTools](https://github.com/gaearon/redux-devtools)

## Submit a Pull Request

* After deciding what to work on, a potential contributor can
  [fork](https://help.github.com/articles/fork-a-repo/) this repository, make his or her changes,
  and submit a
  [pull request](https://help.github.com/articles/creating-a-pull-request-from-a-fork/). A
  contributor wanting to reserve an issue in advance can leave a comment saying that he or she is
  working on it. Contributors should respect other people's efforts to complete issues in a timely
  manner and, therefore, not begin working on anything reserved (or updated) within the last 3 days.
  If someone has been officially assigned an issue via Github's assignment system, it is also not
  available. Contributors are encouraged to ask if they have any questions about issue availability.
* The [changelog](https://github.com/lbryio/lbry-desktop/blob/master/CHANGELOG.md) should be updated to
  include a reference to the fix/change/addition. See previous entries for format.
* Once the pull request is visible in the LBRY repo, a LBRY team member will review it and make sure
  it is up to our standards. At this point, the contributor may have to change his or her code based
  on our suggestions and comments.
* Then, upon a satisfactory review of the code, we will merge it and send the contributor a tip (in
  LBC) for the contribution.

We are dedicated to being fair and friendly in this process. In **general**, level 4 issues will be
paid more than level 3 issues which will be paid more than level 2, and so on. However, this is not
due to their labeling, but rather how difficult they end up being. Maybe an issue labeled "level 1"
turns out to be very difficult. In this case, we would be **more than happy** to tip accordingly. If
you do good work, we want you to be rewarded for it.

Also, we are here to enable you. We want you to succeed, so do not hesitate to ask questions. If you
need some information or assistance in completing an issue, please let us know! That is what we are
here for-- pushing development forward.

Lastly, don't feel limited by this list. Should LBRY have built-in Tor support? Add it! It's not in
the issue tracker, but maybe it's a good idea. Do you think the search layout is unintuitive? Change
it! We welcome all feedback and suggestions. That said, it may be the case that we do not wish to
incorporate your change if you don't check with us first (also, please check with us especially if
you are planning on adding Tor support :P). If you want to add a feature that is not listed in the
issue tracker, go ahead and [create an issue](https://github.com/lbryio/lbry-desktop/issues/new), and
say in the description that you would like to try to implement it yourself. This way we can tell you
in advance if we will accept your changes and we can point you in the right direction.

# Tom's "Voice of the User" Wishlist

[Anything marked with **both** "Help Wanted" and "Tom's 'Voice of the User' Wishlist"](https://github.com/lbryio/lbry-desktop/issues?q=is%3Aopen+is%3Aissue+label%3A%22Tom%27s+%5C%22Voice+of+the+User%5C%22+Wishlist%22+label%3A%22help+wanted%22+no%3Aassignee)
will earn you an extra 50 LBC on top of what we would otherwise tip you.

# Get in Touch

| Name                                    | Role                                                                                                                                                                                                           | Discord     | Email        |
| --------------------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------- | ------------
| [Tom](https://github.com/tzarebczan)    | Community manager. He knows more than anyone about the app and all of its flaws. Reach out to him with any questions about how the app works, if a bug has been reported, or if a feature should be requested. | jiggytom    | tom@lbry.io  |
| [Sean](https://github.com/seanyesmunt)  | The primary engineer working on the app. Feel free to ask any questions about the code.                                                                          | sean        | sean@lbry.io |

Join our Discord [here](https://chat.lbry.io/).

# More Information

More information about contributing to LBRY [here](https://lbry.io/faq/contributing).
