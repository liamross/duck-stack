# New Ducks

A ducks proposal of structuring React+Redux projects that encourages reusability and streamlines the export proces. It combines all files related to a single component into one folder, and utilizes an `index.js` file at each level to manage exports. Additionally, same-name files and a static index file allow you to copy a template folder for every component. 

### Table of Contents:

[Folder Structure](#folder-structure)

[Files](#files)

[Nesting Components](#nesting-components)

[Import Syntax](#import-syntax)

---

## Folder Structure

The basic folder structure of each ducks component folder.

**Pros:** Easy setup, index files always remain the same, file names always remain the same (only exported functions from other files change).

**Cons:** Specifically in Visual Studio, there is no differentiation between same-name open files in the tabs, making it confusing as to which 'action.js' or 'component.jsx' you're working on. This is not an issue if your IDE shows folder path in the open file tabs.

```
ComponentName
├── __test__
├── actiontypes.js
├── actions.js
├── container.jsx
├── component.jsx
├── reducer.js
├── sagas.js
├── style.scss (not discussed)
└── index.js
```

> Note: Situations may arise where more than one component needed by the `container.jsx` file. In situations such as these, the naming of the component files could reflect their function, as they are only imported by t`container.jsx`. However, the `container.jsx` file should maintain its name, as there is only one per component folder, and it is imported by the index file, which should never be changed.

---

## Files

The contents of each file referenced in the folder structure.

### actiontypes.js

> Note: Ducks proposes that your action types should be named based on their position within the project.  
For example, rather than having:  
`export const REDUCER_TYPE_ONE = 'REDUCER_TYPE_ONE'`  
you could have something like:  
`export const REDUCER_TYPE_ONE = 'appname/component/REDUCER_TYPE_ONE'`  
For this proposal, however, I'll keep it simple with the first one. Remember, as long as you reference the actiontype imported from this file whenever you need an action type, you can change the string in this file at any point and it won't break anything.

```javascript
// Reducer action types.
export const REDUCER_TYPE_ONE = 'REDUCER_TYPE_ONE';
export const REDUCER_TYPE_TWO = 'REDUCER_TYPE_TWO';

// Saga action types.
export const SAGA_TYPE_ONE = 'SAGA_TYPE_ONE';
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

Both of these files are as they would be usually, both export default their main class / jsx component. The only difference is that *EVERY* action dispatched *MUST* be created using an action creator imported from './actions' in the following form:

```javascript
import * as a from './actions';

// Your component goes here (export default using connect)

const mapDispatchToProps = dispatch => ({
    actionOne: value => {
        dispatch(a.reducerTypeOne(value)); // action dispatch
    }
});
```

### index.js

This file never changes. Because the file names are always static all imports in this and other files will always remain the same.
> Note: A gotcha is that the `import component` actually imports the container. This is because any references to the component will be to the container, and there may be multiple components referenced by the container, meaning their naming will not be static. As such, we export as component for ease, but import in the index as container. This shouldn't cause any problems as long as you're copying an existing ducks folder as a template and not rewriting it yourself.
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

Depending on your state structure and folder organization methodology, you may choose to nest ducks component folders within eachother. Generally, since `index.js` files serve to bring the individual files to the surface of your folder structure, this will mean the `index.js` file of the parent folder will need to import, and subsequently export the `index.js` default export of the component below. In cases such as these, you will import the child and export it as an element within the default export.

> Note: This is generally not recommended, as it reduces component reusability. The only time you should nest components is if the component is specifically used in the parent component, with no possibility of reuse elsewhere in the application.

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

Examples of how to import the elements of a ducks component folder.

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
