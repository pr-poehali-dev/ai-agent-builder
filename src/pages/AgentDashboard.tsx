import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAgents, deleteAgent, Agent } from '@/store/agentSlice';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const AgentDashboard = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { agents } = useAppSelector((state) => state.agent);

  useEffect(() => {
    const mockAgents: Agent[] = [
      {
        id: '1',
        name: 'Агент поддержки клиентов',
        scenario: 'support',
        status: 'published',
        apiKey: 'sk_' + crypto.randomUUID().replace(/-/g, '').substring(0, 32),
        createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
        dataSources: [
          { id: '1', name: 'FAQ.pdf', type: 'document', status: 'ready', uploadedAt: new Date().toISOString() },
          { id: '2', name: 'Knowledge Base', type: 'database', status: 'ready', uploadedAt: new Date().toISOString() },
        ],
        stats: {
          totalRequests: 1247,
          requestsToday: 89,
          avgResponseTime: 1.2,
          satisfactionRate: 94,
        },
      },
      {
        id: '2',
        name: 'HR Ассистент',
        scenario: 'hr',
        status: 'ready',
        apiKey: 'sk_' + crypto.randomUUID().replace(/-/g, '').substring(0, 32),
        createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
        dataSources: [
          { id: '3', name: 'Employee Handbook', type: 'document', status: 'ready', uploadedAt: new Date().toISOString() },
        ],
        stats: {
          totalRequests: 423,
          requestsToday: 34,
          avgResponseTime: 1.8,
          satisfactionRate: 91,
        },
      },
      {
        id: '3',
        name: 'Агент продаж',
        scenario: 'sales',
        status: 'training',
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
        dataSources: [
          { id: '4', name: 'Products Catalog', type: 'api', status: 'processing', uploadedAt: new Date().toISOString() },
        ],
        stats: {
          totalRequests: 0,
          requestsToday: 0,
          avgResponseTime: 0,
          satisfactionRate: 0,
        },
      },
    ];

    if (agents.length === 0) {
      dispatch(setAgents(mockAgents));
    }
  }, [dispatch, agents.length]);

  const handleDeleteAgent = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (confirm('Вы уверены, что хотите удалить этого агента?')) {
      dispatch(deleteAgent(id));
    }
  };

  const getStatusBadge = (status: Agent['status']) => {
    switch (status) {
      case 'published':
        return <Badge className="bg-green-100 text-green-700 hover:bg-green-100">Опубликован</Badge>;
      case 'ready':
        return <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-100">Готов</Badge>;
      case 'training':
        return <Badge className="bg-yellow-100 text-yellow-700 hover:bg-yellow-100">Обучается</Badge>;
      case 'draft':
        return <Badge variant="secondary">Черновик</Badge>;
    }
  };

  const getScenarioIcon = (scenario: string) => {
    switch (scenario) {
      case 'support':
        return 'Headphones';
      case 'hr':
        return 'Users';
      case 'sales':
        return 'TrendingUp';
      case 'legal':
        return 'Scale';
      default:
        return 'Bot';
    }
  };

  const totalRequests = agents.reduce((sum, agent) => sum + (agent.stats?.totalRequests || 0), 0);
  const activeAgents = agents.filter(a => a.status === 'published' || a.status === 'ready').length;
  const avgSatisfaction = agents.length > 0
    ? Math.round(agents.reduce((sum, agent) => sum + (agent.stats?.satisfactionRate || 0), 0) / agents.length)
    : 0;

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-7xl py-8">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-semibold text-foreground">Панель управления</h1>
            <p className="text-muted-foreground">Управляйте вашими ИИ-агентами</p>
          </div>
          <Button size="lg" onClick={() => navigate(ROUTES.SCENARIO_SELECT)}>
            <Icon name="Plus" className="mr-2 h-5 w-5" />
            Создать агента
          </Button>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего агентов</p>
                  <p className="text-3xl font-semibold">{agents.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon name="Bot" className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Активных</p>
                  <p className="text-3xl font-semibold">{activeAgents}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-100">
                  <Icon name="CheckCircle" className="h-6 w-6 text-green-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Всего запросов</p>
                  <p className="text-3xl font-semibold">{totalRequests.toLocaleString()}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-100">
                  <Icon name="MessageSquare" className="h-6 w-6 text-blue-600" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Удовлетворённость</p>
                  <p className="text-3xl font-semibold">{avgSatisfaction}%</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100">
                  <Icon name="Star" className="h-6 w-6 text-amber-600" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <h2 className="mb-4 text-xl font-semibold">Ваши агенты</h2>
          {agents.length === 0 ? (
            <Card>
              <CardContent className="py-16 text-center">
                <Icon name="Bot" className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
                <h3 className="mb-2 text-lg font-medium">У вас пока нет агентов</h3>
                <p className="mb-6 text-muted-foreground">
                  Создайте своего первого ИИ-агента за несколько минут
                </p>
                <Button onClick={() => navigate(ROUTES.SCENARIO_SELECT)}>
                  <Icon name="Plus" className="mr-2 h-4 w-4" />
                  Создать первого агента
                </Button>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {agents.map((agent) => (
                <Card
                  key={agent.id}
                  className="cursor-pointer transition-all hover:shadow-lg"
                  onClick={() => navigate(`/agent/${agent.id}`)}
                >
                  <CardHeader>
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                        <Icon name={getScenarioIcon(agent.scenario)} className="h-6 w-6 text-primary" />
                      </div>
                      {getStatusBadge(agent.status)}
                    </div>
                    <CardTitle className="line-clamp-1">{agent.name}</CardTitle>
                    <CardDescription>
                      Создан {new Date(agent.createdAt).toLocaleDateString('ru-RU')}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Запросов</span>
                        <span className="font-medium">{agent.stats?.totalRequests.toLocaleString() || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Сегодня</span>
                        <span className="font-medium">{agent.stats?.requestsToday || 0}</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Время ответа</span>
                        <span className="font-medium">{agent.stats?.avgResponseTime.toFixed(1)}s</span>
                      </div>
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-muted-foreground">Оценка</span>
                        <span className="font-medium">{agent.stats?.satisfactionRate}%</span>
                      </div>

                      <div className="flex gap-2 pt-3">
                        <Button
                          size="sm"
                          variant="outline"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/agent/${agent.id}`);
                          }}
                        >
                          <Icon name="Settings" className="mr-2 h-4 w-4" />
                          Настройки
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => handleDeleteAgent(agent.id, e)}
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default AgentDashboard;
