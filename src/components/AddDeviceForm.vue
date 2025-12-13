<script setup lang="ts">
import { reactive, ref, computed } from 'vue';
import type { AddDeviceCommand } from '../app/add-device';

const emit = defineEmits<{
  submit: [command: AddDeviceCommand];
  cancel: [];
}>();

const props = defineProps<{
  isSubmitting?: boolean;
  error?: string | null;
}>();

const form = reactive({
  name: '',
  description: '',
  totalQuantity: 0,
});

const validationErrors = ref<Record<string, string>>({});
const touched = reactive({
  name: false,
  description: false,
  totalQuantity: false,
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

  if (form.totalQuantity <= 0) {
    errors.totalQuantity = 'Total quantity must be greater than 0';
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const isValid = computed(() => {
  return (
    form.name.trim().length >= 3 &&
    form.description.trim().length >= 5 &&
    form.totalQuantity > 0
  );
});

const handleSubmit = () => {
  touched.name = true;
  touched.description = true;
  touched.totalQuantity = true;

  if (!validate()) return;

  emit('submit', {
    name: form.name.trim(),
    description: form.description.trim(),
    totalQuantity: form.totalQuantity,
  });
};

const handleCancel = () => {
  emit('cancel');
};

const resetForm = () => {
  form.name = '';
  form.description = '';
  form.totalQuantity = 0;
  validationErrors.value = {};
  touched.name = false;
  touched.description = false;
  touched.totalQuantity = false;
};

const markTouched = (field: keyof typeof touched) => {
  touched[field] = true;
  validate();
};

defineExpose({ resetForm });
</script>

<template>
  <div class="add-device-form">
    <h2>Add a Device</h2>

    <form @submit.prevent="handleSubmit">
      <!-- Name -->
      <div class="form-group">
        <label for="name">Device Name</label>
        <input
          id="name"
          type="text"
          v-model="form.name"
          @blur="markTouched('name')"
          placeholder="e.g. iPad"
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
          placeholder="e.g. iPad for students"
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

      <!-- Total Quantity -->
      <div class="form-group">
        <label for="totalQuantity">Total Quantity</label>
        <input
          id="totalQuantity"
          type="number"
          v-model.number="form.totalQuantity"
          @blur="markTouched('totalQuantity')"
          min="1"
          :disabled="isSubmitting"
        />
        <span
          v-if="touched.totalQuantity && validationErrors.totalQuantity"
          class="error"
        >
          {{ validationErrors.totalQuantity }}
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
          {{ isSubmitting ? 'Submitting...' : 'Add Device' }}
        </button>
      </div>
    </form>
  </div>
</template>
