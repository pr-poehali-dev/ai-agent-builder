import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAppSelector, useAppDispatch } from '@/store/hooks';
import { updateAgentStatus, deleteAgent } from '@/store/agentSlice';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Switch } from '@/components/ui/switch';
import Icon from '@/components/ui/icon';

const AgentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const agent = useAppSelector((state) => state.agent.agents.find((a) => a.id === id));
  const [isEditing, setIsEditing] = useState(false);

  if (!agent) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <Card className="max-w-md">
          <CardContent className="py-16 text-center">
            <Icon name="AlertCircle" className="mx-auto mb-4 h-16 w-16 text-muted-foreground" />
            <h3 className="mb-2 text-lg font-medium">Агент не найден</h3>
            <p className="mb-6 text-muted-foreground">Возможно, он был удален</p>
            <Button onClick={() => navigate(ROUTES.AGENT_DASHBOARD)}>
              <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
              Вернуться к дашборду
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const handleDelete = () => {
    if (confirm('Вы уверены, что хотите удалить этого агента?')) {
      dispatch(deleteAgent(agent.id));
      navigate(ROUTES.AGENT_DASHBOARD);
    }
  };

  const handleToggleStatus = () => {
    const newStatus = agent.status === 'published' ? 'ready' : 'published';
    dispatch(updateAgentStatus({ id: agent.id, status: newStatus }));
  };

  const chartData = [
    { date: '21 нояб', requests: 45 },
    { date: '22 нояб', requests: 52 },
    { date: '23 нояб', requests: 38 },
    { date: '24 нояб', requests: 67 },
    { date: '25 нояб', requests: 73 },
    { date: '26 нояб', requests: 81 },
    { date: '27 нояб', requests: 89 },
  ];

  const maxRequests = Math.max(...chartData.map((d) => d.requests));

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-6xl py-8">
        <div className="mb-8 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.AGENT_DASHBOARD)}>
              <Icon name="ArrowLeft" className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-foreground">{agent.name}</h1>
              <p className="text-muted-foreground">
                Создан {new Date(agent.createdAt).toLocaleDateString('ru-RU')}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <Badge
              className={
                agent.status === 'published'
                  ? 'bg-green-100 text-green-700'
                  : agent.status === 'ready'
                  ? 'bg-blue-100 text-blue-700'
                  : 'bg-yellow-100 text-yellow-700'
              }
            >
              {agent.status === 'published'
                ? 'Опубликован'
                : agent.status === 'ready'
                ? 'Готов'
                : 'Обучается'}
            </Badge>
            <Button variant="destructive" size="sm" onClick={handleDelete}>
              <Icon name="Trash2" className="mr-2 h-4 w-4" />
              Удалить
            </Button>
          </div>
        </div>

        <div className="mb-8 grid gap-6 md:grid-cols-4">
          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-semibold">{agent.stats?.totalRequests.toLocaleString() || 0}</p>
                <p className="text-sm text-muted-foreground">Всего запросов</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-semibold">{agent.stats?.requestsToday || 0}</p>
                <p className="text-sm text-muted-foreground">Сегодня</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-semibold">{agent.stats?.avgResponseTime.toFixed(1)}s</p>
                <p className="text-sm text-muted-foreground">Время ответа</p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="text-center">
                <p className="text-3xl font-semibold">{agent.stats?.satisfactionRate}%</p>
                <p className="text-sm text-muted-foreground">Удовлетворённость</p>
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList>
            <TabsTrigger value="overview">
              <Icon name="BarChart3" className="mr-2 h-4 w-4" />
              Обзор
            </TabsTrigger>
            <TabsTrigger value="data">
              <Icon name="Database" className="mr-2 h-4 w-4" />
              Данные
            </TabsTrigger>
            <TabsTrigger value="settings">
              <Icon name="Settings" className="mr-2 h-4 w-4" />
              Настройки
            </TabsTrigger>
            <TabsTrigger value="integration">
              <Icon name="Code" className="mr-2 h-4 w-4" />
              Интеграция
            </TabsTrigger>
          </TabsList>

          <TabsContent value="overview">
            <Card>
              <CardHeader>
                <CardTitle>Активность за последние 7 дней</CardTitle>
                <CardDescription>Количество запросов к агенту</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {chartData.map((item, index) => (
                    <div key={index} className="flex items-center gap-4">
                      <span className="w-16 text-sm text-muted-foreground">{item.date}</span>
                      <div className="flex-1">
                        <div className="h-8 overflow-hidden rounded-lg bg-muted">
                          <div
                            className="h-full bg-primary transition-all"
                            style={{ width: `${(item.requests / maxRequests) * 100}%` }}
                          />
                        </div>
                      </div>
                      <span className="w-12 text-right text-sm font-medium">{item.requests}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="data">
            <Card>
              <CardHeader>
                <CardTitle>Источники данных</CardTitle>
                <CardDescription>
                  Документы и базы данных, которые использует агент
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {agent.dataSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between rounded-lg border p-4"
                    >
                      <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-muted">
                          <Icon
                            name={
                              source.type === 'document'
                                ? 'FileText'
                                : source.type === 'api'
                                ? 'Globe'
                                : 'Database'
                            }
                            className="h-5 w-5"
                          />
                        </div>
                        <div>
                          <p className="font-medium">{source.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {source.type === 'document'
                              ? 'Документ'
                              : source.type === 'api'
                              ? 'API'
                              : 'База данных'}
                          </p>
                        </div>
                      </div>
                      <Badge
                        variant={source.status === 'ready' ? 'default' : 'secondary'}
                        className={
                          source.status === 'ready'
                            ? 'bg-green-100 text-green-700'
                            : 'bg-yellow-100 text-yellow-700'
                        }
                      >
                        {source.status === 'ready' ? 'Готов' : 'Обработка'}
                      </Badge>
                    </div>
                  ))}
                  <Button variant="outline" className="w-full">
                    <Icon name="Plus" className="mr-2 h-4 w-4" />
                    Добавить источник
                  </Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="settings">
            <Card>
              <CardHeader>
                <CardTitle>Настройки агента</CardTitle>
                <CardDescription>Управление параметрами и поведением</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="agent-name">Название агента</Label>
                  <Input
                    id="agent-name"
                    value={agent.name}
                    disabled={!isEditing}
                    className={!isEditing ? 'opacity-60' : ''}
                  />
                </div>

                <div className="flex items-center justify-between rounded-lg border p-4">
                  <div>
                    <p className="font-medium">Статус публикации</p>
                    <p className="text-sm text-muted-foreground">
                      {agent.status === 'published'
                        ? 'Агент доступен для запросов'
                        : 'Агент не принимает запросы'}
                    </p>
                  </div>
                  <Switch
                    checked={agent.status === 'published'}
                    onCheckedChange={handleToggleStatus}
                    disabled={agent.status === 'training'}
                  />
                </div>

                <div className="space-y-2">
                  <Label>Модель</Label>
                  <Input value="GPT-4 (RAG)" disabled className="opacity-60" />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="temperature">Температура (креативность)</Label>
                  <Input
                    id="temperature"
                    type="number"
                    min="0"
                    max="1"
                    step="0.1"
                    defaultValue="0.7"
                    disabled={!isEditing}
                    className={!isEditing ? 'opacity-60' : ''}
                  />
                </div>

                <div className="flex gap-3">
                  {isEditing ? (
                    <>
                      <Button onClick={() => setIsEditing(false)}>
                        <Icon name="Save" className="mr-2 h-4 w-4" />
                        Сохранить
                      </Button>
                      <Button variant="outline" onClick={() => setIsEditing(false)}>
                        Отмена
                      </Button>
                    </>
                  ) : (
                    <Button onClick={() => setIsEditing(true)}>
                      <Icon name="Edit" className="mr-2 h-4 w-4" />
                      Редактировать
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="integration">
            <Card>
              <CardHeader>
                <CardTitle>API ключ</CardTitle>
                <CardDescription>Используйте для интеграции в ваше приложение</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label>API Key</Label>
                  <div className="flex gap-2">
                    <Input value={agent.apiKey} readOnly className="font-mono text-sm" />
                    <Button variant="outline" size="icon">
                      <Icon name="Copy" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="space-y-2">
                  <Label>Endpoint</Label>
                  <div className="flex gap-2">
                    <Input
                      value={`https://api.aiagent.platform/v1/chat/${agent.id}`}
                      readOnly
                      className="font-mono text-sm"
                    />
                    <Button variant="outline" size="icon">
                      <Icon name="Copy" className="h-4 w-4" />
                    </Button>
                  </div>
                </div>

                <div className="rounded-lg bg-muted p-4">
                  <p className="mb-2 text-sm font-medium">Пример запроса (cURL)</p>
                  <pre className="overflow-x-auto text-xs">
{`curl -X POST https://api.aiagent.platform/v1/chat/${agent.id} \\
  -H "Authorization: Bearer ${agent.apiKey}" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Ваш вопрос"}'`}
                  </pre>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default AgentDetails;
