import { Link, useLocation } from 'react-router';

const NavBar = () => {
  const location = useLocation();

  const navItems = [
    { path: '/engine-control', label: 'Engine Control' },
    { path: '/flight-estimator', label: 'Flight Estimator' },
    { path: '/telemetry', label: 'Telemetry' },
  ];

  return (
    <nav className="bg-gray-800 text-white px-6 py-3 shadow flex items-center justify-between">
      <div className="text-lg font-semibold">Berserkr Panel</div>
      <div className="flex gap-4 text-sm">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`hover:underline ${
              location.pathname === item.path ? 'font-bold text-blue-400' : ''
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
};

export default NavBar;
