<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import type { AddReservationCommand } from '../app/add-reservation';

const emit = defineEmits<{
  submit: [command: AddReservationCommand];
  cancel: [];
}>();

const props = defineProps<{
  isSubmitting?: boolean;
  error?: string | null;
}>();

const form = reactive({
  name: '',
  description: '',
  partySize: 1,
  reservedAt: new Date().toISOString().slice(0, 16), // yyyy-MM-ddTHH:mm
});

const validationErrors = ref<Record<string, string>>({});
const touched = reactive({
  name: false,
  description: false,
  partySize: false,
  reservedAt: false,
});

const validate = (): boolean => {
  const errors: Record<string, string> = {};

  if (!form.name.trim()) {
    errors.name = 'Name is required';
  } else if (form.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }

  if (!form.description.trim()) {
    errors.description = 'Description is required';
  } else if (form.description.trim().length < 5) {
    errors.description = 'Description must be at least 5 characters';
  }

  if (form.partySize <= 0) {
    errors.partySize = 'Party size must be greater than 0';
  }

  if (!form.reservedAt) {
    errors.reservedAt = 'Reservation date/time is required';
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const isValid = computed(() => {
  return (
    form.name.trim().length >= 3 &&
    form.description.trim().length >= 5 &&
    form.partySize > 0 &&
    !!form.reservedAt
  );
});

const handleSubmit = () => {
  touched.name = true;
  touched.description = true;
  touched.partySize = true;
  touched.reservedAt = true;

  if (!validate()) return;

  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim(),
    partySize: form.partySize,
    reservedAt: new Date(form.reservedAt),
  });
};

const handleCancel = () => {
  emit('cancel');
};

const resetForm = () => {
  form.name = '';
  form.description = '';
  form.partySize = 1;
  form.reservedAt = new Date().toISOString().slice(0, 16);
  validationErrors.value = {};
  touched.name = false;
  touched.description = false;
  touched.partySize = false;
  touched.reservedAt = false;
};

const markTouched = (field: keyof typeof touched) => {
  touched[field] = true;
  validate();
};

defineExpose({ resetForm });
</script>

<template>
  <div class="add-reservation-form">
    <h2>Add a Reservation</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Name -->
      <div class="form-group">
        <label for="name">Reservation Name</label>
        <input
          id="name"
          type="text"
          v-model="form.name"
          @blur="markTouched('name')"
          placeholder="e.g. Laptop Booking"
          :disabled="isSubmitting"
        />
        <span v-if="touched.name && validationErrors.name" class="error">
          {{ validationErrors.name }}
        </span>
      </div>

      <!-- Description -->
      <div class="form-group">
        <label for="description">Description</label>
        <textarea
          id="description"
          v-model="form.description"
          @blur="markTouched('description')"
          placeholder="e.g. Reserved for training session"
          rows="3"
          :disabled="isSubmitting"
        ></textarea>
        <span
          v-if="touched.description && validationErrors.description"
          class="error"
        >
          {{ validationErrors.description }}
        </span>
      </div>

      <!-- Party Size -->
      <div class="form-group">
        <label for="partySize">Party Size</label>
        <input
          id="partySize"
          type="number"
          v-model.number="form.partySize"
          @blur="markTouched('partySize')"
          min="1"
          :disabled="isSubmitting"
        />
        <span
          v-if="touched.partySize && validationErrors.partySize"
          class="error"
        >
          {{ validationErrors.partySize }}
        </span>
      </div>

      <!-- Reserved At -->
      <div class="form-group">
        <label for="reservedAt">Reserved At</label>
        <input
          id="reservedAt"
          type="datetime-local"
          v-model="form.reservedAt"
          @blur="markTouched('reservedAt')"
          :disabled="isSubmitting"
        />
        <span
          v-if="touched.reservedAt && validationErrors.reservedAt"
          class="error"
        >
          {{ validationErrors.reservedAt }}
        </span>
      </div>

      <!-- Error Message -->
      <div v-if="error" class="form-error">
        {{ error }}
      </div>

      <!-- Actions -->
      <div class="form-actions">
        <button
          type="button"
          @click="handleCancel"
          class="btn btn-secondary"
          :disabled="isSubmitting"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="btn btn-primary"
          :disabled="!isValid || isSubmitting"
        >
          {{ isSubmitting ? 'Submitting...' : 'Add Reservation' }}
        </button>
      </div>
    </form>
  </div>
</template>
