import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/constants/routes';
import ThemeToggle from '@/components/ThemeToggle';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-5xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="Sparkles" className="text-primary-foreground" size={16} />
            </div>
            <span className="text-lg font-semibold">Agent</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
            <Button variant="ghost" size="sm" onClick={() => navigate(ROUTES.AGENT_DASHBOARD)}>
              Мои агенты
            </Button>
          </div>
        </div>
      </header>
      <main className="pt-14">
      <div className="container mx-auto max-w-4xl px-6">
        <div className="flex flex-col items-center justify-center min-h-[calc(100vh-3.5rem)] py-12">
            <div className="w-full max-w-2xl space-y-8 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border bg-card text-sm text-muted-foreground mb-4">
                <Icon name="Sparkles" size={14} className="text-primary" />
                <span>Создавайте ИИ-агентов за минуты</span>
              </div>

              <h1 className="text-5xl sm:text-6xl font-bold tracking-tight leading-tight">
                Ваш персональный
                <br />
                <span className="bg-gradient-to-r from-primary to-primary/60 bg-clip-text text-transparent">
                  ИИ-ассистент
                </span>
              </h1>

              <p className="text-xl text-muted-foreground max-w-xl mx-auto leading-relaxed">
                Обучите агента на ваших данных. Интегрируйте в Telegram, WhatsApp или сайт. 
                Без кода, без сложностей.
              </p>

              <div className="flex flex-col sm:flex-row gap-3 justify-center pt-4">
                <Button 
                  size="lg" 
                  className="text-base px-8 h-12 rounded-xl"
                  onClick={() => navigate(ROUTES.SCENARIO_SELECT)}
                >
                  Создать агента
                  <Icon name="ArrowRight" className="ml-2" size={18} />
                </Button>
                <Button 
                  size="lg" 
                  variant="outline"
                  className="text-base px-8 h-12 rounded-xl"
                  onClick={() => navigate(ROUTES.AGENT_DASHBOARD)}
                >
                  Посмотреть примеры
                </Button>
              </div>

              <div className="grid grid-cols-3 gap-8 pt-16 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold">10 мин</div>
                  <div className="text-sm text-muted-foreground">От идеи до запуска</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">0 строк</div>
                  <div className="text-sm text-muted-foreground">Кода писать не нужно</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold">∞</div>
                  <div className="text-sm text-muted-foreground">Возможностей</div>
                </div>
              </div>
            </div>
          </div>

          <div className="py-24 space-y-12">
            <div className="text-center space-y-3">
              <h2 className="text-3xl font-bold">Как это работает</h2>
              <p className="text-muted-foreground">Три простых шага до готового агента</p>
            </div>

            <div className="grid md:grid-cols-3 gap-6">
              <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">1</div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon name="Upload" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Загрузите знания</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Документы, FAQ, базы данных — агент изучит всё за секунды
                </p>
              </div>

              <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">2</div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon name="Wand2" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Настройте поведение</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Задайте тон общения, правила и сценарии ответов
                </p>
              </div>

              <div className="relative p-8 rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group">
                <div className="absolute -top-3 -left-3 w-8 h-8 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-bold text-sm">3</div>
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                  <Icon name="Rocket" className="text-primary" size={24} />
                </div>
                <h3 className="font-semibold text-lg mb-2">Запустите везде</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  Telegram, WhatsApp, сайт — агент работает на всех платформах
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}