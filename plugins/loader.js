// kennect-v3\UI\kennect-common-ui-v3\globalLoader
import GlobalLoader from '@common-ui/globalLoader';
export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.vueApp.use(GlobalLoader, { nuxtApp });
});
