import { NavLink } from 'react-router-dom'

// NavLink is like <Link> but it knows when its own route is the current page,
// so we can style the active link differently (see the `isActive` render prop).
const LINKS = [
  { to: '/dashboard', label: 'Dashboard' },
  { to: '/projects', label: 'Projects' },
  { to: '/tasks', label: 'My Tasks' },
  { to: '/notes', label: 'Notes' },
  { to: '/profile', label: 'Profile' },
]

export default function Sidebar() {
  return (
    <aside className="sidebar">
      <div className="sidebar-brand">
        <div className="logo-mark">PC</div>
        <span style={{ fontFamily: 'var(--font-heading)', fontWeight: 700 }}>Project Camp</span>
      </div>
      <nav className="sidebar-nav">
        {LINKS.map((link) => (
          <NavLink
            key={link.to}
            to={link.to}
            className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}
          >
            <span className="sidebar-icon" />
            {link.label}
          </NavLink>
        ))}
      </nav>
    </aside>
  )
}
