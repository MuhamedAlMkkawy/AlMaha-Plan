import { defineStore } from "pinia";
import { createCookieStorage } from "~/utils/piniaCookieStorage";

export const useAuthStore = defineStore(
  "authStore",
  () => {
    const user = ref(null);

    const handleUserData = (newUser) => {
      user.value = newUser;
    };

    return {
      user,
      handleUserData,
    };
  },
  {
    persist: {
      storage: createCookieStorage(60 * 60 * 24 * 7), // 7 days
    },
  },
);
