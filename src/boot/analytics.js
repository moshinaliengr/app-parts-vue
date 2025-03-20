export default async ({ router }) => {
  router.beforeEach(async (to, from, next) => {
    // window.dataLayer = window.dataLayer || [];

    // Push route change
    window.dataLayer.push({
      event: "Pageview",
      pagePath: to.path,
      pageTitle: to.path.replace("/", ""),
    });

    // Continue navigation
    next();
  });
};
