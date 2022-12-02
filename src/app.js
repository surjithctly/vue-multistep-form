import {
  createApp,
  nextTick,
} from "https://unpkg.com/petite-vue?module";
// import { transitionDirective } from "https://unpkg.com/vue-petite-transition?module";

function FieldComponent(props) {
  return {
    $template: "#field-component-template",
    field: props.field,
    fieldNum: props.currentStep + props.index + 1,

    get isInvalid() {
      return props.isInvalid();
    },
    get invalidMessage() {
      return props.invalidMessage();
    },
    get nextStep() {
      nextTick(() => {
        this.$refs.InputFields?.focus();
        // this.focusElem(this.$refs.InputFields);
        //this.$refs.InputFields.setAttribute("autofocus", "true");
        // this.invalids = {};
      });
    },
    // methods
    validate() {
      nextTick(() => {
        if (this.isInvalid) {
          props.validate();
        }
      });
    },
  };
}

function StepsIndicatorComponent(props) {
  return {
    $template: "#step-indicator-component-template",
    stepsCount: props.stepsCount,
    get stepsCountWithSuccessPage() {
      return this.stepsCount + 1;
    },
  };
}

createApp({
  // Components
  StepsIndicatorComponent,
  FieldComponent,

  // Data
  formstarted: false,
  currentStep: 0,
  submitted: false,
  submitSuccess: false,
  submitError: false,
  formAccessKey: "YOUR_ACCESS_KEY_HERE",
  invalids: {},
  fields: {
    name: {
      label: "What's your full name?",
      helptext: "Howdy Stranger, Let's get acquainted. ",
      value: "",
      validations: [
        {
          message: "Name is a required field",
          test: (value) => value,
        },
      ],
    },
    email: {
      label: "Email",
      helptext: "Thank you, now provide your email to contact you. ",
      value: "",
      validations: [
        {
          message: "Must be a valid email address",
          test: (value) => validateEmail(value),
        },
        {
          message: "Email is required",
          test: (value) => value,
        },
      ],
    },
    referral: {
      label: "How did you find us?",
      value: "",
      type: "select",
      name: "referral",
      options: [
        "Google",
        "Social Media",
        "Website or Blog",
        "Friends",
        "Other",
      ],
      optional: true,
      validations: [],
    },
    address: {
      label: "Address",
      value: "",
      validations: [
        {
          message: "Address is a required field",
          test: (value) => value,
        },
      ],
    },
    city: {
      label: "City",
      value: "",
      validations: [
        {
          message: "City is a required field",
          test: (value) => value,
        },
      ],
    },
    state: {
      label: "State",
      value: "",
      validations: [
        {
          message: "State is a required field",
          test: (value) => value,
        },
      ],
    },
    zip: {
      label: "Zip",
      value: "",
      validations: [
        {
          message: "Zip is a required field",
          test: (value) => value,
        },
        {
          message: "Zip must be 5 digits",
          test: (value) => !isNaN(value) && value.length === 5,
        },
      ],
    },
    donationAmount: {
      label: "Donation Amount",
      value: "",
      validations: [
        {
          message: "Donation Amount is a required field",
          test: (value) => value,
        },
        {
          message: "Donation Amount must be a valid number",
          test: (value) => !isNaN(value),
        },
      ],
    },
  },
  steps: [
    ["name"],
    ["email"],
    ["address"],
    ["city"],
    ["state"],
    ["zip"],
    ["referral"],
    ["donationAmount"],
  ],

  // Getters
  get currentFields() {
    return this.steps[this.currentStep];
  },
  get totalSteps() {
    return this.steps.length;
  },
  get isFirstStep() {
    return this.currentStep === 0;
  },
  get isLastStep() {
    return this.currentStep === this.totalSteps - 1;
  },

  startForm() {
    return (this.formstarted = true);
  },

  // Methods
  previousStep() {
    if (this.isFirstStep) return;
    // removes all invalids so doesn't show error messages on back
    this.invalids = {};
    this.currentStep--;
  },
  nextStep() {
    if (this.isLastStep) return;
    this.validate();
    //console.log(this);
    if (this.isInvalid) return;
    this.currentStep++;
  },
  get isInvalid() {
    return !!Object.values(this.invalids).filter((key) => key).length;
  },

  // methods
  validate() {
    this.invalids = {};
    // validates all the fields on the current page
    this.currentFields.forEach((key) => {
      this.validateField(key);
    });
  },
  validateField(fieldKey) {
    this.invalids[fieldKey] = false;
    const field = this.fields[fieldKey];
    // run through each of the fields validation tests
    field.validations.forEach((validation) => {
      if (!validation.test(field.value)) {
        this.invalids[fieldKey] = validation.message;
      }
    });
  },
  listenEnterKey() {
    window.addEventListener("keydown", (e) => {
      if (e.key == "Enter") {
        e.preventDefault();
        if (!this.formstarted) {
          this.formstarted = true;
        } else if (!this.isLastStep && !this.isInvalid) {
          return this.nextStep();
        } else {
          return this.submit();
        }
      }
    });
  },
  async submit() {
    // if form not valid don't submit
    this.validate();
    if (this.isInvalid) return;
    this.submitted = true;
    const formData = this.fields;
    const object = {
      access_key: this.formAccessKey,
      subject: "New submission from multistep form",
    };
    for (const key in formData) {
      object[key] = formData[key].value;
    }
    console.log("Submitting form..", object);

    const response = await fetch("https://api.web3forms.com/submit", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify(object),
    });
    const result = await response.json();

    if (result.success) {
      console.log(result);
      // submit on valid form
      this.submitSuccess = true;
    } else {
      console.log(result);
      this.submitError = true;
    }

    // this will also work.
    // for (let [key, value] of Object.entries(formData)) {
    //   console.log(key, value.value);
    // }
  },
})
  // .directive("transition", transitionDirective)
  .mount("#multistep-form");

function validateEmail(email) {
  const re =
    /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return re.test(String(email).toLowerCase());
}
