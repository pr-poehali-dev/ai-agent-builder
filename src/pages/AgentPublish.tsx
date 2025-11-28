import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { setAgent } from '@/store/agentSlice';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Icon from '@/components/ui/icon';
import CreationLayout from '@/components/CreationLayout';

const AgentPublish = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { currentScenario, dataSources, agent } = useAppSelector((state) => state.agent);
  const [agentName, setAgentName] = useState('');
  const [isPublishing, setIsPublishing] = useState(false);
  const [isPublished, setIsPublished] = useState(false);

  const handlePublish = () => {
    if (!agentName.trim()) return;

    setIsPublishing(true);

    setTimeout(() => {
      const newAgent = {
        id: crypto.randomUUID(),
        name: agentName,
        scenario: currentScenario?.id || '',
        status: 'published' as const,
        apiKey: `sk_${crypto.randomUUID().replace(/-/g, '')}`,
        createdAt: new Date().toISOString(),
        dataSources,
      };

      dispatch(setAgent(newAgent));
      setIsPublishing(false);
      setIsPublished(true);
    }, 2000);
  };

  const embedCode = `<script src="https://cdn.aiagent.platform/widget.js"></script>
<div id="ai-agent-widget" data-agent-id="${agent?.id || 'YOUR_AGENT_ID'}"></div>`;

  const telegramCode = `https://t.me/YourAgentBot?start=${agent?.id || 'YOUR_AGENT_ID'}`;

  return (
    <CreationLayout
      step={4}
      title="Публикация агента"
      description="Финальная настройка и развертывание"
      onBack={() => navigate(ROUTES.DATA_VALIDATION)}
    >
      <div className="max-w-5xl space-y-6">
        {!isPublished ? (
          <>
            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Настройки агента</CardTitle>
                <CardDescription>Дайте имя вашему агенту</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="agent-name">Название агента</Label>
                    <Input
                      id="agent-name"
                      placeholder="Например: Агент поддержки клиентов"
                      value={agentName}
                      onChange={(e) => setAgentName(e.target.value)}
                      className="mt-2"
                    />
                  </div>

                  <div className="rounded-lg bg-primary/5 p-4 border border-primary/20">
                    <div className="mb-2 flex items-center gap-2">
                      <Icon name="Info" className="h-4 w-4 text-primary" />
                      <p className="font-medium">Сводка</p>
                    </div>
                    <div className="space-y-1 text-sm text-muted-foreground">
                      <p>Сценарий: {currentScenario?.title}</p>
                      <p>Источников данных: {dataSources.length}</p>
                      <p>Модель: GPT-4 (RAG)</p>
                    </div>
                  </div>
                </div>
              </CardContent>
          </Card>

          <div className="flex justify-end">
            <Button
              size="lg"
              onClick={handlePublish}
              disabled={!agentName.trim() || isPublishing}
              className="gap-2"
            >
              {isPublishing ? (
                <>
                  <Icon name="Loader2" className="h-5 w-5 animate-spin" />
                  Публикация...
                </>
              ) : (
                <>
                  <Icon name="Rocket" className="h-5 w-5" />
                  Опубликовать агента
                </>
              )}
            </Button>
          </div>
        </>
        ) : (
          <>
            <Card className="mb-8 border-2 border-primary">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                    <Icon name="CheckCircle" className="h-6 w-6 text-primary" />
                  </div>
                  <div>
                    <CardTitle>Агент успешно опубликован!</CardTitle>
                    <CardDescription>Ваш агент готов к использованию</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label>API ключ</Label>
                    <div className="mt-2 flex gap-2">
                      <Input value={agent?.apiKey} readOnly className="font-mono text-sm" />
                      <Button variant="outline" size="icon">
                        <Icon name="Copy" className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div className="rounded-lg bg-amber-50 p-4">
                    <div className="flex gap-3">
                      <Icon name="AlertTriangle" className="h-5 w-5 text-amber-600" />
                      <div className="text-sm">
                        <p className="font-medium text-amber-900">Сохраните API ключ</p>
                        <p className="text-amber-700">
                          Он больше не будет показан. Используйте его для интеграции.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card className="mb-8">
              <CardHeader>
                <CardTitle>Интеграция</CardTitle>
                <CardDescription>Выберите способ подключения агента</CardDescription>
              </CardHeader>
              <CardContent>
                <Tabs defaultValue="website">
                  <TabsList className="grid w-full grid-cols-3">
                    <TabsTrigger value="website">
                      <Icon name="Globe" className="mr-2 h-4 w-4" />
                      Сайт
                    </TabsTrigger>
                    <TabsTrigger value="telegram">
                      <Icon name="MessageCircle" className="mr-2 h-4 w-4" />
                      Telegram
                    </TabsTrigger>
                    <TabsTrigger value="api">
                      <Icon name="Code" className="mr-2 h-4 w-4" />
                      API
                    </TabsTrigger>
                  </TabsList>

                  <TabsContent value="website" className="mt-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Вставьте этот код на ваш сайт перед закрывающим тегом &lt;/body&gt;
                      </p>
                      <div className="relative">
                        <pre className="rounded-lg bg-muted p-4 text-xs overflow-x-auto">
                          <code>{embedCode}</code>
                        </pre>
                        <Button
                          size="sm"
                          variant="outline"
                          className="absolute right-2 top-2"
                        >
                          <Icon name="Copy" className="mr-2 h-3 w-3" />
                          Копировать
                        </Button>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="telegram" className="mt-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Используйте эту ссылку для подключения агента к Telegram боту
                      </p>
                      <div className="flex gap-2">
                        <Input value={telegramCode} readOnly className="font-mono text-sm" />
                        <Button variant="outline" size="icon">
                          <Icon name="Copy" className="h-4 w-4" />
                        </Button>
                      </div>
                      <Badge variant="secondary">
                        <Icon name="Wrench" className="mr-1 h-3 w-3" />
                        Требуется настройка бота
                      </Badge>
                    </div>
                  </TabsContent>

                  <TabsContent value="api" className="mt-4">
                    <div className="space-y-3">
                      <p className="text-sm text-muted-foreground">
                        Используйте REST API для программной интеграции
                      </p>
                      <div className="rounded-lg bg-muted p-4">
                        <p className="mb-2 text-xs font-medium text-muted-foreground">
                          POST https://api.aiagent.platform/v1/chat
                        </p>
                        <pre className="text-xs overflow-x-auto">
{`{
  "message": "Ваш вопрос",
  "agent_id": "${agent?.id}",
  "api_key": "${agent?.apiKey}"
}`}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>
                </Tabs>
              </CardContent>
            </Card>

          <div className="flex justify-center">
            <Button size="lg" onClick={() => navigate(ROUTES.AGENT_DASHBOARD)} className="gap-2">
              Открыть панель агента
              <Icon name="ArrowRight" className="h-4 w-4" />
            </Button>
          </div>
        </>
        )}
      </div>
    </CreationLayout>
  );
};

export default AgentPublish;