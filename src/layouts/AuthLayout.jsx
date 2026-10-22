import { Link, Outlet } from 'react-router-dom';
import logo from '@/assets/nm_logo.svg';
import { PATHS } from '@/routes/paths';

export default function AuthLayout() {
  return (
    <div className="min-h-dvh bg-white">
      <header className="mx-auto flex h-16 max-w-[1440px] items-center justify-center px-8 max-md:px-4">
        <Link to={PATHS.HOME}>
          <img src={logo} alt="냥멍케어" className="h-8 w-auto" />
        </Link>
      </header>
      <main className="flex justify-center px-8 pt-12 pb-24 max-md:px-4 max-md:pt-6 max-md:pb-16">
        <Outlet />
      </main>
    </div>
  );
}
