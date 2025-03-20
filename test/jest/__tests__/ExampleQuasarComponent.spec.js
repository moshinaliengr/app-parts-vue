import { mountQuasar } from "@quasar/quasar-app-extension-testing-unit-jest";
import ExampleQuasarComponent from "src/components/ExampleQuasarComponent.vue";
import ExampleQuasarChildComponent from "src/components/ExampleQuasarChildComponent.vue";
import { QCard, QCardSection } from "quasar";

describe("ExampleQuasarComponent.vue", () => {
  test("renders a quasar component using the mountQuasar utility method", () => {
    const wrapper = mountQuasar(ExampleQuasarComponent, {
      quasar: {
        components: {
          QCard,
        },
      },
    });
    debugger;
    expect(wrapper.text()).toContain("Quasar");
  });

  //   test("renders a component with a nested stubbed quasar component using the default shallow mount", () => {
  //     const wrapper = mountQuasar(ExampleQuasarComponent, {
  //       quasar: {
  //         components: {
  //           QCard,
  //         },
  //       },
  //       mount: {
  //         type: "shallow",
  //       },
  //     });
  //     console.log(wrapper.html()); // Uncomment this line to see an example stubbed Quasar component
  //     expect(wrapper.text()).toContain("Quasar");
  //   });
});
