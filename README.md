# ReactHookify

## Overview

- React Hookify is a command line tool that converts React class components into functional components with Hooks! **It will not alter your current file; instead, a new 'hookified' file is created next to your original.**
- Documentation (with testing playground): https://react-hookify.herokuapp.com/

## Setup

- `npm install -g react-hookify`

## Usage

- `hookify <filepath(s) of class component>`
- Examples:
  - `hookify client/app.js`
  - `hookify app.js`
  - `hookify app1.js app2.js`
- Look for your new 'hookified' file in the same directory as your class component file!

## Limitations

- React Hooks cannot always map 1 to 1 with lifecycle components. Less complex lifecycle components should work fine with React Hookify. In more complex cases, code my have to be rewritten
  - Currently, the only supported lifecycle methods are componentDidMount, componentDidUpdate, and componentWillUnmount
- Any comments in the original file will be removed in the 'hookified file'
- React Hookify does not currently support 'get', 'set', and 'static' keywords
