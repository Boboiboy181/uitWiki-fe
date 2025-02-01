import { useEffect } from 'react';
import Swal from 'sweetalert2';
import MESSAGES from '~/assets/message';

const VisitorWarning = () => {
  useEffect(() => {
    const hasVisited = localStorage.getItem('hasVisited');

    if (!hasVisited) {
      Swal.fire({
        title: MESSAGES.greeting.title,
        text: MESSAGES.greeting.text,
        icon: 'info',
        confirmButtonText: MESSAGES.greeting.confirmText,
        confirmButtonColor: MESSAGES.greeting.confirmColor,
        allowOutsideClick: false,
        backdrop: true,
        customClass: {
          popup: 'dark:bg-slate-800 dark:text-white',
          title: 'dark:text-white text-gray-900',
          htmlContainer: 'dark:text-gray-300 text-base text-gray-900',
        },
      }).then((result) => {
        if (result.isConfirmed) {
          localStorage.setItem('hasVisited', 'true');
        }
      });
    }
  }, []);

  return null;
};

export default VisitorWarning;
