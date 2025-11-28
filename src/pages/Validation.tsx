import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setValidationIssues, updateValidationIssue, ValidationIssue } from '@/store/agentSlice';
import CreationLayout from '@/components/CreationLayout';

const mockIssues: ValidationIssue[] = [
  {
    id: '1',
    type: 'contradiction',
    severity: 'high',
    description: 'Противоречивая информация о сроках доставки',
    sources: ['document1.pdf', 'document2.pdf'],
    status: 'pending',
  },
  {
    id: '2',
    type: 'duplicate',
    severity: 'medium',
    description: 'Дублирование информации о возврате товаров',
    sources: ['doc1.pdf', 'doc2.pdf', 'doc3.pdf'],
    status: 'pending',
  },
  {
    id: '3',
    type: 'ambiguity',
    severity: 'medium',
    description: 'Неоднозначная формулировка условий оплаты',
    sources: ['payment_terms.pdf'],
    status: 'pending',
  },
  {
    id: '4',
    type: 'contradiction',
    severity: 'low',
    description: 'Различные контактные номера телефонов',
    sources: ['contact_info.pdf', 'support.txt'],
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
    dispatch(updateValidationIssue({ id, status }));
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
    if (selectedTab === 'resolved') return issue.status === 'resolved' || issue.status === 'approved';
    return true;
  });

  const pendingCount = validationIssues.filter(i => i.status === 'pending').length;
  const resolvedCount = validationIssues.filter(i => i.status !== 'pending').length;

  return (
    <CreationLayout
      step={3}
      title="Валидация данных"
      description="Проверьте найденные проблемы и утвердите корректность данных"
      onBack={() => navigate(ROUTES.DATA_UPLOAD)}
    >
      <div className="max-w-5xl space-y-6">
        {isAnalyzing ? (
          <Card className="p-12">
            <div className="text-center space-y-6">
              <div className="w-20 h-20 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto animate-pulse">
                <Icon name="Search" className="text-primary" size={40} />
              </div>
              <div>
                <h3 className="text-xl font-semibold mb-2">Анализируем ваши данные</h3>
                <p className="text-muted-foreground">
                  ИИ проверяет документы на противоречия и неточности...
                </p>
              </div>
              <Progress value={60} className="max-w-xs mx-auto" />
            </div>
          </Card>
        ) : (
            <>
          <div className="grid grid-cols-3 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-primary/10 rounded-lg flex items-center justify-center">
                  <Icon name="AlertCircle" className="text-primary" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{validationIssues.length}</p>
                  <p className="text-sm text-muted-foreground">Всего найдено</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-yellow-500/10 rounded-lg flex items-center justify-center">
                  <Icon name="Clock" className="text-yellow-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{pendingCount}</p>
                  <p className="text-sm text-muted-foreground">Требует действия</p>
                </div>
              </div>
            </Card>

            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-500/10 rounded-lg flex items-center justify-center">
                  <Icon name="CheckCircle" className="text-green-600" size={20} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{resolvedCount}</p>
                  <p className="text-sm text-muted-foreground">Решено</p>
                </div>
              </div>
            </Card>
          </div>

          <Tabs value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList>
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

            <TabsContent value={selectedTab} className="space-y-4 mt-6">
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
                        <p className="text-muted-foreground text-sm">
                          Источники: {issue.sources.join(', ')}
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
                          onClick={() => handleIssueAction(issue.id, 'resolved')}
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

          {!isAnalyzing && (
            <div className="flex justify-end">
              <Button 
                size="lg"
                disabled={pendingCount > 0}
                onClick={() => navigate(ROUTES.AGENT_PUBLISH)}
                className="gap-2"
              >
                Опубликовать агента
                <Icon name="ArrowRight" size={20} />
              </Button>
            </div>
          )}
        )}
      </div>
    </CreationLayout>
  );
}