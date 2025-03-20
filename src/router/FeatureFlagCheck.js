import $ld from "src/boot/launchdarkly.js";

export default async function (to, from, next) {
  // does route we're going to have a key?
  // check if key is enabled
  // continue to next route
  // if not, redirect to maintenance page

  // if route we are going to does not have a key
  // continue to said route

  if (to.meta?.navBarData?.key) {
    if ($ld.flags[to.meta.navBarData.key]) {
      return next();
    } else {
      return next({ name: "404" });
    }
  }
  return next();
}


