import { useNavigate } from 'react-router-dom';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import Icon from '@/components/ui/icon';

const Index = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-20">
        <div className="text-center">
          <div className="mb-8 inline-flex h-20 w-20 items-center justify-center rounded-2xl bg-primary/10">
            <Icon name="Bot" className="h-10 w-10 text-primary" />
          </div>
          
          <h1 className="mb-6 text-5xl font-semibold text-foreground">
            Конструктор ИИ-агентов
          </h1>
          
          <p className="mb-4 text-xl text-muted-foreground">
            Создавайте, обучайте и внедряйте частных ИИ-агентов
          </p>
          
          <p className="mx-auto mb-12 max-w-2xl text-lg text-muted-foreground">
            Адаптируйте агента под ваши данные и бизнес-процессы без кода и собственной инфраструктуры
          </p>

          <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-center">
            <Button size="lg" onClick={() => navigate(ROUTES.SCENARIO_SELECT)}>
              Создать агента
              <Icon name="ArrowRight" className="ml-2 h-5 w-5" />
            </Button>
            
            <Button size="lg" variant="outline">
              <Icon name="Play" className="mr-2 h-5 w-5" />
              Посмотреть демо
            </Button>
          </div>
        </div>

        <div className="mt-24 grid gap-8 md:grid-cols-3">
          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon name="Upload" className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Загрузите данные</h3>
            <p className="text-muted-foreground">
              PDF, документы, базы знаний или подключите API
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon name="CheckCircle" className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Валидация данных</h3>
            <p className="text-muted-foreground">
              Автоматическая проверка на противоречия и ошибки
            </p>
          </div>

          <div className="text-center">
            <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
              <Icon name="Rocket" className="h-6 w-6 text-primary" />
            </div>
            <h3 className="mb-2 text-lg font-medium">Публикуйте агента</h3>
            <p className="text-muted-foreground">
              API, виджет для сайта, Telegram или WhatsApp
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;