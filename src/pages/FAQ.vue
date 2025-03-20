<template>
  <q-page class="flex flex-center">
    <ContentCard
      ><q-card-section class="text-center"
        ><img
          src="../assets/app-logo.png"
          alt="Diesel Laptops logo"
          style="width: 65%"
        />
        <p class="text-h4 q-mt-lg">Frequently Asked Questions</p>
      </q-card-section>
      <q-list>
        <q-item v-for="question in questions" :key="question.answer">
          <q-item-section>
            <div class="text-h6">{{ question.question }}</div>

            <p>{{ question.answer }}</p>
            <q-separator inset class="" />
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section
            ><div class="text-h6">Can't find what you're looking for?</div>

            <div class="row full-width flex justify-start">
              <ButtonStandard
                label="Contact our Support Team"
                type="a"
                href="https://www.diesellaptops.com/pages/support"
                target="__blank"
                class="q-pa-xs"
                :full="false"
              />
            </div>
          </q-item-section>
        </q-item>
      </q-list>
      <!--  -->
    </ContentCard>
  </q-page>
</template>

<script>
import ButtonStandard from "../components/common/ButtonStandard";
import ContentCard from "../components/common/ContentCard";

export default {
  name: "FAQ",
  components: { ButtonStandard, ContentCard },

  data() {
    return {
      //
      questions: [
        {
          question:
            "What information do I need to provide when creating a free account?",
          answer:
            "When you set up your free account, we ask for an email address, first name, last name, and the role you have at your company.",
        },
        {
          question: "How do I get technical help?",
          answer:
            "We have conveniently placed technical support links in many places so that you can easily communicate with our technical support team.",
        },
        {
          question:
            "Is the platform completely free or are you going to start charging me money to use it later on?",
          answer:
            "The parts cross-reference tool will remain free forever. The part lookup features will remain free for the foreseeable future. We have advanced tools which are part of the paid part of the platform.",
        },
        {
          question: "Will the VIN decoder provide me with the parts I need?",
          answer:
            "No. The vin decoder will provide detailed information about the Year/Make/Model, Cab Type, Engine Model, and Basic Chassis and Driveline.",
        },
        {
          question: "How do you find parts without a VIN?",
          answer:
            "We have four ways to lookup parts on this platform. Exploded Views, Component Search, By Measurement, and Used Parts. We have a dedicated parts team who are building the cross-reference database, digital parts catalogs, and a partnership that allows us to access a nationwide database of recycled parts.",
        },
        {
          question:
            "Why aren’t all commercial truck models covered in Exploded Views?",
          answer:
            "No one currently provides a commercial truck parts lookup that is independent of the VIN. Currently, we are focused on providing our customers with the most common North American manufactured trucks between 2010 and 2016.",
        },
        {
          question: "When are you going to have everything in Exploded Views?",
          answer:
            "Currently we have approximately 50% of the modules completed for the most common North American manufactured trucks between 2010 and 2016. We anticipate completing this task by the end of 2021.",
        },
        {
          question:
            "Is there anything users of the platform can do to help speed up the process?",
          answer:
            "Yes! Please use the conveniently placed feedback request links to help us understand what you couldn’t find, what product lines are important to you, and any other information we might add. We use all customer feedback to add new parts/modules and improve our site.",
        },
        {
          question: "Can you buy parts directly on Diesel Parts?",
          answer:
            "Not at this time. Currently we are focused on providing you with reliable parts information. In the future, we hope to work with fulfillment partners and allow you to purchase parts directly inside the platform.",
        },
      ],
    };
  },
};
</script>
