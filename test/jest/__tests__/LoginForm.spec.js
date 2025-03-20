import { mountQuasar } from "@quasar/quasar-app-extension-testing-unit-jest";
import LoginForm from "src/components/layout/LoginForm.vue";
import { QForm, QInput, QIcon, QBtn } from "quasar";
import flushPromises from "flush-promises";

const mockStore = { dispatch: jest.fn(() => ({ authorization: true })) };
const wrapper = mountQuasar(LoginForm, {
  quasar: {
    components: {
      QForm,
      QInput,
      QIcon,
      QBtn,
    },
  },
  mount: {
    type: "full",
    mocks: {
      $store: mockStore,
    },
  },
});

describe("LoginForm.vue", () => {
  it("Emits an event if the user is successfully authenticated via user/login store action", async () => {
    // Simulate user email input
    await wrapper.find("[data-email]").setValue("admin@email.com");

    // Simulate user password input
    await wrapper.find("[data-password]").setValue("password");

    // Simulate user form submission
    await wrapper.trigger("submit");

    // Resolve all pending promises
    await flushPromises();

    expect(mockStore.dispatch).toHaveBeenCalledWith("user/login", {
      email: "admin@email.com",
      password: "password",
    });

    expect(wrapper.emitted().authenticated).toBeTruthy();
  });
});
