import { io } from 'socket.io-client';
import { onMounted, onUnmounted } from 'vue';
import { useAuthStore } from '~/stores/auth';
import { toast } from 'vue3-toastify';

let socket: ReturnType<typeof io>;

export function useNotifications() {
  const auth = useAuthStore();
  const { data: currentUser } = useCurrentUserQuery();
  const { refetch } = useTasksQuery();

  onMounted(() => {
    if (!auth.token) return;
    const { token } = auth;

    socket = io(import.meta.env.VITE_SOCKET_URL, {
      auth: { token },
      transports: ['websocket'],
    });
    
    socket.on('connect', () => {
      if (currentUser?.value?.id) {
        socket.emit('joinRoom', currentUser.value.id);
      }
    });

    socket.on('taskNotification', (msg: string) => {
      toast.success(msg, {
        autoClose: 5000,
      });
      refetch();
    });
  });

  onUnmounted(() => {
    socket.disconnect();
  });
}
