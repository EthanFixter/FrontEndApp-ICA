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
  manufacturer: '',
  model: '',
});

const validationErrors = ref<Record<string, string>>({});
const touched = reactive({
  name: false,
  manufacturer: false,
  model: false,
});

const validate = (): boolean => {
  const errors: Record<string, string> = {};

  if (!form.name.trim()) {
    errors.name = 'Name is required';
  } else if (form.name.trim().length < 3) {
    errors.name = 'Name must be at least 3 characters';
  }

  if (!form.manufacturer.trim()) {
    errors.manufacturer = 'Manufacturer is required';
  }

  if (!form.model.trim()) {
    errors.model = 'Model is required';
  }

  validationErrors.value = errors;
  return Object.keys(errors).length === 0;
};

const isValid = computed(() => {
  return (
    form.name.trim().length >= 3 &&
    form.manufacturer.trim().length > 0 &&
    form.model.trim().length > 0
  );
});

const handleSubmit = () => {
  touched.name = true;
  touched.manufacturer = true;
  touched.model = true;

  if (!validate()) return;

  emit('submit', {
    name: form.name.trim(),
    manufacturer: form.manufacturer.trim(),
    model: form.model.trim(),
  });
};

const handleCancel = () => {
  emit('cancel');
};

const resetForm = () => {
  form.name = '';
  form.manufacturer = '';
  form.model = '';
  validationErrors.value = {};
  touched.name = false;
  touched.manufacturer = false;
  touched.model = false;
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
          placeholder="e.g. iPhone 15 Pro"
          :disabled="isSubmitting"
        />
        <span v-if="touched.name && validationErrors.name" class="error">
          {{ validationErrors.name }}
        </span>
      </div>

      <!-- Manufacturer -->
      <div class="form-group">
        <label for="manufacturer">Manufacturer</label>
        <input
          id="manufacturer"
          type="text"
          v-model="form.manufacturer"
          @blur="markTouched('manufacturer')"
          placeholder="e.g. Apple"
          :disabled="isSubmitting"
        />
        <span
          v-if="touched.manufacturer && validationErrors.manufacturer"
          class="error"
        >
          {{ validationErrors.manufacturer }}
        </span>
      </div>

      <!-- Model -->
      <div class="form-group">
        <label for="model">Model</label>
        <input
          id="model"
          type="text"
          v-model="form.model"
          @blur="markTouched('model')"
          placeholder="e.g. A3101"
          :disabled="isSubmitting"
        />
        <span v-if="touched.model && validationErrors.model" class="error">
          {{ validationErrors.model }}
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
