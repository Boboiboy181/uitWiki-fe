import { ReloadIcon } from '@radix-ui/react-icons';
import uitLogo from '~/assets/svg/logo-uit.svg';
import { Button } from '~/components/ui/button';
import { useSession } from '~/store';

export default function Header() {
  const { setSessionId } = useSession();

  const handleReload = () => {
    setSessionId('');
  };

  return (
    <header className="fixed left-0 top-0 z-10 w-full bg-white p-2 py-1">
      <nav className="flex items-center justify-between">
        <img className="size-12" src={uitLogo} alt="Trường Đại học Công nghệ Thông tin" />
        <Button onClick={handleReload} className="bg-white text-black shadow-none hover:bg-gray-200">
          <ReloadIcon />
        </Button>
      </nav>
    </header>
  );
}
