import io from 'socket.io-client';
import getAuthConfig from '@common-ui/kx-sdk/getAuthConfig';
export default defineNuxtPlugin(() => {
  return {
    provide: {
      socket() {
        try {
          const token = sessionStorage.getItem('auth');
          if (!token) {
            throw new Error('No token found');
          }
          const socket = io(getAuthConfig().sdkConf.EMX_BASE, {
            path: '/dsmlogs',
            reconnectionAttempts: 2,
            transports: ['websocket'],
            auth: {
              token,
            },
          });

          return socket;
        } catch (error) {
          console.log(`[error]: `, error);
        }
      },
    },
  };
});
