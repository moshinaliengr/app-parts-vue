<template>
  <q-page class="flex flex-center">
    <ContentCard>
      <q-card-section class="text-center">
        <img
          src="../assets/app-logo.png"
          alt="Diesel Laptops logo"
          style="width: 65%"
        />
      </q-card-section>

      <q-card-section>
        <p>
          Diesel Laptops is excited to announce our very own diagnostic
          software, Diesel Explorer! Diesel Explorer is our first comprehensive
          heavy-duty and medium-duty software. So, what's the catch? None!
          Diesel Explorer is completely free for a limited time! Learn more
          about this software in the video below.
        </p>
      </q-card-section>

      <q-card-section>
        <q-video
          :ratio="16 / 9"
          src="https://www.youtube.com/embed/3KNp_9q2YNc"
        />
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Diesel Explorer Capabilities</div>
        <p>
          Diesel Explorer will allow you to read all DTCs and faults from all
          standard vehicle modules including body controller, engine controller,
          transmission controller, and more. In addition, you can view live
          data, trip information, and HD-OBD readiness information. The software
          even has a built-in HTML reporting feature to allow you to do a quick
          check of the vehicle's health.
        </p>
      </q-card-section>

      <q-card-section>
        <div class="text-h6">Available with all RP1210 Devices</div>
        <p>
          We're including Diesel Explorer as a stand-alone digital download and
          as a digital download for any of our bundles including an RP1210
          device. This includes our DieselLink adapter, Nexiq USB Link 2,
          DrewLinQ, and more!
        </p>
      </q-card-section>

      <q-card-section class="no-padding">
        <div class="text-h6">Free for a Limited Time</div>
        <p class="no-padding">
          We're offering the stand-alone Diesel Explorer software free as an
          instant digital download, so hurry up and grab your free download now!
        </p>
      </q-card-section>

      <ButtonStandard
        label="Download Now"
        type="a"
        href="https://www.diesellaptops.com/products/diesel-explorer"
        target="__blank"
        :full="false"
      />
    </ContentCard>
  </q-page>
</template>

<script>
import ContentCard from "../components/common/ContentCard";
import ButtonStandard from "../components/common/ButtonStandard";

export default {
  name: "DieselExplorer",
  components: { ContentCard, ButtonStandard },
};
</script>
