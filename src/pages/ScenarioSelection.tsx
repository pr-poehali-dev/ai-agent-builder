import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/config/routes';
import { useAppDispatch } from '@/store/hooks';
import { setScenario } from '@/store/agentSlice';

interface Scenario {
  id: string;
  title: string;
  description: string;
  icon: string;
  examples: string[];
  popular?: boolean;
}

const scenarios: Scenario[] = [
  {
    id: 'customer-support',
    title: 'Поддержка клиентов',
    description: 'Автоматизируйте ответы на частые вопросы и обработку обращений',
    icon: 'Headphones',
    examples: ['Ответы на FAQ', 'Статус заказа', 'Возвраты и обмены'],
    popular: true,
  },
  {
    id: 'hr-assistant',
    title: 'HR-помощник',
    description: 'Помогайте сотрудникам с корпоративными вопросами и процедурами',
    icon: 'Users',
    examples: ['Правила компании', 'Отпуска и больничные', 'Онбординг'],
  },
  {
    id: 'sales-consultant',
    title: 'Консультант по продажам',
    description: 'Помогайте клиентам выбрать продукт и ответьте на вопросы',
    icon: 'ShoppingCart',
    examples: ['Подбор товаров', 'Характеристики', 'Цены и акции'],
    popular: true,
  },
  {
    id: 'legal-assistant',
    title: 'Юридический ассистент',
    description: 'Консультируйте по типовым юридическим вопросам',
    icon: 'Scale',
    examples: ['Договоры', 'Законодательство', 'Документы'],
  },
  {
    id: 'technical-support',
    title: 'Техподдержка',
    description: 'Помогайте решать технические проблемы пользователей',
    icon: 'Wrench',
    examples: ['Настройка ПО', 'Ошибки системы', 'Инструкции'],
  },
  {
    id: 'content-advisor',
    title: 'Контент-консультант',
    description: 'Помогайте находить нужную информацию в базе знаний',
    icon: 'BookOpen',
    examples: ['Статьи', 'Инструкции', 'Гайды'],
  },
];

export default function ScenarioSelection() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const [selectedScenario, setSelectedScenario] = useState<string | null>(null);

  const handleContinue = () => {
    if (selectedScenario) {
      dispatch(setScenario(selectedScenario));
      navigate(ROUTES.DATA_UPLOAD);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => navigate(ROUTES.HOME)}
              className="mb-4"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Button>
            
            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Выберите сценарий использования
            </h1>
            <p className="text-lg text-gray-600">
              Это поможет настроить агента под ваши задачи
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {scenarios.map((scenario) => (
              <Card
                key={scenario.id}
                className={`p-6 cursor-pointer transition-all hover:shadow-lg ${
                  selectedScenario === scenario.id
                    ? 'ring-2 ring-primary shadow-lg'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelectedScenario(scenario.id)}
              >
                {scenario.popular && (
                  <Badge className="mb-3 bg-primary/10 text-primary border-0">
                    Популярно
                  </Badge>
                )}
                
                <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4">
                  <Icon name={scenario.icon} className="text-primary" size={24} />
                </div>

                <h3 className="font-semibold text-lg mb-2">{scenario.title}</h3>
                <p className="text-gray-600 text-sm mb-4">{scenario.description}</p>

                <div className="space-y-2">
                  <p className="text-xs font-medium text-gray-500 uppercase">Примеры задач:</p>
                  <div className="flex flex-wrap gap-2">
                    {scenario.examples.map((example, idx) => (
                      <Badge 
                        key={idx} 
                        variant="secondary"
                        className="text-xs font-normal"
                      >
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>

                {selectedScenario === scenario.id && (
                  <div className="mt-4 flex items-center text-primary text-sm font-medium">
                    <Icon name="CheckCircle" size={16} className="mr-2" />
                    Выбрано
                  </div>
                )}
              </Card>
            ))}
          </div>

          <div className="flex justify-end">
            <Button 
              size="lg"
              disabled={!selectedScenario}
              onClick={handleContinue}
            >
              Продолжить
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
