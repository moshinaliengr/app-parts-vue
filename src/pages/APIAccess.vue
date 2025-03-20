<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <div class="text-center full-width q-my-lg">
        <img
          src="../assets/dl-logo.png"
          alt="Diesel Laptops logo"
          style="width: 65%"
        />
      </div>
      <p>
        Diesel Laptops is pleased to announce our brand-new API platform for
        application developers. Our API partners are able to build world-class
        applications that take advantage of our ever-expanding parts and repair
        databases including parts cross, fault codes, component finders, and
        more! To get started building your own applications, fill out the form
        below and a member of our team will reach out to discuss your project.
      </p>
      <form action @submit.prevent="submitRequest" class="q-mb-lg">
        <q-input class="q-mt-lg" v-model="name" label="Name" dense outlined />

        <q-input class="q-my-sm" v-model="email" label="Email" dense outlined />

        <q-input
          class="q-my-sm"
          v-model="company"
          label="Company"
          dense
          outlined
        />

        <q-input class="q-my-sm" v-model="role" label="Role" dense outlined />

        <q-input
          class="q-my-sm"
          v-model="number"
          label="Best Phone Number"
          dense
          outlined
          type="tel"
          mask="(###) ### - ####"
        />
        <div class="q-mb-sm">
          Tell us a little about the application you wish to develop:
        </div>
        <q-input
          class="q-mb-lg"
          v-model="message"
          label="Message:"
          autogrow
          dense
          clearable
          outlined
        />
        <ButtonStandard label="Request API Access" type="submit" />
      </form>
      <!--  -->
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import ButtonStandard from "../components/common/ButtonStandard";

export default {
  name: "ApiAccess",
  components: { ContentCard, ButtonStandard },

  data() {
    return {
      name: "",
      email: "",
      company: "",
      role: "",
      number: "",
      message: "",
      //
    };
  },
};
</script>
