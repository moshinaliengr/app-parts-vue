<template>
  <q-page class="flex flex-center">
    <q-card style="max-width: 768px; width: 85%">
      <q-card-section class="q-px-xl">
        <p class="text-h6 card-title">Register</p>
        <form action @submit.prevent="validateForm">
          <q-card-section class="no-padding">
            When you register, you'll receive a verification email from
            no-reply@diesellaptops.com. If you don't see the email, please check
            your Spam or Trash folders. Thank you!
          </q-card-section>

          <q-input label="Email Address" v-model="email" dense outlined />

          <q-input label="First Name" v-model="firstName" dense outlined />

          <q-input label="Last Name" v-model="lastName" dense outlined />

          <q-input label="Role" v-model="role" dense outlined />

          <q-input
            v-model="password"
            :type="hidden ? 'password' : 'text'"
            label="Password"
            autocomplete="password"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon
                :name="hidden ? 'visibility_off' : 'visibility'"
                @click="hidden = !hidden"
              />
            </template>
          </q-input>

          <q-input
            v-model="verify"
            :type="hidden ? 'password' : 'text'"
            label="Verify Password"
            autocomplete="password"
            outlined
            dense
          >
            <template v-slot:append>
              <q-icon
                :name="hidden ? 'visibility_off' : 'visibility'"
                @click="hidden = !hidden"
              />
            </template>
          </q-input>

          <ButtonStandard
            label="Register"
            type="submit"
            :loading="loading"
            class="q-mt-sm q-mb-md"
          />
        </form>

        <q-dialog
          full-width
          v-model="verifyUser"
          transition-show="slide-up"
          transition-hide="slide-down"
          class="q-px-none flex flex-center"
          persistent
          no-esc-dismiss
        >
          <VerifyUserModal :email="email" :password="password" />
        </q-dialog>

        <q-dialog
          v-model="eulaModal"
          transition-show="scale"
          transition-hide="scale"
          class="text-center"
          full-width
          full-height
        >
          <modal-content title="End-User License Agreement">
            <q-card class="q-ma-md">
              <q-card-section>
                <p>Last updated: June 22, 2021</p>
                <p>
                  Please read this End-User License Agreement ("Agreement")
                  carefully before clicking the "I Agree" button, accessing or
                  using Diesel Parts (the "Application").
                </p>
                <p>
                  By clicking the "I Agree" button, accessing or using the
                  Application, you are agreeing to be bound by the terms and
                  conditions of this Agreement.
                </p>

                <div class="text-h6">License</div>

                <p>
                  Diesel Laptops, LLC grants you a revocable, non-exclusive,
                  non-transferable, limited license to access and use the
                  Application strictly in accordance with the terms of this
                  Agreement.
                </p>

                <div class="text-h6">Restrictions</div>

                <p>You agree not to, and you will not permit others to:</p>
                <ol>
                  <li>
                    License, sell, rent, lease, assign, distribute, transmit,
                    host, outsource, disclose or otherwise commercially exploit
                    the Application or make the Application available to any
                    third party.
                  </li>
                  <li>
                    Provide any other person including any employee or
                    subcontractor, with access to or use of the Application
                    without obtaining an appropriate License and remitting any
                    applicable License fees.
                  </li>
                  <li>
                    Modify, translate, adapt or otherwise create derivative
                    works or improvements, whether or not patentable, of the
                    Application.
                  </li>
                  <li>
                    Reverse engineer, disassemble, decompile, decode, or
                    otherwise attempt to derive or gain access to the source
                    code of the Application or any part thereof.
                  </li>
                  <li>
                    Remove, delete, alter or obscure any trademarks or any
                    copyright, trademark, patent, or other intellectual property
                    or proprietary rights notices provided on or with the
                    Application.
                  </li>
                  <li>
                    Use the Application in violation of any law, regulation or
                    rule.
                  </li>
                  <li>
                    Use the Application for purposes of competitive analysis of
                    the Application, the development of a competing software
                    product or service, or any other purpose that is to Diesel
                    Laptops’ commercial disadvantage.
                  </li>
                </ol>

                <div class="text-h6">Modifications to Application</div>

                <p>
                  Diesel Laptops, LLC reserves the right to modify, suspend or
                  discontinue, temporarily or permanently, the Application or
                  any service to which it connects, with or without notice and
                  without liability to you.
                </p>

                <div class="text-h6">Term and Termination</div>

                <p>
                  This Agreement shall remain in effect until terminated by you
                  or by Diesel Laptops, LLC.
                </p>
                <p>
                  Diesel Laptops, LLC may, in its sole discretion, at any time
                  and for any or no reason, suspend or terminate this Agreement
                  with or without prior notice.
                </p>
                <p>
                  This Agreement will terminate immediately, without prior
                  notice from Diesel Laptops, LLC in the event that you fail to
                  comply with any provision of this Agreement. You may also
                  terminate this Agreement by uninstalling any version of the
                  Application, including any copies, and from ceasing to access
                  the Application via the Internet.
                </p>
                <p>
                  Upon termination of this Agreement, you shall cease all use of
                  the Application and remove any installed version of the
                  Application from your mobile device or from your desktop.
                </p>

                <div class="text-h6">Severability</div>

                <p>
                  If any provision of this Agreement is held to be unenforceable
                  or invalid, such provision will be changed and interpreted to
                  accomplish the objectives of such provision to the greatest
                  extent possible under applicable law and the remaining
                  provisions will continue in full force and effect.
                </p>

                <div class="text-h6">Amendments to this Agreement</div>

                <p>
                  Diesel Laptops, LLC reserves the right, at its sole
                  discretion, to modify or replace this Agreement at any time.
                  If a revision is material we will provide at least 10 days'
                  notice prior to any new terms taking effect. What constitutes
                  a material change will be determined at our sole discretion.
                </p>

                <div class="text-h6">Collection and Use of Information</div>

                <p>
                  You acknowledge that Diesel Laptops, LLC may, directly or
                  indirectly through the services of third parties, collect and
                  store information regarding the use of the Application and
                  about equipment on which the Application is installed or
                  through which it is otherwise accessed and use. Diesel Laptops
                  may use such information for any lawful purpose including but
                  not limited to improving performance of the Application,
                  verifying your compliance with the terms of this Agreement,
                  and enforcing our intellectual property rights.
                </p>

                <div class="text-h6">Limitation of Liability</div>

                <p>
                  THE APPLICATION IS PROVIDED "AS IS" AND WITHOUT WARRANTY OF
                  ANY KIND. TO THE MAXIMUM EXTENT PERMITTED UNDER APPLICABLE
                  LAW, DIESEL LAPTOPS, LLC, ON ITS OWN BEHALF AND ON BEHALF OF
                  ITS AFFILIATES, EXPRESSLY DISCLAIMS ALL WARRANTIES, WHETHER
                  EXPRESS, IMPLIED, STATUTORY, OR OTHERWISE, WITH RESPECT TO THE
                  APPLICATION, INCLUDING ALL IMPLIED WARRANTIES OF
                  MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE, TITLE, AND
                  NON-INFRINGEMENT, AND WARRANTIES THAT MAY ARISE OUT OF COURSE
                  OF DEALING, COURSE OF PERFORMANCE, USAGE, OR TRADE PRACTICE.
                  WITHOUT LIMITATION TO THE FOREGOING, WE PROVIDE NO WARRANTY OR
                  UNDERTAKING, AND MAKE NO REPRESENTATION OF ANY KIND THAT THE
                  LICENSED SOFTWARE WILL YOU’RE YOUR REQUIREMENTS, ACHIEVE ANY
                  INTENDED RESULTS, BE COMPATIBLE, OR WORK WITH ANY OTHER
                  SOFTWARE, APPLICATIONS, SYSTEMS, OR SERVICES, OPERATE WITHOUT
                  INTERRUPTION, MEET ANY PERFORMANCE OR RELIABILITY STANDARDS OR
                  BE ERROR FREE, OR THAT ANY ERRORS OR DEFECTS CAN OR WILL BE
                  CORRECTED. TO THE MAXIMUM EXTENT PERMITTED BY LAW, WE WILL NOT
                  BE LIABLE FOR ANY USE, INTERRUPTION, DELAY, OR INABILITY TO
                  USE THE APPLICATION; LOST REVENUES OR PROFITS; DELAYS,
                  INTERRUPTION, OR LOSS OF SERVICES, BUSINESS, OR GOODWILL; LOSS
                  OR CORRUPTION OF DATA; LOSS RESULTING FROM SYSTEM OR SYSTEM
                  SERVICE FAILURE, MALFUNCTION, OR SHUTDOWN; FAILURE TO
                  ACCURATELY TRANSFER, READ, OR TRANSMIT INFORMATION; FAILURE TO
                  UPDATE OR PROVIDE CORRECT INFORMATION; SYSTEM INCOMPATIBILITY
                  OR PROVISION OF INCORRECT COMPATIBILITY INFORMATION; OR
                  BREACHES IN SYSTEM SECURITY; OR FOR ANY CONSEQUENTIAL,
                  INCIDENTAL, INDIRECT, EXEMPLARY, SPECIAL, OR PUNITIVE DAMAGES,
                  WHETHER ARISING OUT OF OR IN CONNECTION WITH THIS AGREEMENT,
                  BREACH OF CONTRACT, TORT (INCLUDING NEGLIGENCE), OR OTHERWISE,
                  REGARDLESS OF WHETHER SUCH DAMAGES WERE FORESEEABLE AND
                  WHETHER OR NOT SUCH PARTY WAS ADVISED OF THE POSSIBILITY OF
                  SUCH DAMAGES.
                </p>

                <div class="text-h6">Contact Information</div>

                <p>
                  If you have any questions about this Agreement, please contact
                  us through our
                  <a
                    href="https://www.diesellaptops.com/pages/contact-us"
                    target="_blank"
                    class="text-primary text-bold"
                  >
                    webpage</a
                  >.
                </p>
              </q-card-section>
            </q-card>

            <q-card class="q-ma-md">
              <q-scroll-area style="height: 200px">
                <q-card-section>
                  <q-checkbox
                    v-model="agree"
                    label="I accept the terms of the End-User License Agreement"
                  />

                  <button-standard
                    :loading="isRegistering"
                    @click.native="registerAccount"
                    label="Submit"
                    :disable="!agree"
                    class="q-mt-sm app-parts-register-button"
                  />
                </q-card-section>
              </q-scroll-area>
            </q-card>
          </modal-content>
        </q-dialog>
      </q-card-section>
    </q-card>
  </q-page>
