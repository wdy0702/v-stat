# v-stat

A vue directive for front-end user behaviour tracking.

## Install

```bash
npm install v-stat -S
```

## Docs

### Directive Format

> v-stat:[event]="{target:[my_target], page:[my_page], info:[my_info]}"

### Supported Events

| event  | fired when             | html tag examples  |
| ------ | ---------------------- | ------------------ |
| ready  | directive is bounded   | div                |
| click  | dom click event        | el-button          |
| enter  | ENTER key is down      | el-input           |
| select | vnode is changed       | el-select          |
| typing | vnode is changed       | el-input           |
| check  | vnode is changed       | el-table selection |
| exit   | directive is unbounded | div                |

### Modifiers

| modifier | example         | meaning                                                              |
| -------- | --------------- | -------------------------------------------------------------------- |
| target   | 'submit_button' | the name of html element that produces events                        |
| page     | 'home_page'     | the name of current page                                             |
| info     | 'current_title' | the name of data from VueComponent, accessible by this.current_title |

## Usage

### declare v-stat directive in main.js

```js
// import module
import stat from 'v-stat'

// consumer function
const send = msg => $http.post('/stat', msg).then(res => res.data)

// auxiliary values that are carried with msg
const aux = {userid:'wzy816'}

// register custom directive
Vue.directive('stat', stat(send,aux))
```

### examples

1.  capture page reload

```html
<template>
  <div
    v-stat:ready="{target:'my_page', page:'my_page'}">
    ...
  </div>
</template>
```

2.  capture simple button click event

```html
<el-button
  v-stat:click="{target:'my_button', page: 'my_btn_page'}"
  @click="my_click()">
</el-button>
```

3.  capture dropdown list selection and its value

```html
<!--
After selection is done, will call like
  send({
    event: 'select'
    target: 'my_select',
    info: this.my_select_page
    page: 'my_select_page',
    timestamp: Date.now(),
    userid:'wzy816'
  })
-->
<el-select
  v-stat:select="{target:'my_select', info:'current_selection', page: 'my_select_page'}"
  v-model="current_selection"
  @change="onChangeHandler">
  ...
</el-select>
```

4.  capture input value when hit ENTER key

```html
<el-input
  v-stat:enter="{target:'my_input', info:'my_input_value', page: 'my_input_page'}"
  v-model="my_input_value"
  @change="onChangeHandler"
  placeholder="DEFAULT">
  ...
</el-input>
```

5.  capture input change and its value while typing

```html
<el-input
  v-stat:typing="{target:'my_input', info:'current_input', page: 'my_input_page'}"
  v-model="current_input"
  @change="onChangeHandler"
  placeholder="DEFAULT">
  ...
</el-input>
```

6.  capture page exit

```html
<template>
  <div v-stat:exit="{target:'my_page', page:'my_page'}">
    ...
  </div>
</template>
```

7.  capture both ready and exit events

```html
<template>
  <div v-stat:ready&exit="{target:'my_page', page:'my_page'}">
    ...
  </div>
</template>
```
