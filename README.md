# DuckStack

#### First, some influences and reasoning.

Many people who are planning to organize a React + Redux project may be familiar with Erik Rasmussen  [ducks-modular-redux](https://github.com/erikras/ducks-modular-redux) proposal, which outlines the basis of organizing code by function rather than by components, reducers, etc. I personally ran into issues when trying to implement this in my own projects; namely, it becomes cluttered when working with larger components and has no solutions in-place for React components.  
Looking for alternatives, I stumbled upon Jack Hsu's [Rules for Structuring Redux Applications](https://jaysoo.ca/2016/02/28/organizing-redux-application/). This extends the ducks idea further to fully flesh-out the separation of actions, actiontypes and reducers, as well as including all other files related to a component within the ducks module. However the unnecessary files and structure over-complicated what should be a simple to set-up, and easily-repeatable template. 

#### So what is duck-stack?

A proposal of structuring React+Redux projects that encourages re-usability and streamlines the export process, while keeping each duck-stack module as simple as possible. It combines all files related to a single component into one duck-stack module (folder), and utilizes an `index.js` file at each level to manage exports. Additionally, same-name files and a static index file allow you to reuse the same template folder for every component, drastically lowering set-up time.

### Table of Contents:

[Folder Structure](#folder-structure)

[Files](#files)

[Nesting Components](#nesting-components)

[Import Syntax](#import-syntax)

---

## Folder Structure

The basic folder structure of each duck-stack component folder.

**Pros:** Easy setup, index files always remain the same, file names always remain the same, most basic imports between files stay the same.

**Cons:** In certain IDEs there is no differentiation between same-name open files in the tabs, making it confusing as to which 'action.js' or 'component.jsx' you're working on. This is not an issue if your IDE shows folder path in the open file tabs.

```
ComponentName
├── __test__ 		// not discussed, see https://facebook.github.io/jest/
├── actiontypes.js
├── actions.js
├── container.jsx
├── component.jsx
├── reducer.js
├── sagas.js
├── style.scss 		// not discussed, not necessarily needed
└── index.js
```

For a template set up to use duck-stack structure, see my [redux boilerplate](https://github.com/liamross/redux-boiler-lint) with linting. Additionally, see the duck-stack template folder in this project.

---

## Files

The contents of each file referenced in the folder structure.

### actiontypes.js

> Note: Traditional ducks proposes that your action types should be named based on their position within the project.  
For example, rather than having:  
`export const REDUCER_TYPE_ONE = 'REDUCER_TYPE_ONE'`  
you could have something like:  
`export const REDUCER_TYPE_ONE = 'componentName/REDUCER_TYPE_ONE'`  
This avoids accidental redundancy through generic actiontype naming, or just a project so big it's hard to think of new names!

```javascript
// Reducer action types.
export const REDUCER_TYPE_ONE = 'componentName/REDUCER_TYPE_ONE';
export const REDUCER_TYPE_TWO = 'componentName/REDUCER_TYPE_TWO';

// Saga action types.
export const SAGA_TYPE_ONE = 'componentName/SAGA_TYPE_ONE';
```

### actions.js
```javascript
import * as t from './actiontypes';

// Reducer actions.
export const reducerTypeOne = value => ({
    type: t.REDUCER_TYPE_ONE,
    value
});

export const reducerTypeTwo = value => ({
    type: t.REDUCER_TYPE_TWO,
    value
});

// Saga actions.
export const sagaTypeOne = url => ({
    type: t.SAGA_TYPE_ONE,
    url
})
```

### reducer.js
```javascript
import * as t from './actiontypes';

export const defaultState = {};

export default (state = defaultState) => {
    switch(action.type) {
        case t.REDUCER_TYPE_ONE:
            // do something with action.value
            return state;
        case t.REDUCER_TYPE_TWO:
            // do something with action.value
            return state;
        default:
            return state;
    }
};
```

### sagas.js
```javascript
import { call, put } from 'redux-saga/effects';
import { fetchSomething } from '../api/fetchSomething';
import * as t from './actiontypes';

export function* sagaTypeOne(action) {
    try {
        const value = yield call(fetchSomething, action.url);
        yield put(t.reducerTypeOne(value))
    }
    catch (value) {
        yield put(t.reducerTypeTwo(value))
    }
};
```

### container.jsx and component.jsx

Both of these files are as they would be usually, both export default their main class / jsx component. The only difference is that *EVERY* action dispatched *MUST* be created using an action creator imported from './actions'.

> Note: Situations may arise where more than one component needed is needed by the `container.jsx` file. In situations such as these, the naming of the component files could reflect their function, as they are only imported by `container.jsx`. However, the `container.jsx` file should maintain its name, as there is only one per component folder, and it is imported by the index file, which should never be changed.

```javascript
import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as a from './actions';     
// Alternatively, you can directly reference the actions.
import { reducerTypeOne } from './actions';
// If you need actions from other components, they would be imported like this:
import OtherComponent from '../OtherComponent';
// They would then be used like this:
// OtherComponent.actions.someActionCreatorFunction(something);

// Your component goes here (export default using connect)

const mapDispatchToProps = dispatch => ({
    actionOne: value => {
        dispatch(a.reducerTypeOne(value)); // action dispatch
    }
});
```

### index.js

This file never changes. Because the file names are always static all imports in this and other files will always remain the same.
> Note: A gotcha is that the `import component` actually imports the container. This is because any references to the component will be to the container, and there may be multiple components referenced by the container, meaning their naming will not be static. As such, we export as component for ease, but import in the index as container. This shouldn't cause any problems as long as you're copying an existing duck-stack module folder as a template and not rewriting it yourself.
```javascript
import * as actions from './actions';
import * as actiontypes from './actiontypes';
import component from './container';
import reducer from './reducer';
import * as sagas from './sagas';

/*
Should be imported at final destination as follows:
import FolderName from './FolderName'
*/
export default { actions, actiontypes, component, reducer, sagas };
```

---

## Nesting Components

Depending on your state structure and folder organization methodology, you may choose to nest duck-stack module folders within each other. Generally, since `index.js` files serve to bring the individual files to the surface of your folder structure, this will mean the `index.js` file of the parent folder will need to import, and subsequently export the `index.js` default export of the component below. In cases such as these, you will import the child and export it as an element within the default export.

> Note: This is generally not recommended, as it reduces component re-usability. The only time you should nest components is if the component is specifically used in the parent component, with no possibility of reuse elsewhere in the application.

### index.js (of parent folder, the child exports as normal)

```javascript
import * as actions from './actions';
import * as actiontypes from './actiontypes';
import component from './container';
import reducer from './reducer';
import * as sagas from './sagas';
// Import child folder.
import ChildComponentName from './ChildComponentName';

/*
Should be imported at final destination as follows:
import ParentFolderName from './ParentFolderName'
*/
export default { actions, actiontypes, component, reducer, sagas, ChildComponentName };
```

---

## Import syntax

Examples of how to import the elements of a duck-stack module folder.

```javascript
// Access the index.js default export.
import ComponentName from './ComponentName';

// Reference an action type:
ComponentName.actiontypes.REDUCER_TYPE_ONE;

// Reference an action creator:
ComponentName.actions.reducerTypeOne(value);

// Reference the container.
ComponentName.component;

// Reference the reducer in combine reducers.
ComponentName.reducer;

// Reference the reducer in a parent reducer.
ComponentName.reducer(state.substate, action);

// Reference the sagas in your parent saga file.
ComponentName.sagas.sagaTypeOne;

// Referencing child component through parent.
ParentName.ChildName.actiontypes.CHILD_ACTION;
```
