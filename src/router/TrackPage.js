export default async function (to, from, next) {
  analytics.page(`${to.name}`, {
    title: `${to.name}`,
    path: `${to.fullPath}`,
  });
  next();
}
