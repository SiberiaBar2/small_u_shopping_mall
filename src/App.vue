<script setup lang="ts">
import {
  NConfigProvider,
  NMessageProvider,
  NLoadingBarProvider,
  NModalProvider,
  NDialogProvider,
  zhCN,
  dateZhCN,
} from 'naive-ui'
import { RouterView } from 'vue-router'
</script>

<template>
  <n-config-provider :locale="zhCN" :date-locale="dateZhCN">
    <n-modal-provider>
      <n-dialog-provider>
        <n-loading-bar-provider>
          <n-message-provider>
            <div class="content">
              <RouterView />
            </div>
          </n-message-provider>
        </n-loading-bar-provider> </n-dialog-provider
    ></n-modal-provider>
  </n-config-provider>
</template>

<style scoped></style>
