import { useState, useRef, useEffect } from 'react';
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
import { Textarea } from '@/components/ui/textarea';
import Icon from '@/components/ui/icon';
import ThemeToggle from '@/components/ThemeToggle';

interface Message {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

const AgentDetails = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const agent = useAppSelector((state) => state.agent.agents.find((a) => a.id === id));
  const [isEditing, setIsEditing] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [inputMessage, setInputMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

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

  const handleSendMessage = async () => {
    if (!inputMessage.trim() || isLoading) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: 'user',
      content: inputMessage,
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInputMessage('');
    setIsLoading(true);

    setTimeout(() => {
      const assistantMessage: Message = {
        id: (Date.now() + 1).toString(),
        role: 'assistant',
        content: `Это демо-ответ от агента "${agent.name}". В продакшене здесь будет реальный ответ от вашей ИИ-модели на основе обученных данных.`,
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, assistantMessage]);
      setIsLoading(false);
    }, 1500);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
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
      <header className="fixed top-0 left-0 right-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="container mx-auto max-w-7xl px-6 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.AGENT_DASHBOARD)}>
              <Icon name="ArrowLeft" className="h-5 w-5" />
            </Button>
            <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate(ROUTES.HOME)}>
              <div className="w-7 h-7 rounded-lg bg-primary flex items-center justify-center">
                <Icon name="Sparkles" className="text-primary-foreground" size={16} />
              </div>
              <span className="text-lg font-semibold">Agent</span>
            </div>
          </div>
          <div className="flex items-center gap-3">
            <ThemeToggle />
          </div>
        </div>
      </header>

      <main className="pt-14">
        <div className="container mx-auto max-w-7xl px-6 py-8">
          <div className="mb-8 flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-semibold text-foreground">{agent.name}</h1>
              <p className="text-muted-foreground">
                Создан {new Date(agent.createdAt).toLocaleDateString('ru-RU')}
              </p>
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

          <Tabs defaultValue="chat" className="space-y-6">
            <TabsList>
              <TabsTrigger value="chat">
                <Icon name="MessageSquare" className="mr-2 h-4 w-4" />
                Чат
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <Icon name="BarChart3" className="mr-2 h-4 w-4" />
                Аналитика
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

            <TabsContent value="chat" className="space-y-4">
              <Card className="h-[calc(100vh-280px)] flex flex-col">
                <CardHeader className="border-b">
                  <CardTitle>Тестирование агента</CardTitle>
                  <CardDescription>Проверьте работу агента в реальном времени</CardDescription>
                </CardHeader>
                <CardContent className="flex-1 flex flex-col p-0">
                  <div className="flex-1 overflow-y-auto p-6 space-y-4">
                    {messages.length === 0 ? (
                      <div className="flex h-full items-center justify-center">
                        <div className="text-center max-w-md">
                          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                            <Icon name="MessageSquare" className="h-8 w-8 text-primary" />
                          </div>
                          <h3 className="text-lg font-medium mb-2">Начните диалог</h3>
                          <p className="text-muted-foreground">
                            Задайте вопрос агенту, чтобы проверить его работу
                          </p>
                        </div>
                      </div>
                    ) : (
                      <>
                        {messages.map((message) => (
                          <div
                            key={message.id}
                            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
                          >
                            <div
                              className={`max-w-[80%] rounded-lg p-4 ${
                                message.role === 'user'
                                  ? 'bg-primary text-primary-foreground'
                                  : 'bg-muted'
                              }`}
                            >
                              <p className="whitespace-pre-wrap">{message.content}</p>
                              <p className="text-xs opacity-60 mt-2">
                                {message.timestamp.toLocaleTimeString('ru-RU', {
                                  hour: '2-digit',
                                  minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                        ))}
                        {isLoading && (
                          <div className="flex justify-start">
                            <div className="bg-muted rounded-lg p-4">
                              <div className="flex gap-2">
                                <div className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce" />
                                <div
                                  className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"
                                  style={{ animationDelay: '0.1s' }}
                                />
                                <div
                                  className="w-2 h-2 rounded-full bg-foreground/40 animate-bounce"
                                  style={{ animationDelay: '0.2s' }}
                                />
                              </div>
                            </div>
                          </div>
                        )}
                        <div ref={messagesEndRef} />
                      </>
                    )}
                  </div>

                  <div className="border-t p-4">
                    <div className="flex gap-2">
                      <Textarea
                        placeholder="Напишите сообщение..."
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        onKeyPress={handleKeyPress}
                        className="min-h-[60px] resize-none"
                        disabled={isLoading}
                      />
                      <Button
                        size="lg"
                        onClick={handleSendMessage}
                        disabled={!inputMessage.trim() || isLoading}
                      >
                        <Icon name="Send" className="h-5 w-5" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="analytics">
              <div className="mb-6 grid gap-6 md:grid-cols-4">
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
                  <CardTitle>База знаний</CardTitle>
                  <CardDescription>Управление данными для обучения агента</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="rounded-lg border p-4 flex items-start gap-4">
                      <Icon name="FileText" className="h-10 w-10 text-muted-foreground" />
                      <div className="flex-1">
                        <h4 className="font-medium">Текстовые данные</h4>
                        <p className="text-sm text-muted-foreground">
                          Добавьте текстовые документы для обучения агента
                        </p>
                      </div>
                      <Button>
                        <Icon name="Upload" className="mr-2 h-4 w-4" />
                        Загрузить
                      </Button>
                    </div>

                    <div className="rounded-lg border p-4 flex items-start gap-4">
                      <Icon name="Link" className="h-10 w-10 text-muted-foreground" />
                      <div className="flex-1">
                        <h4 className="font-medium">Веб-страницы</h4>
                        <p className="text-sm text-muted-foreground">
                          Укажите URL для импорта содержимого
                        </p>
                      </div>
                      <Button>
                        <Icon name="Plus" className="mr-2 h-4 w-4" />
                        Добавить
                      </Button>
                    </div>

                    <div className="rounded-lg border p-4 flex items-start gap-4">
                      <Icon name="Database" className="h-10 w-10 text-muted-foreground" />
                      <div className="flex-1">
                        <h4 className="font-medium">База данных</h4>
                        <p className="text-sm text-muted-foreground">
                          Подключите базу данных для динамических ответов
                        </p>
                      </div>
                      <Button>
                        <Icon name="Settings" className="mr-2 h-4 w-4" />
                        Настроить
                      </Button>
                    </div>
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
                    <Label htmlFor="name">Название агента</Label>
                    <Input id="name" defaultValue={agent.name} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Описание</Label>
                    <Textarea id="description" defaultValue={agent.description} rows={3} />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Статус публикации</Label>
                      <p className="text-sm text-muted-foreground">
                        {agent.status === 'published'
                          ? 'Агент опубликован и доступен через API'
                          : 'Агент находится в режиме тестирования'}
                      </p>
                    </div>
                    <Switch checked={agent.status === 'published'} onCheckedChange={handleToggleStatus} />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="temperature">Температура (креативность)</Label>
                    <Input id="temperature" type="number" min="0" max="1" step="0.1" defaultValue="0.7" />
                    <p className="text-xs text-muted-foreground">
                      0 = точные ответы, 1 = креативные ответы
                    </p>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="maxTokens">Максимум токенов</Label>
                    <Input id="maxTokens" type="number" defaultValue="500" />
                  </div>

                  <div className="pt-4">
                    <Button>
                      <Icon name="Save" className="mr-2 h-4 w-4" />
                      Сохранить изменения
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="integration">
              <Card>
                <CardHeader>
                  <CardTitle>API интеграция</CardTitle>
                  <CardDescription>Подключите агента к вашему сервису</CardDescription>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label>API Endpoint</Label>
                    <div className="mt-2 flex gap-2">
                      <Input value={`https://api.agent.com/v1/agents/${agent.id}/chat`} readOnly />
                      <Button variant="outline">
                        <Icon name="Copy" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label>API Key</Label>
                    <div className="mt-2 flex gap-2">
                      <Input value="sk_live_xxxxxxxxxxxxxxxxxxxxxxxx" readOnly type="password" />
                      <Button variant="outline">
                        <Icon name="Copy" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg bg-muted p-4">
                    <h4 className="mb-2 font-medium">Пример запроса (cURL)</h4>
                    <pre className="overflow-x-auto text-xs">
{`curl -X POST https://api.agent.com/v1/agents/${agent.id}/chat \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{"message": "Ваш вопрос"}'`}
                    </pre>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
};

export default AgentDetails;
