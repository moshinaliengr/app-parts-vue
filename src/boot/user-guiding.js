// import something here

// "async" is optional;
// more info on params: https://quasar.dev/quasar-cli/boot-files
import { request } from "src/store/user/actions";
import { Cookies } from "quasar";
import Store from "src/store";
export default async (/* { app, router, Vue ... } */) => {
  !(await (async function (g, u, i, d, e, s) {
    g[e] = g[e] || [];
    var f = u.getElementsByTagName(i)[0];
    var k = u.createElement(i);
    k.async = true;
    k.src =
      "https://static.userguiding.com/media/user-guiding-" + s + "-embedded.js";
    f.parentNode.insertBefore(k, f);
    if (g[d]) return;
    var ug = (g[d] = { q: [] });
    ug.c = function (n) {
      return function () {
        ug.q.push([n, arguments]);
      };
    };
    var m = [
      "previewGuide",
      "finishPreview",
      "track",
      "identify",
      "triggerNps",
      "hideChecklist",
      "launchChecklist",
    ];
    for (var j = 0; j < m.length; j += 1) {
      ug[m[j]] = ug.c(m[j]);
    }
  })(
    window,
    document,
    "script",
    "userGuiding",
    "userGuidingLayer",
    process.env.USER_GUIDING_ID
  ));
  try {
    let payload = Cookies.get("remember");

    const response = await Store.dispatch("user/request", {
      type: "cookie_login",
      payload: payload,
    });
    if (response?.data?.data.information?.id) {
      window.userGuiding.identify(response?.data?.data.information?.id);
    }
  } catch (e) {
    console.log(e);
  }
};
