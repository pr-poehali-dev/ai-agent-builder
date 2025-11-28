import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAgents, deleteAgent, Agent } from '@/store/agentSlice';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import ThemeToggle from '@/components/ThemeToggle';

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
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
            <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
              <Icon name="Sparkles" className="text-primary-foreground" size={16} />
            </div>
            <span className="text-lg font-semibold">Agent</span>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

        <main className="pt-14">
        <div className="container mx-auto max-w-7xl px-6 py-12">
          <div className="mb-12 text-center space-y-4">
            <h1 className="text-4xl font-bold">Ваши агенты</h1>
            <p className="text-muted-foreground text-lg">Управляйте ИИ-ассистентами из одного места</p>
          </div>

          {agents.length > 0 && (
            <div className="mb-12 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
              <div className="text-center p-4 rounded-xl bg-card border">
                <div className="text-2xl font-bold">{agents.length}</div>
                <div className="text-sm text-muted-foreground">Всего</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border">
                <div className="text-2xl font-bold text-green-600">{activeAgents}</div>
                <div className="text-sm text-muted-foreground">Активных</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border">
                <div className="text-2xl font-bold">{totalRequests.toLocaleString()}</div>
                <div className="text-sm text-muted-foreground">Запросов</div>
              </div>
              <div className="text-center p-4 rounded-xl bg-card border">
                <div className="text-2xl font-bold">{avgSatisfaction}%</div>
                <div className="text-sm text-muted-foreground">Довольны</div>
              </div>
            </div>
          )}

          {agents.length === 0 ? (
            <div className="max-w-md mx-auto text-center py-16">
              <div className="mb-6 inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-primary/10">
                <Icon name="Bot" className="h-10 w-10 text-primary" />
              </div>
              <h2 className="text-2xl font-bold mb-3">Создайте первого агента</h2>
              <p className="text-muted-foreground mb-8 text-lg">
                Займёт всего несколько минут
              </p>
              <Button size="lg" onClick={() => navigate(ROUTES.SCENARIO_SELECT)} className="px-8 h-12 rounded-xl">
                <Icon name="Plus" className="mr-2 h-5 w-5" />
                Создать агента
              </Button>
            </div>
          ) : (
            <>
              <div className="flex justify-center mb-8">
                <Button 
                  size="lg" 
                  onClick={() => navigate(ROUTES.SCENARIO_SELECT)} 
                  className="px-8 h-12 rounded-xl"
                >
                  <Icon name="Plus" className="mr-2 h-5 w-5" />
                  Создать агента
                </Button>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {agents.map((agent) => (
                  <Card
                    key={agent.id}
                    className="cursor-pointer transition-all hover:shadow-xl hover:-translate-y-1 border-2 hover:border-primary/50 overflow-hidden group"
                    onClick={() => navigate(`/agent/${agent.id}`)}
                  >
                    <CardHeader className="pb-4">
                      <div className="flex items-start justify-between mb-3">
                        <div className="flex h-14 w-14 items-center justify-center rounded-xl bg-primary/10 group-hover:bg-primary/20 transition-colors">
                          <Icon name={getScenarioIcon(agent.scenario)} className="h-7 w-7 text-primary" />
                        </div>
                        {getStatusBadge(agent.status)}
                      </div>
                      <CardTitle className="text-xl leading-tight">{agent.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {new Date(agent.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'long' })}
                      </CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {agent.stats && (
                        <div className="grid grid-cols-3 gap-3 pb-4 border-b">
                          <div className="text-center">
                            <p className="text-2xl font-bold">{agent.stats.totalRequests.toLocaleString()}</p>
                            <p className="text-xs text-muted-foreground">запросов</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{agent.stats.requestsToday}</p>
                            <p className="text-xs text-muted-foreground">сегодня</p>
                          </div>
                          <div className="text-center">
                            <p className="text-2xl font-bold">{agent.stats.satisfactionRate}%</p>
                            <p className="text-xs text-muted-foreground">довольны</p>
                          </div>
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          className="flex-1"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/agent/${agent.id}`);
                          }}
                        >
                          Открыть
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => handleDeleteAgent(agent.id, e)}
                        >
                          <Icon name="Trash2" className="h-4 w-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          )}
        </div>
        </main>
    </div>
  );
};

export default AgentDashboard;