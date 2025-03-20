<template>
  <q-page class="flex flex-center">
    <q-card style="width: 90%; height: 85%">
      <q-card-section class="row">
        <q-select
          v-model="category"
          label="Select"
          :options="categories"
          class="q-pa-xs col-6"
          outlined
          dense
        />
        <q-select
          v-model="make"
          label="Select"
          :options="makes"
          class="q-pa-xs col-6"
          outlined
          dense
        />
      </q-card-section>
      <iframe
        v-if="url.length"
        :src="url"
        title="Used Engines"
        style="height: 62vh; width: 100%"
      ></iframe>
      <q-card-section v-else class="text-center q-mt-xl">
        Select a component type and your desired manufacturer.
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
export default {
  name: `UsedComponents`,

  data: () => ({
    baseURL:
      process.env.TRUCK_PARTS_INVENTORY_SERVICE_BASE_URL ||
      "https://truckpartsinventory.com",
    url: "",
    category: "",
    make: "",
    categories: ["Used Engine", "Used Transmission"],
    makes: [],
    usedEngines: [
      { name: "Caterpillar", url: "caterpillar" },
      {
        name: "Cummins",
        url: "cummins",
      },
      {
        name: "Detroit",
        url: "detroit",
      },
      {
        name: "International",
        url: "international",
      },
      {
        name: "Isuzu",
        url: "isuzu",
      },
      {
        name: "Mack",
        url: "mack",
      },
      {
        name: "PACCAR",
        url: "paccar",
      },
      {
        name: "Volvo",
        url: "volvo",
      },
    ],
    usedTransmissions: [
      { name: "Allison", url: "allison" },
      {
        name: "Eaton-Fuller",
        url: "",
      },
      {
        name: "Detroit",
        url: "",
      },
      {
        name: "Meritor-Rockwell",
        url: "",
      },
      {
        name: "Spicer-TTC",
        url: "",
      },
    ],
  }),
  watch: {
    category: function () {
      this.url = "";
      if (this.category == "Used Engine") {
        this.makes = this.usedEngines.map((m) => m.name);
      } else {
        this.makes = this.usedTransmissions.map((m) => m.name);
      }
    },
    make: function () {
      if (this.category == "Used Engine") {
        this.url =
          this.baseURL +
          "/engine-assys-" +
          this.make +
          "-parts?tpipartnerid=18&nonav=true?f-condition=Used&rt=nf";
      } else {
        this.url =
          this.baseURL +
          "/transmission-assys-" +
          this.make +
          "-parts?tpipartnerid=18&nonav=true?f-condition=Used&rt=nf";
      }
    },
  },
};
</script>
