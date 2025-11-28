import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setValidationIssues, updateIssueStatus, ValidationIssue } from '@/store/agentSlice';

const mockIssues: ValidationIssue[] = [
  {
    id: '1',
    type: 'contradiction',
    severity: 'high',
    description: 'Противоречивая информация о сроках доставки',
    fragment: 'В документе 1 указано "доставка 3 дня", в документе 2 - "доставка 7 дней"',
    status: 'pending',
  },
  {
    id: '2',
    type: 'duplicate',
    severity: 'medium',
    description: 'Дублирование информации о возврате товаров',
    fragment: 'Одинаковая информация найдена в 3 разных документах',
    status: 'pending',
  },
  {
    id: '3',
    type: 'ambiguity',
    severity: 'medium',
    description: 'Неоднозначная формулировка условий оплаты',
    fragment: '"Оплата возможна различными способами" - требуется уточнение',
    status: 'pending',
  },
  {
    id: '4',
    type: 'contradiction',
    severity: 'low',
    description: 'Различные контактные номера телефонов',
    fragment: 'Найдено 2 разных номера службы поддержки',
    status: 'pending',
  },
];

export default function Validation() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const validationIssues = useAppSelector((state) => state.agent.validationIssues);
  const [isAnalyzing, setIsAnalyzing] = useState(true);
  const [selectedTab, setSelectedTab] = useState('all');

  useEffect(() => {
    const timer = setTimeout(() => {
      dispatch(setValidationIssues(mockIssues));
      setIsAnalyzing(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, [dispatch]);

  const handleIssueAction = (id: string, status: ValidationIssue['status']) => {
    dispatch(updateIssueStatus({ id, status }));
  };

  const getSeverityColor = (severity: ValidationIssue['severity']) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  const getTypeLabel = (type: ValidationIssue['type']) => {
    switch (type) {
      case 'contradiction': return 'Противоречие';
      case 'duplicate': return 'Дубликат';
      case 'ambiguity': return 'Неоднозначность';
    }
  };

  const filteredIssues = validationIssues.filter(issue => {
    if (selectedTab === 'all') return true;
    if (selectedTab === 'pending') return issue.status === 'pending';
    if (selectedTab === 'resolved') return issue.status === 'fixed' || issue.status === 'approved';
    return true;
  });

  const pendingCount = validationIssues.filter(i => i.status === 'pending').length;
  const resolvedCount = validationIssues.filter(i => i.status !== 'pending').length;

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-5xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => navigate(ROUTES.DATA_UPLOAD)}
              className="mb-4"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="text-sm">
                Шаг 3 из 4
              </Badge>
              <Progress value={75} className="flex-1 max-w-xs" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Валидация данных
            </h1>
            <p className="text-lg text-gray-600">
              Проверьте найденные проблемы и утвердите корректность данных
            </p>
          </div>

          {isAnalyzing ? (
            <Card className="p-12">
              <div className="text-center space-y-6">
                <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                  <Icon name="Search" className="text-primary" size={40} />
                </div>
                <div>
                  <h3 className="text-xl font-semibold mb-2">Анализируем ваши данные</h3>
                  <p className="text-gray-600">
                    ИИ проверяет документы на противоречия и неточности...
                  </p>
                </div>
                <Progress value={60} className="max-w-xs mx-auto" />
              </div>
            </Card>
          ) : (
            <>
              <div className="grid grid-cols-3 gap-4 mb-6">
                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Icon name="AlertCircle" className="text-blue-600" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{validationIssues.length}</p>
                      <p className="text-sm text-gray-600">Всего найдено</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                      <Icon name="Clock" className="text-yellow-600" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{pendingCount}</p>
                      <p className="text-sm text-gray-600">Требует действия</p>
                    </div>
                  </div>
                </Card>

                <Card className="p-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                      <Icon name="CheckCircle" className="text-green-600" size={20} />
                    </div>
                    <div>
                      <p className="text-2xl font-bold">{resolvedCount}</p>
                      <p className="text-sm text-gray-600">Решено</p>
                    </div>
                  </div>
                </Card>
              </div>

              <Tabs value={selectedTab} onValueChange={setSelectedTab}>
                <TabsList className="mb-6">
                  <TabsTrigger value="all">
                    Все ({validationIssues.length})
                  </TabsTrigger>
                  <TabsTrigger value="pending">
                    Требуют внимания ({pendingCount})
                  </TabsTrigger>
                  <TabsTrigger value="resolved">
                    Решенные ({resolvedCount})
                  </TabsTrigger>
                </TabsList>

                <TabsContent value={selectedTab} className="space-y-4">
                  {filteredIssues.map((issue) => (
                    <Card key={issue.id} className="p-6">
                      <div className="space-y-4">
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <Badge variant="outline" className={getSeverityColor(issue.severity)}>
                                {getTypeLabel(issue.type)}
                              </Badge>
                              <Badge variant="outline">
                                {issue.severity === 'high' ? 'Высокий' : issue.severity === 'medium' ? 'Средний' : 'Низкий'} приоритет
                              </Badge>
                            </div>
                            <h3 className="font-semibold text-lg mb-2">{issue.description}</h3>
                            <p className="text-gray-600 text-sm bg-gray-50 p-3 rounded-lg">
                              {issue.fragment}
                            </p>
                          </div>
                        </div>

                        {issue.status === 'pending' ? (
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIssueAction(issue.id, 'approved')}
                            >
                              <Icon name="Check" size={16} className="mr-1" />
                              Подтвердить корректность
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => handleIssueAction(issue.id, 'fixed')}
                            >
                              <Icon name="Edit" size={16} className="mr-1" />
                              Отметить как исправлено
                            </Button>
                          </div>
                        ) : (
                          <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                            <Icon name="CheckCircle" size={16} />
                            {issue.status === 'approved' ? 'Подтверждено' : 'Исправлено'}
                          </div>
                        )}
                      </div>
                    </Card>
                  ))}
                </TabsContent>
              </Tabs>
            </>
          )}

          {!isAnalyzing && (
            <div className="flex justify-between mt-8">
              <Button 
                variant="outline"
                onClick={() => navigate(ROUTES.DATA_UPLOAD)}
              >
                <Icon name="ArrowLeft" className="mr-2" size={16} />
                Назад
              </Button>
              <Button 
                size="lg"
                disabled={pendingCount > 0}
                onClick={() => navigate(ROUTES.PUBLISH)}
              >
                Опубликовать агента
                <Icon name="ArrowRight" className="ml-2" size={20} />
              </Button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