</template>

<script>
import ButtonStandard from "../components/common/ButtonStandard";
import { Notify } from "../mixins/Notify.js";
import VerifyUserModal from "../components/layout/VerifyUserModal";
import ModalContent from "../components/common/ModalContent.vue";
import { mapActions } from "vuex";

export default {
  name: "Register",
  components: {
    // ContentCard,
    ButtonStandard,
    VerifyUserModal,
    ModalContent,
  },

  mixins: [Notify],

  data: () => ({
    verifyUser: false,
    isRegistering: false,
    email: "",
    firstName: "",
    lastName: "",
    role: "",
    password: "",
    verify: "",
    hidden: true,
    loading: false,
    response: {},
    eulaModal: false,
    agree: false,
  }),

  computed: {
    formIsComplete() {
      return (
        this.email !== "" &&
        this.firstName !== "" &&
        this.lastName !== "" &&
        this.role !== "" &&
        this.password !== ""
      );
    },

    validPassword() {
      return this.password === this.verify;
    },

    registration() {
      return {
        email: this.email,
        password: this.password,
        first_name: this.firstName,
        last_name: this.lastName,
        role: this.role,
      };
    },

    errorFound() {
      return this.response?.error || this.response?.subject === 'error';
    },

    validationErrors() {
      return this.response?.error?.failed_data_validation;
    },

    userNotVerified() {
      return this.response?.data?.information?.email_verified_at === null;
    },
  },

  methods: {
    ...mapActions({ userRequest: "user/request" }),

    validateForm() {
      if (!this.validPassword)
        return this.notify("Passwords do not match.", "negative");
      if (!this.formIsComplete)
        return this.notify("Please complete all form fields.", "negative");
      this.eulaModal = true;
    },

    handleErrors() {
      if (this.validationErrors) {
        for (const value in this.validationErrors) {
          this.notify(`${this.validationErrors[value]}`, "negative");
        }
      }
      if (this.response?.subject === 'error') {
        this.notify(`${this.response?.data[0]}`, "negative");
      }
      if (this.error) {
        for (const value in this.error) {
          this.notify(`${this.error[value]}`, "negative");
        }
      }
    },

    async registerAccount() {
      this.loading = true;
      this.isRegistering = true;
      this.response = await this.userRequest({
        type: "register",
        payload: this.registration,
      });
      this.handleResponse();
    },

    handleResponse() {
      if (this.errorFound) {
        this.loading = false;
        this.isRegistering = false;
        return this.handleErrors();
      }

      const { information } = this?.response?.data;

      analytics.identify(information.id, {
        name: information.first_name + " " + information.last_name,
        email: information.email,
      });

      this.loading = false;
      this.verifyUser = true;
    },
  },
};
</script>
