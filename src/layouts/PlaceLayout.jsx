import { Outlet } from 'react-router-dom';
import UserHeader from './UserHeader';

export default function PlaceLayout() {
  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-white">
      <UserHeader />
      <main className="min-h-0 flex-1">
        <Outlet />
      </main>
    </div>
  );
}
