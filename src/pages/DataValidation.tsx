import { useNavigate } from 'react-router-dom';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { updateValidationIssue } from '@/store/agentSlice';
import { ROUTES } from '@/constants/routes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';

const DataValidation = () => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { validationIssues, dataSources } = useAppSelector((state) => state.agent);

  const handleResolveIssue = (id: string) => {
    dispatch(updateValidationIssue({ id, status: 'resolved' }));
  };

  const handleApproveIssue = (id: string) => {
    dispatch(updateValidationIssue({ id, status: 'approved' }));
  };

  const pendingIssuesCount = validationIssues.filter((i) => i.status === 'pending').length;
  const resolvedCount = validationIssues.filter((i) => i.status === 'resolved').length;
  const approvedCount = validationIssues.filter((i) => i.status === 'approved').length;

  const getIssueIcon = (type: string) => {
    switch (type) {
      case 'contradiction':
        return 'AlertTriangle';
      case 'duplicate':
        return 'Copy';
      case 'ambiguity':
        return 'HelpCircle';
      default:
        return 'AlertCircle';
    }
  };

  const getIssueLabel = (type: string) => {
    switch (type) {
      case 'contradiction':
        return 'Противоречие';
      case 'duplicate':
        return 'Дубликат';
      case 'ambiguity':
        return 'Неоднозначность';
      default:
        return type;
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'high':
        return 'destructive';
      case 'medium':
        return 'default';
      case 'low':
        return 'secondary';
      default:
        return 'default';
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container max-w-5xl py-12">
        <div className="mb-8">
          <div className="mb-6 flex items-center gap-3">
            <Button variant="ghost" size="icon" onClick={() => navigate(ROUTES.DATA_UPLOAD)}>
              <Icon name="ArrowLeft" className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-3xl font-semibold text-foreground">Валидация данных</h1>
              <p className="text-muted-foreground">
                Проанализировано источников: {dataSources.length}
              </p>
            </div>
          </div>

          <Progress value={66} className="h-2" />
          <div className="mt-2 flex justify-between text-sm text-muted-foreground">
            <span>Шаг 2 из 3</span>
            <span>Проверка данных</span>
          </div>
        </div>

        <div className="mb-8 grid gap-4 md:grid-cols-3">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Требует внимания</p>
                  <p className="text-3xl font-semibold">{pendingIssuesCount}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-destructive/10">
                  <Icon name="AlertCircle" className="h-6 w-6 text-destructive" />
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-muted-foreground">Исправлено</p>
                  <p className="text-3xl font-semibold">{resolvedCount}</p>
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
                  <p className="text-sm text-muted-foreground">Подтверждено</p>
                  <p className="text-3xl font-semibold">{approvedCount}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
                  <Icon name="ThumbsUp" className="h-6 w-6 text-primary" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-8">
          <CardHeader>
            <CardTitle>Обнаруженные проблемы</CardTitle>
            <CardDescription>
              Просмотрите и исправьте противоречия, дубликаты и неоднозначности в данных
            </CardDescription>
          </CardHeader>
          <CardContent>
            {validationIssues.length === 0 ? (
              <div className="py-12 text-center text-muted-foreground">
                <Icon name="CheckCircle" className="mx-auto mb-4 h-12 w-12 text-green-600" />
                <p className="text-lg font-medium">Отлично!</p>
                <p>Проблем не обнаружено. Данные готовы к обучению агента.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {validationIssues.map((issue) => (
                  <div
                    key={issue.id}
                    className={`rounded-lg border p-4 ${
                      issue.status === 'resolved' || issue.status === 'approved'
                        ? 'bg-muted/50 opacity-60'
                        : ''
                    }`}
                  >
                    <div className="mb-3 flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        <Icon
                          name={getIssueIcon(issue.type)}
                          className="mt-1 h-5 w-5 text-destructive"
                        />
                        <div>
                          <div className="mb-2 flex items-center gap-2">
                            <Badge variant={getSeverityColor(issue.severity)}>
                              {getIssueLabel(issue.type)}
                            </Badge>
                            <span className="text-sm text-muted-foreground">
                              Важность: {issue.severity === 'high' ? 'Высокая' : issue.severity === 'medium' ? 'Средняя' : 'Низкая'}
                            </span>
                          </div>
                          <p className="mb-2 text-sm">{issue.description}</p>
                          <p className="text-xs text-muted-foreground">
                            Источники: {issue.sources.join(', ')}
                          </p>
                        </div>
                      </div>
                    </div>

                    {issue.status === 'pending' && (
                      <div className="flex gap-2">
                        <Button size="sm" onClick={() => handleResolveIssue(issue.id)}>
                          <Icon name="Check" className="mr-2 h-4 w-4" />
                          Исправить
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleApproveIssue(issue.id)}
                        >
                          <Icon name="ThumbsUp" className="mr-2 h-4 w-4" />
                          Подтвердить корректность
                        </Button>
                      </div>
                    )}

                    {issue.status === 'resolved' && (
                      <Badge variant="outline" className="bg-green-50 text-green-700">
                        <Icon name="CheckCircle" className="mr-1 h-3 w-3" />
                        Исправлено
                      </Badge>
                    )}

                    {issue.status === 'approved' && (
                      <Badge variant="outline" className="bg-primary/10">
                        <Icon name="ThumbsUp" className="mr-1 h-3 w-3" />
                        Подтверждено
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        <div className="flex justify-between">
          <Button variant="outline" onClick={() => navigate(ROUTES.DATA_UPLOAD)}>
            <Icon name="ArrowLeft" className="mr-2 h-4 w-4" />
            Назад
          </Button>
          <Button onClick={() => navigate(ROUTES.AGENT_PUBLISH)} disabled={pendingIssuesCount > 0}>
            Продолжить
            <Icon name="ArrowRight" className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DataValidation;
