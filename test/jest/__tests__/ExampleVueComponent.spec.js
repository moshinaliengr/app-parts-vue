import { mount, shallowMount } from "@vue/test-utils";
import ExampleVueComponent from "src/components/ExampleVueComponent.vue";

describe("ExampleVueComponent.vue", () => {
  test("renders a component using the mount utility method", () => {
    const wrapper = mount(ExampleVueComponent);
    // debugger;
    expect(wrapper.text()).toContain("Vue");
  });

  test("renders a component using the shallowMount utility method", () => {
    const wrapper = shallowMount(ExampleVueComponent);
    // console.log(wrapper.html()); // Uncomment this line to see an example stubbed component using shallowMount
    expect(wrapper.text()).toContain("Vue");
  });
});
