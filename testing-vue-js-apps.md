# Unit testing components

Deciding what unit tests to write is important. If you wrote tests for every property of a component, you would slow development and create an inefficient test suite.
One method for deciding what parts of a component should be tested is to use the concept of a component contract.

## Component Contracts

The agreement between a component and the rest of the application.

- Other components can assume the component will fulfill its contractual agreement and produce the agreed output if it’s provided the correct input.
- A good component unit test should always trigger an input and assert that the component generates the correct output
- Tests should be written from the perspective of a developer who’s using the component but is unaware of how the component functionality is implemented.

## TDD

- Red
  - Write a test that fails **for the correct reason**
- Green
- Refactor

## Organizing tests with the describe function

The describe function defines a unit suite as a test suite.

```js
describe("Item.vue", () => {
  test("sanity test", () => {
    expect(true).toBe(true);
  });
});
```

Careful not to overuse the describe function, usually it's unnecessary detail that can be refactored to a single test with a well written test name.

### Nested describe functions

```js
describe("/api/apis", () => {
  describe("error response", () => {
    describe("with 500", () => {
      test("throws 500", () => {
        // test
      });
    });
  });
});
```

### Flattened describe function

```js
describe("/api/apis", () => {
  test("throws error when server responds with 500", () => {
    // test
  });
});
```

## Unit testing a component

In most JS projects functions are the units, but in Vue apps, components are testable units too

### Mounting a component

When you import a Vue component, it's just an object (or function) with a render function and some properties.

- In order to test the component correctly you need to switch it on and start the render process
- Jest runs tests in a browser environment created with a library called jsdom
  - Using jsdom instead of a real browser makes the tests run a lot faster
  - jsdom implements **most** of the DOM API, but some methods are n/a

**The Quasar app extension "quasar-app-extension-testing-unit-jest" provides the "mountQuasar" and "mountFactory" methods, along with several other utility methods which handle configuration details, making unit testing with Jest and Quasar easier**

## Vue Test Utils

VTU makes unit testing Vue components easier. It contains helper methods which:

- Mount components
- Interact with components
- Assert component output

## Example Unit Test with Quasar

```js
// Item.vue
<template>
  <div>My item component</div>
</template>

<script>
export default {
  name: "Item",
  data() {
    return {};
  },
};
</script>
```

```js
// Item.spec.js
import { mountQuasar } from "@quasar/quasar-app-extension-testing-unit-jest";
import Item from "src/components/Item.vue";

describe("Item.vue", () => {
  test("renders item", () => {
    const wrapper = mountQuasar(Item);
    expect(wrapper.text()).toContain("item");
  });
});
```

The wrapper returned by mountQuasar contains the Vue instance as well helper methods, such as "text()", which can be used to:

- Set props
- Check instance properties
- Perform actions on the instance

The mount (vtu) and mountQuasar (quasar) methods work really well on small components. However, with more complicated components, such as those wich render other components, you'll need to learn about shallow mount.

## Using shallowMount

Like mount, shallowMount mounts a component and returns a wrapper containing the mounted component. The difference is that shallowMount stubs all the children of a component before it mounts it. Shallow mounting:

- Assures you test a component in isolation
  - Avoiding confusing results when a child components rendered output is picked up by your test

**Note: !!Quasar components are shallow mounted by default!!**

## Testing Rendered Component Output

Testing is about input and output. In a test you supply an input, receive an output, and assert that the output is correct. The most common output of components is the rendered output—the stuff that render functions generate.

### Creating test specifications

You shouldn't write tests until you've got the specifications. Consider the following process:

- Agree on requirements.
- Answer questions on details to get high-level specifications and design.
- Break up design into components.
- Write component-level specifications

#### High-level specifications

Requirements - Fuzzy descriptions of an application from a user perspective.

**Example:**

**Login Page Requirements:**

- Create a login page

**High-level specs:**

- Create a login form to display on the page
- Using the input user credential data, attempt to authenticate the user
- If user is authenticated, navigate to home page
- If user is unauthenticated, display an error message

### Creating component-level specifications

- When you have high-level specifications for an application, you need to think about how you're going to implement them.

  - With Vue apps, that involves deciding how to represent UI elements as components.

- The login page will be responsible for

  - Rendering a login form
  - Notifying the user of login success/failures
  - Navigating to the home page;

- The LoginForm component will be responsible for
  - Accepting user input
    - email input
    - password input
  - Submitting the user input for authentication
    - Submit Button
  - Notifying the login page with the response
    - emit event

### Testing Rendered Text
