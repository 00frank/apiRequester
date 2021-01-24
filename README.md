<h1 align="center">apiRequester</h1>

<p align="center">
    <img src="https://img.shields.io/static/v1?label=version&message=1.0.0&color=brightgreen">
    <img src="https://img.shields.io/static/v1?label=modificable&message=yes&color=blue">
  <a href="https://npmjs.org/package/enquirer">
    <img src="https://img.shields.io/static/v1?label=CLI%20prompt&message=enquirer&color=brightgreen">
  </a>
</p>

<br>
<br>

<p align="center">
  <b>Un CLI capaz de hacer peticiones a una API que devuelve datos sobre Articulos, Slides, e Imagenes de galeria</b><br>
  <sub>>_ En inglés, command-line interface, CLI, es un método que permite a los usuarios dar instrucciones a un programa por medio de comandos simples▌</sub>
</p>

<br>

<p align="center">
  <sub>(Ejemplo de peticiones al modelo <a href="#slider">Slider</a>)</a></sub>
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/survey-prompt.gif" alt="Enquirer Survey Prompt" width="750"><br>
</p>

<br>
<br>

Creado por [00frank][00frank], Enquirer is fast, easy to use, and lightweight enough for small projects, while also being powerful and customizable enough for the most advanced use cases.

- **Fast** - [Loads in ~4ms](#-performance) (that's about _3-4 times faster than a [single frame of a HD movie](http://www.endmemo.com/sconvert/framespersecondframespermillisecond.php) at 60fps_)
- **Lightweight** - Only one dependency, the excellent [ansi-colors](https://github.com/doowb/ansi-colors) by [Brian Woodward](https://github.com/doowb).
- **Well tested** - All prompts are well-tested, and tests are easy to create without having to use brittle, hacky solutions to spy on prompts or "inject" values.
- **Examples** - There are numerous [examples](examples) available to help you get started.
<br>

## ❯ Getting started

Get started with Enquirer, the most powerful and easy-to-use Node.js library for creating interactive CLI prompts. 

- [Install](#-install)
- [Usage](#-usage)
- [Enquirer](#-enquirer)
- [Prompts](#-prompts)
  * [Built-in Prompts](#built-in-prompts)
  * [Custom Prompts](#-custom-prompts)
- [Key Bindings](#-key-bindings)

<br>

## ❯ Install
Install with [npm](https://www.npmjs.com/):

```sh
$ npm install enquirer --save
```
Install with [yarn](https://yarnpkg.com/en/):

```sh
$ yarn add enquirer
```

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/npm-install.gif" alt="Install Enquirer with NPM" width="750">
</p>

_(Requires Node.js 8.6 or higher. Please let us know if you need support for an earlier version by creating an [issue](../../issues/new).)_

<br>

## ❯ Usage
### Single prompt

The easiest way to get started with enquirer is to pass a [question object](#prompt-options) to the `prompt` method.

```js
const { prompt } = require('enquirer');

const response = await prompt({
  type: 'input',
  name: 'username',
  message: 'What is your username?'
});

console.log(response); // { username: 'jonschlinkert' }
```

_(Examples with `await` need to be run inside an `async` function)_

### Multiple prompts

Pass an array of ["question" objects](#prompt-options) to run a series of prompts.

```js
const response = await prompt([
  {
    type: 'input',
    name: 'name',
    message: 'What is your name?'
  },
  {
    type: 'input',
    name: 'username',
    message: 'What is your username?'
  }
]);

console.log(response); // { name: 'Edward Chan', username: 'edwardmchan' }
```

### List Prompt

Prompt that returns a list of values, created by splitting the user input. The default split character is `,` with optional trailing whitespace.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/list-prompt.gif" alt="Enquirer List Prompt" width="750">
</p>

**Example Usage**

```js
const { List } = require('enquirer');
const prompt = new List({
  name: 'keywords',
  message: 'Type comma-separated keywords'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```
***

### MultiSelect Prompt

Prompt that allows the user to select multiple items from a list of options.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/multiselect-prompt.gif" alt="Enquirer MultiSelect Prompt" width="750">
</p>

**Example Usage**

```js
const { MultiSelect } = require('enquirer');

const prompt = new MultiSelect({
  name: 'value',
  message: 'Pick your favorite colors',
  limit: 7,
  choices: [
    { name: 'aqua', value: '#00ffff' },
    { name: 'black', value: '#000000' },
    { name: 'blue', value: '#0000ff' },
    { name: 'fuchsia', value: '#ff00ff' },
    { name: 'gray', value: '#808080' },
    { name: 'green', value: '#008000' },
    { name: 'lime', value: '#00ff00' },
    { name: 'maroon', value: '#800000' },
    { name: 'navy', value: '#000080' },
    { name: 'olive', value: '#808000' },
    { name: 'purple', value: '#800080' },
    { name: 'red', value: '#ff0000' },
    { name: 'silver', value: '#c0c0c0' },
    { name: 'teal', value: '#008080' },
    { name: 'white', value: '#ffffff' },
    { name: 'yellow', value: '#ffff00' }
  ]
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);

// Answer: ['aqua', 'blue', 'fuchsia']
```

***

### Numeral Prompt

Prompt that takes a number as input.

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/numeral-prompt.gif" alt="Enquirer Numeral Prompt" width="750">
</p>

**Example Usage**

```js
const { NumberPrompt } = require('enquirer');

const prompt = new NumberPrompt({
  name: 'number',
  message: 'Please enter a number'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

***

### Password Prompt

Prompt that takes user input and masks it in the terminal. Also see the [invisible prompt](#invisible-prompt)

<p align="center">
  <img src="https://raw.githubusercontent.com/enquirer/enquirer/master/media/password-prompt.gif" alt="Enquirer Password Prompt" width="750">
</p>

**Example Usage**

```js
const { Password } = require('enquirer');

const prompt = new Password({
  name: 'password',
  message: 'What is your password?'
});

prompt.run()
  .then(answer => console.log('Answer:', answer))
  .catch(console.error);
```

***

### Quiz Prompt

Prompt that allows the user to play multiple-choice quiz questions.

<p align="center">
  <img src="https://user-images.githubusercontent.com/13731210/61567561-891d4780-aa6f-11e9-9b09-3d504abd24ed.gif" alt="Enquirer Quiz Prompt" width="750">
</p>

**Example Usage**

```js
const { Quiz } = require('enquirer');

 const prompt = new Quiz({
  name: 'countries',
  message: 'How many countries are there in the world?',
  choices: ['165', '175', '185', '195', '205'],
  correctChoice: 3
});

 prompt
  .run()
  .then(answer => {
    if (answer.correct) {
      console.log('Correct!');
    } else {
      console.log(`Wrong! Correct answer is ${answer.correctAnswer}`);
    }
  })
  .catch(console.error);
```

**Quiz Options**

| Option         | Type        | Required    | Description                                                                                                  |
| -----------    | ----------  | ----------  | ------------------------------------------------------------------------------------------------------------ |
| `choices`      | `array`     | Yes         | The list of possible answers to the quiz question.                                                           |
| `correctChoice`| `number`    | Yes         | Index of the correct choice from the `choices` array.                                                        |

**↑ back to:** [Getting Started](#-getting-started) · [Prompts](#-prompts)

***

#### Choice properties

The following properties are supported on `choice` objects.

| **Option**  | **Type**          | **Description**                                                                                                                                                                                     |
| ----------- | ----------------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `name`      | `string`          | The unique key to identify a choice                                                                                                                                                                 |
| `message`   | `string`          | The message to display in the terminal. `name` is used when this is undefined.                                                                                                                      |
| `value`     | `string`          | Value to associate with the choice. Useful for creating key-value pairs from user choices. `name` is used when this is undefined.                                                                   |
| `choices`   | `array`           | Array of "child" choices.                                                                                                                                                                           |
| `hint`      | `string`          | Help message to display next to a choice.                                                                                                                                                           |
| `role`      | `string`          | Determines how the choice will be displayed. Currently the only role supported is `separator`. Additional roles may be added in the future (like `heading`, etc). Please create a [feature request] |
| `enabled`   | `boolean`         | Enabled a choice by default. This is only supported when `options.multiple` is true or on prompts that support multiple choices, like [MultiSelect](#-multiselect).                                 |
| `disabled`  | `boolean\|string`  | Disable a choice so that it cannot be selected. This value may either be `true`, `false`, or a message to display.                                                                                  |
| `indicator` | `string\|function` | Custom indicator to render for a choice (like a check or radio button).                                                                                                                             |


***

## ❯ Key Bindings

### Move/lock Pointer

| **command**                        | **description**                                                                                                      |
| ---------------------------------- | -------------------------------------------------------------------------------------------------------------------- |
| <kbd>number</kbd>                  | Move the pointer to the choice at the given index. Also toggles the selected choice when `options.multiple` is true. |
| <kbd>up</kbd>                      | Move the pointer up.                                                                                                 |
| <kbd>down</kbd>                    | Move the pointer down.                                                                                               |
| <kbd>ctrl</kbd> + <kbd>a</kbd>     | Move the pointer to the first _visible_ choice.                                                                      |
| <kbd>ctrl</kbd> + <kbd>e</kbd>     | Move the pointer to the last _visible_ choice.                                                                       |
| <kbd>shift</kbd> + <kbd>up</kbd>   | Scroll up one choice without changing pointer position (locks the pointer while scrolling).                          |
| <kbd>shift</kbd> + <kbd>down</kbd> | Scroll down one choice without changing pointer position (locks the pointer while scrolling).                        |

<br>

| **command (Mac)**                | **command (Windows)** | **description**                                            |
| -------------------------------- | --------------------- | ---------------------------------------------------------- |
| <kbd>fn</kbd> + <kbd>left</kbd>  | <kbd>home</kbd>       | Move the pointer to the first choice in the choices array. |
| <kbd>fn</kbd> + <kbd>right</kbd> | <kbd>end</kbd>        | Move the pointer to the last choice in the choices array.  |

<br>


## ❯ About

<details>
<summary><strong>Contributing</strong></summary>

Pull requests and stars are always welcome. For bugs and feature requests, [please create an issue](../../issues/new).

### Todo

We're currently working on documentation for the following items. Please star and watch the repository for updates!
* [x] Customizing symbols
* [ ] Customizing styles (palette)
* [ ] Customizing rendered input
* [ ] Customizing returned values
* [ ] Customizing key bindings
* [ ] Question validation
* [ ] Choice validation
* [ ] Skipping questions
* [ ] Async choices
* [ ] Async timers: loaders, spinners and other animations
* [ ] Links to examples
</details>

#### Autor

**Frank Garcia**

* [GitHub Profile](https://github.com/jonschlinkert)
* [Twitter Profile](https://twitter.com/jonschlinkert)
* [LinkedIn Profile](https://linkedin.com/in/jonschlinkert)

[00frank]: https://github.com/00frank