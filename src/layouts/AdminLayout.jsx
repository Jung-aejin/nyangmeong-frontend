import { Outlet } from 'react-router-dom';
import ScrollToTop from './ScrollToTop';

export default function AdminLayout() {
  return (
    <div className="min-h-screen">
      <ScrollToTop />
      <main>
        <Outlet />
      </main>
    </div>
  );
}
