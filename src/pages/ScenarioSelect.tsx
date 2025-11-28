import { useNavigate } from 'react-router-dom';
import { useAppDispatch } from '@/store/hooks';
import { setScenario } from '@/store/agentSlice';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import type { Scenario } from '@/store/agentSlice';

const scenarios: Scenario[] = [
  {
    id: 'support',
    title: 'Поддержка клиентов',
    description: 'Агент для обработки запросов клиентов, ответов на вопросы и решения типовых проблем',
    icon: 'Headphones',
  },
  {
    id: 'hr',
    title: 'HR-помощник',
    description: 'Внутренний ассистент для сотрудников: отпуска, документы, корпоративные политики',
    icon: 'Users',
  },
  {
    id: 'sales',
    title: 'Консультант по продажам',
    description: 'Помощь клиентам в выборе продуктов, консультации по характеристикам и ценам',
    icon: 'TrendingUp',
  },
  {
    id: 'legal',
    title: 'Юридический ассистент',
    description: 'Поиск в правовых документах, консультации по договорам и процедурам',
    icon: 'Scale',
  },
  {
    id: 'custom',
    title: 'Свой сценарий',
    description: 'Создайте агента под уникальные задачи вашего бизнеса',
    icon: 'Sparkles',
  },
];

const ScenarioSelect = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();

  const handleSelectScenario = (scenario: Scenario) => {
    dispatch(setScenario(scenario));
    navigate(ROUTES.DATA_UPLOAD);
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-12">
        <div className="mb-12 text-center">
          <h1 className="mb-4 text-4xl font-semibold text-foreground">
            Выберите сценарий использования
          </h1>
          <p className="text-lg text-muted-foreground">
            Система адаптирует интерфейс и рекомендации под выбранный тип агента
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {scenarios.map((scenario) => (
            <Card
              key={scenario.id}
              className="group cursor-pointer border-2 transition-all hover:border-primary hover:shadow-lg"
              onClick={() => handleSelectScenario(scenario)}
            >
              <CardHeader>
                <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 transition-colors group-hover:bg-primary/20">
                  <Icon name={scenario.icon} className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-xl">{scenario.title}</CardTitle>
                <CardDescription className="text-base leading-relaxed">
                  {scenario.description}
                </CardDescription>
              </CardHeader>
              <CardContent>
                <Button variant="ghost" className="w-full group-hover:bg-primary/10">
                  Выбрать
                  <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="mt-12 text-center">
          <Button variant="outline" onClick={() => navigate(ROUTES.HOME)}>
            <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Назад
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ScenarioSelect;
