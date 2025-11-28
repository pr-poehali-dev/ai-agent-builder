import { useNavigate, useLocation } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import Icon from '@/components/ui/icon';
import { cn } from '@/lib/utils';

interface SidebarProps {
  isCollapsed?: boolean;
}

export default function Sidebar({ isCollapsed = false }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();

  const menuItems = [
    { icon: 'LayoutDashboard', label: 'Дашборд', path: ROUTES.AGENT_DASHBOARD },
    { icon: 'Bot', label: 'Агенты', path: ROUTES.AGENT_DASHBOARD },
    { icon: 'Plus', label: 'Создать', path: ROUTES.SCENARIO_SELECT },
    { icon: 'Settings', label: 'Настройки', path: '/settings' },
  ];

  return (
    <aside
      className={cn(
        'fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300',
        isCollapsed ? 'w-16' : 'w-64'
      )}
    >
      <div className="flex h-full flex-col">
        <div className="flex h-16 items-center border-b px-4">
          {!isCollapsed && (
            <div className="flex items-center gap-2">
              <Icon name="Sparkles" className="text-primary" size={28} />
              <span className="text-lg font-semibold">AI Agents</span>
            </div>
          )}
          {isCollapsed && (
            <Icon name="Sparkles" className="mx-auto text-primary" size={28} />
          )}
        </div>

        <nav className="flex-1 space-y-1 p-3">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path;
            return (
              <button
                key={item.path}
                onClick={() => navigate(item.path)}
                className={cn(
                  'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors',
                  isActive
                    ? 'bg-primary text-primary-foreground'
                    : 'text-muted-foreground hover:bg-accent hover:text-accent-foreground',
                  isCollapsed && 'justify-center'
                )}
              >
                <Icon name={item.icon as any} size={20} />
                {!isCollapsed && <span>{item.label}</span>}
              </button>
            );
          })}
        </nav>

        <div className="border-t p-3">
          <button
            onClick={() => navigate(ROUTES.HOME)}
            className={cn(
              'flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground',
              isCollapsed && 'justify-center'
            )}
          >
            <Icon name="Home" size={20} />
            {!isCollapsed && <span>На главную</span>}
          </button>
        </div>
      </div>
    </aside>
  );
}
