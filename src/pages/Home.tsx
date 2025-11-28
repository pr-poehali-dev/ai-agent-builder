import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/config/routes';

export default function Home() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-4xl mx-auto text-center space-y-8 animate-fade-in">
          <div className="space-y-4">
            <h1 className="text-5xl font-bold tracking-tight text-gray-900">
              Конструктор ИИ-Агентов
            </h1>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              Создавайте умных ассистентов для вашего бизнеса без программирования. 
              Обучите агента на ваших данных за несколько минут.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-6 mt-12">
            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon name="Upload" className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Загрузите данные</h3>
              <p className="text-gray-600 text-sm">
                Документы, FAQ или API — система обработает всё автоматически
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon name="CheckCircle" className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Проверьте качество</h3>
              <p className="text-gray-600 text-sm">
                ИИ найдёт противоречия и неточности в ваших данных
              </p>
            </Card>

            <Card className="p-6 hover:shadow-lg transition-shadow cursor-pointer group">
              <div className="w-12 h-12 bg-primary/10 rounded-xl flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Icon name="Rocket" className="text-primary" size={24} />
              </div>
              <h3 className="font-semibold text-lg mb-2">Запустите агента</h3>
              <p className="text-gray-600 text-sm">
                Интегрируйте в Telegram, WhatsApp или на ваш сайт
              </p>
            </Card>
          </div>

          <Button 
            size="lg" 
            className="mt-8 px-8 py-6 text-lg"
            onClick={() => navigate(ROUTES.SCENARIO_SELECTION)}
          >
            Создать ИИ-агента
            <Icon name="ArrowRight" className="ml-2" size={20} />
          </Button>

          <div className="mt-16 pt-8 border-t border-gray-200">
            <div className="flex justify-center items-center gap-8 text-sm text-gray-500">
              <div className="flex items-center gap-2">
                <Icon name="Shield" size={16} />
                <span>Данные остаются приватными</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Zap" size={16} />
                <span>Готов за 10 минут</span>
              </div>
              <div className="flex items-center gap-2">
                <Icon name="Code" size={16} />
                <span>Без программирования</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
