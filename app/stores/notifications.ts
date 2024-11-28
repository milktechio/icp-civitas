import { acceptHMRUpdate, defineStore } from 'pinia';

export interface AppNotification {
  readonly id: symbol;
  title: string;
  details?: string;
  extended?: boolean;
  timeout: NodeJS.Timeout;

  /** @default "info" */
  mode: 'success' | 'info' | 'fail';
}

type NewAppNotificationConfig = Partial<Omit<AppNotification, 'id' | 'title' | 'timeout'>>;

const DEFAULT_DURATION = 5000 as const; // 5 seconds
const EXTENDED_DURATION = 20000 as const; // 20 seconds

export const useNotifsStore = defineStore('notifications', {
  state: () => ({
    notifications: [] as AppNotification[],
  }),

  actions: {
    notify(title: string, config?: NewAppNotificationConfig) {
      const existingNotif = this.notifications.find(
        (notif) => notif.title === title && notif.details === config?.details,
      );

      if (existingNotif) {
        // Duplicate notification. Don't show again, just extend it
        clearTimeout(existingNotif.timeout);
        existingNotif.timeout = setTimeout(
          () => this.dismiss(existingNotif.id),
          config?.extended ? EXTENDED_DURATION : DEFAULT_DURATION,
        );
        return;
      }

      const newNotif: AppNotification = {
        id: Symbol(),
        title,
        ...config,
        mode: config?.mode || 'info',
        timeout: setTimeout(
          () => this.dismiss(newNotif.id),
          config?.extended ? EXTENDED_DURATION : DEFAULT_DURATION,
        ),
      };
      this.notifications.unshift(newNotif);
    },

    dismiss(id: string | symbol) {
      const notifIndex = this.notifications.findIndex((notification) => notification.id === id);
      if (notifIndex < 0) return;
      this.notifications.splice(notifIndex, 1);
    },

    clearAll() {
      this.$reset();
    },
  },
});

if (import.meta.hot) import.meta.hot.accept(acceptHMRUpdate(useNotifsStore, import.meta.hot));
