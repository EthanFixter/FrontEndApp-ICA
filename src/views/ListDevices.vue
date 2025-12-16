<script setup lang="ts">
import { onMounted, ref } from 'vue';
import { useDevices } from '@/composables/use-devices';
import DeviceCard from '@/components/DeviceCard.vue';
import AddDeviceForm from '@/components/AddDeviceForm.vue';
import type { AddDeviceCommand } from '@/app/add-device';
import { useAuth0 } from '@auth0/auth0-vue';

const { devices, totalCount, loading, adding, error, fetchDevices, addDevice } =
  useDevices();

const { isAuthenticated, getAccessTokenSilently } = useAuth0();

const showForm = ref(false);
const formRef = ref<InstanceType<typeof AddDeviceForm> | null>(null);
const successMessage = ref<string | null>(null);

const handleToggleForm = () => {
  showForm.value = !showForm.value;
  successMessage.value = null;
  if (!showForm.value && formRef.value) {
    formRef.value.resetForm();
  }
};

const handleSubmit = async (command: AddDeviceCommand) => {
  successMessage.value = null;

  // Attach token when adding a device
  const token = await getAccessTokenSilently();
  await addDevice(command);

  if (!error.value) {
    successMessage.value = 'Device added successfully!';
    showForm.value = false;
    if (formRef.value) {
      formRef.value.resetForm();
    }
    setTimeout(() => {
      successMessage.value = null;
    }, 3000);
  }
};

const handleCancel = () => {
  showForm.value = false;
  successMessage.value = null;
  if (formRef.value) {
    formRef.value.resetForm();
  }
};

onMounted(() => {
  fetchDevices();
});
</script>

<template>
  <section class="page">
    <header class="page__header">
      <h1>Devices</h1>
      <button
        v-if="isAuthenticated"
        @click="handleToggleForm"
        class="btn btn--add"
        :disabled="loading"
      >
        {{ showForm ? 'Cancel' : '+ Add Device' }}
      </button>
    </header>

    <div v-if="!loading" class="page__meta" aria-live="polite">
      <span v-if="totalCount > 0">{{ totalCount }} total</span>
      <span v-else>None yet</span>
    </div>

    <div v-if="successMessage" class="success-message">
      {{ successMessage }}
    </div>

    <AddDeviceForm
      v-if="showForm && isAuthenticated"
      ref="formRef"
      :is-submitting="adding"
      :error="error"
      @submit="handleSubmit"
      @cancel="handleCancel"
    />

    <div v-if="loading" class="state">Loading…</div>
    <div v-else-if="error" class="state state--error">{{ error }}</div>
    <div v-else>
      <ul v-if="devices.length" class="grid" role="list">
        <li v-for="d in devices" :key="d.id" class="grid__item">
          <DeviceCard :device="d" :showDetails="isAuthenticated" />
        </li>
      </ul>
      <p v-else class="state">No devices yet. Be the first!</p>
    </div>
  </section>
</template>
