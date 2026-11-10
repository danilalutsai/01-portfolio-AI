<script setup lang="ts">
import contactBackground from '@/assets/img/bg-hero-contact.webp'
import { ref, watch, nextTick } from 'vue';
import * as z from 'zod';


type ContactData = z.infer<typeof SchemaFields>;

interface FieldsKeys {
name: keyof ContactData;
label: string;
type: string;
autocomplete: string;
}

const isSending = ref(false);
const submitMessage = ref('');

async function handleSubmit() {
if (isSending.value) return;
submitMessage.value = '';

const result = SchemaFields.safeParse(user.value);

if (!result.success) {
  for (const field of fields) {
    validateField(field.name);
  }
  return;
}

errors.value = {};
isSending.value = true;
submitMessage.value = 'Loading...';

try {
  const response = await fetch('https://formspree.io/f/mppqnwkl', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    },
    body: JSON.stringify(result.data),
  },
  );

  if (!response.ok) {
    throw new Error('Submission failed');
  }

  user.value = {
    firstname: '',
    lastname: '',
    country: '',
    city: '',
    phone: '',
    email: '',
    message: '',
  };

  await nextTick();
  errors.value = {};

  submitMessage.value = 'Thank you! Your message was submitted successfully.';
} catch {
  submitMessage.value = `Could not submit your message. Please try again later.`;
} finally {
  isSending.value = false;
}
}

const user = ref({
firstname: '',
lastname: '',
country: '',
city: '',
phone: '',
email: '',
message: '',
});

function validateField(name: keyof ContactData) {
const result = SchemaFields.shape[name].safeParse(user.value[name]);

if (!result.success) {
  errors.value[name] = result.error.issues[0]?.message;
} else {
  delete errors.value[name];
}
}

const fields: FieldsKeys[] = [
{ name: 'firstname', label: 'First name', type: 'text', autocomplete: 'given-name' },
{ name: 'lastname', label: 'Last name', type: 'text', autocomplete: 'family-name' },
{ name: 'country', label: 'Country', type: 'text', autocomplete: 'country-name' },
{ name: 'city', label: 'City', type: 'text', autocomplete: 'address-level' },
{ name: 'phone', label: 'Phone number', type: 'tel', autocomplete: 'tel' },
{ name: 'email', label: 'Email', type: 'email', autocomplete: 'email' },
{ name: 'message', label: 'Message', type: 'message', autocomplete: 'message' },
]

const SchemaFields = z.object({
firstname: z.string().trim().min(2, 'Enter your first name. Min 2 chars.'),
lastname: z.string().trim().min(2, 'Enter your last name. Min 2 chars.'),
country: z.string().trim().min(2, 'Enter you country. Min 2 chars.'),
city: z.string().trim().min(2, 'Enter your city. Min 2 chars.'),
phone: z.e164({ error: 'Use an international number, e.g. +37251234567' }),
email: z.email({ error: 'Enter a valid email address with @' }),
message: z.string().trim().min(5, 'Enter a message. Min 5 chars.'),
});

const errors = ref<Partial<Record<keyof ContactData, string>>>({});

for (const field of fields) {
watch(
  () => user.value[field.name],
  () => validateField(field.name),
);
}


</script>

<template>
  <section
    ref="contact"
    data-animate="main-contact"
    class="main-section relative isolate grid min-h-screen w-full place-items-center
    content-center bg-gray-600
    overflow-hidden px-4 py-12 sm:px-6 sm:py-20"
  >
    <img
      :src="contactBackground"
      alt=""
      class="absolute inset-0 -z-10 h-full w-full object-cover"
    />

    <div class="grid min-w-0 w-full max-w-5xl grid-cols-1 gap-8 rounded-2xl bg-white/95
      px-4 py-10 sm:px-10 sm:py-20 shadow-xl">
      <h1 class="text-3xl font-semibold sm:text-4xl pb-10 bg-linear-180
        from-[#9f72d4] to-[#e3905d] bg-clip-text text-transparent">Contact</h1>

      <!-- Submission is intentionally disabled until a contact endpoint is available. -->
      <form class="items-center grid min-w-0 grid-cols-1 sm:grid-cols-2 gap-5 w-full"
        @submit.prevent="handleSubmit">
        <div
          v-for="field in fields"
          :key="field.name"
          class="grid min-w-0 gap-2"
          :class="{ 'sm:col-span-2': field.name === 'message' }"
        >
          <label
            :for="field.name"
            class="text-lg font-normal text-gray-600"
          >{{ field.label }}</label>

          <textarea
            v-if="field.name === 'message'"
            v-model="user[field.name]"
            :id="field.name"
            :name="field.name"
              class="min-h-40 w-full rounded-lg border border-gray-300 p-4"
            @blur="validateField(field.name)"
            @focus="validateField(field.name)"
          />

          <input
            v-if="field.name !== 'message'"
            v-model="user[field.name]"
            :id="field.name"
            :name="field.name"
            :type="field.type"
            :autocomplete="field.autocomplete"
            class="w-full rounded-lg border border-gray-300 bg-white px-3 py-3 text-base text-gray-700
            focus-visible:outline-2 focus-visible:outline-offset-2
            focus-visible:outline-green-500 items-center"
          />
          <div class="min-h-5">
            <p v-if="errors[field.name]" class="text-sm text-red-600">
              {{ errors[field.name] }}
            </p>
          </div>
        </div>
        <button type="submit" :disabled="isSending" class="w-full bg-linear-to-r
          from-[#9f72d4] to-[#e3905d] col-span-full grid min-w-0 gap-2 shadow-xl
          py-5 mt-10 rounded-lg cursor-pointer text-white hover:-translate-y-1
          transition-transform duration-200 active:-translate-y-2">
          {{ isSending ? 'Sending...' : 'Send' }}
        </button>
        <p
          v-if="submitMessage"
          role="status"
          class="col-span-full"
        >{{ submitMessage }}</p>
      </form>
    </div>
  </section>
</template>
