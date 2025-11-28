import { ReactNode, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ThemeToggle from '@/components/ThemeToggle';
import { ROUTES } from '@/constants/routes';

interface CreationLayoutProps {
  children: ReactNode;
  step: number;
  title: string;
  description?: string;
  maxSteps?: number;
  onBack?: () => void;
}

export default function CreationLayout({
  children,
  step,
  title,
  description,
  maxSteps = 4,
  onBack,
}: CreationLayoutProps) {
  const navigate = useNavigate();
  const [sidebarCollapsed] = useState(true);

  const progressValue = (step / maxSteps) * 100;

  return (
    <div className="flex min-h-screen bg-background">
      <aside
        className={`fixed left-0 top-0 z-40 h-screen border-r bg-card transition-all duration-300 w-16`}
      >
        <div className="flex h-full flex-col">
          <div className="flex h-16 items-center justify-center border-b">
            <Icon name="Sparkles" className="text-primary" size={28} />
          </div>

          <nav className="flex-1 space-y-1 p-3">
            <button
              onClick={() => navigate(ROUTES.AGENT_DASHBOARD)}
              className="flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon name="LayoutDashboard" size={20} />
            </button>
          </nav>

          <div className="border-t p-3">
            <button
              onClick={() => navigate(ROUTES.HOME)}
              className="flex w-full items-center justify-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-accent-foreground"
            >
              <Icon name="Home" size={20} />
            </button>
          </div>
        </div>
      </aside>

      <div className={`flex-1 transition-all duration-300 ml-16`}>
        <header className="sticky top-0 z-30 flex h-16 items-center justify-between border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-6">
          <div className="flex items-center gap-4">
            {onBack && (
              <Button variant="ghost" size="icon" onClick={onBack} className="rounded-lg">
                <Icon name="ArrowLeft" size={20} />
              </Button>
            )}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="text-sm">
                Шаг {step} из {maxSteps}
              </Badge>
              <Progress value={progressValue} className="w-32" />
            </div>
          </div>

          <ThemeToggle />
        </header>

        <main className="container max-w-6xl py-8">
          <div className="mb-8 animate-fade-in">
            <h1 className="text-4xl font-bold mb-3">{title}</h1>
            {description && <p className="text-lg text-muted-foreground">{description}</p>}
          </div>

          {children}
        </main>
      </div>
    </div>
  );
}
