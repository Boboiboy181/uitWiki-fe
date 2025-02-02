import { InfoCircledIcon, ReloadIcon } from '@radix-ui/react-icons';
import Swal from 'sweetalert2';
import MESSAGES from '~/assets/message';
import uitLogo from '~/assets/svg/logo-uit.svg';
import { Button } from '~/components/ui/button';
import { useSession } from '~/store';

export default function Header() {
  const { setSessionId } = useSession();

  const handleReload = () => {
    setSessionId('');
  };

  const handleShowInfo = () => {
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
    });
  };

  return (
    <header className="fixed left-0 top-0 z-10 w-full bg-white p-2 py-1">
      <nav className="flex items-center justify-between">
        <img className="size-12" src={uitLogo} alt="Trường Đại học Công nghệ Thông tin" />
        <div>
          <Button onClick={handleShowInfo} className="bg-white text-black shadow-none hover:bg-gray-200">
            <InfoCircledIcon />
          </Button>
          <Button onClick={handleReload} className="bg-white text-black shadow-none hover:bg-gray-200">
            <ReloadIcon />
          </Button>
        </div>
      </nav>
    </header>
  );
}
