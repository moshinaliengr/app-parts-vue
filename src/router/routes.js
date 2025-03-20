const routes = [
  {
    path: "/parts-lookup",
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      navBarData: {
        name: "Parts Lookup",
        icon: "fad fa-cogs",
        key: "Parts-Lookup",
      },
    },
    children: [
      {
        path: "exploded-views",
        name: "Exploded Views",
        component: () => import("pages/ExplodedViews.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            name: "Exploded Views",
            icon: "fad fa-chart-bar",
            key: "Exploded-Views",
          },
        },
      },
      {
        path: "component-search",
        name: "Component Search",
        component: () => import("pages/ComponentSearch.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            name: "Component Search",
            icon: "fad fa-bullseye-arrow",
            key: "Component-Search",
          },
        },
      },
      {
        path: "by-measurement",
        name: "By Measurement",
        component: () => import("pages/ByMeasurement.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            name: "By Measurement",
            icon: "fad fa-ruler-combined",
            key: "By-Measurement",
          },
        },
      },
      {
        path: "whatdoesitfit",
        name: "What Does It Fit",
        component: () => import("pages/WhatDoesItFit.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            name: "What Does It Fit",
            icon: "fad fa-question-circle",
            key: "What-Does-It-Fit",
          },
        },
      },
      {
        path: "used",
        name: "Used",
        component: () => import("pages/UsedComponents.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            name: "Used Components",
            icon: "fad fa-recycle",
            key: "Used-Components",
          },
        },
      },
    ],
  },
  {
    path: "/",
    component: () => import("layouts/MainLayout.vue"),
    redirect: { name: "home" },
    children: [
      {
        path: "parts-cross",
        name: "parts-cross",
        component: () => import("pages/PartsCross.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            title: "Parts Cross Reference",
            icon: "fad fa-code",
            key: "Parts-Cross",
          },
        },
      },
      {
        path: "login",
        name: "login",
        component: () => import("pages/Login.vue"),
      },
      {
        path: "account",
        name: "account",
        component: () => import("pages/Account.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "advanced-tools",
        name: "advanced-tools",
        component: () => import("pages/AdvancedTools.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            title: "Advanced Tools",
            icon: "fad fa-tools",
            key: "Advanced-Tools",
          },
        },
      },
      {
        path: "bookmarks",
        name: "bookmarks",
        component: () => import("pages/Bookmarks"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "faq",
        name: "faq",
        component: () => import("pages/FAQ.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "home",
        name: "home",
        component: () => import("pages/Home.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "manufacturers",
        name: "manufacturers",
        component: () => import("pages/Manufacturers.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            title: "Manufacturers",
            icon: "fad fa-industry-alt",
            key: "Manufacturers",
          },
        },
      },
      {
        path: "register",
        name: "register",
        component: () => import("pages/Register.vue"),
      },
      {
        path: "resetPassword",
        name: "resetPassword",
        component: () => import("pages/ResetPassword.vue"),
      },
      {
        path: "shopping",
        name: "shopping",
        component: () => import("pages/Shopping.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            title: "Shopping List",
            icon: "fad fa-cart-arrow-down",
            key: "shopping-list",
          },
        },
      },
      {
        path: "cart",
        name: "shopping-cart",
        component: () => import("pages/ShoppingCart.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            title: "Shopping Cart",
            image: require("../assets/cart-icon.png"),
            key: "shopping-cart",
          },
        },
      },
      {
        path: "order",
        name: "order-history",
        component: () => import("pages/OrderHistory.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            title: "Order History",
            icon: "fad fa-history",
            key: "shopping-cart",
          },
        },
      },
      {
        path: "opticat-request-tracking",
        name: "opticat-request-tracking",
        component: () => import("pages/OpticatRequestTracking.vue"),
        meta: {
          requiresAuth: true
        }
      },
      {
        path: "order/:cartId",
        name: "order-single",
        component: () => import("pages/ShoppingCart.vue"),
        meta: {
          requiresAuth: true,
        },
      },
      {
        path: "find-my-filter",
        name: "find-my-filter",
        component: () => import("pages/FindMyFilter.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            title: "Find My Filter",
            icon: "fad fa-search",
            key: "Find-My-Filter",
          },
        },
      },
      {
        path: "vin-decoder",
        name: "vin-decoder",
        component: () => import("pages/VinDecoder.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            title: "VIN Decoder",
            icon: "fad fa-truck",
            key: "Vin-Decoder",
          },
        },
      },
      {
        path: "diesel-dictionary",
        name: "diesel dictionary",
        component: () => import("pages/DieselDictionary.vue"),
        meta: {
          requiresAuth: true,
          navBarData: {
            title: "Diesel Dictionary",
            image: require("../assets/dictionary-icon.png"),
            key: "Diesel-Dictionary",
          },
        },
      },
    ],
  },

  {
    path: "/more-information", // Done
    component: () => import("layouts/MainLayout.vue"),
    meta: {
      navBarData: {
        name: "More Information",
        icon: "fad fa-info-square",
        key: "More-Information",
      },
    },
    children: [
      {
        path: "diesel-explorer", // Do
        name: "Diesel Explorer",
        component: () => import("pages/DieselExplorer"),
        meta: {
          requiresAuth: true,
          navBarData: {
            name: "Diesel Explorer",
            icon: "fad fa-laptop",
            key: "Diesel-Explorer",
          },
        },
      },
      {
        path: "api-access", // Done
        name: "API Access",
        component: () => import("pages/APIAccess"),
        meta: {
          requiresAuth: true,
          navBarData: {
            name: "API Access",
            icon: "fad fa-code-merge",
            key: "Api-Access",
          },
        },
      },
    ],
  },
  // Always leave this as last one,
  // but you can also remove it
  {
    name: "404",
    path: "*",
    component: () => import("pages/Error404.vue"),
  },
];

export default routes;
