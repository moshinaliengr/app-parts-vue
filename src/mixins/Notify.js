// Provides the user notifications
// Color is automatically passed, as that is a CSS color variable
export const Notify = {
  methods: {
    notify(message, color) {
      this.$q.notify({
        message: message,
        color: color,
        icon: color === "positive" ? "check_circle_outline" : "warning",
        position: "top",
        timeout: 1500
      });
    }
  }
};
