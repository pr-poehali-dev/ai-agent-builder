import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/constants/routes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addDataSource, removeDataSource, DataSource } from '@/store/agentSlice';
import CreationLayout from '@/components/CreationLayout';

export default function DataUpload() {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const dataSources = useAppSelector((state) => state.agent.dataSources);
  const scenario = useAppSelector((state) => state.agent.scenario);
  const [uploading, setUploading] = useState(false);

  const handleFileUpload = useCallback((event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files) return;

    setUploading(true);
    
    Array.from(files).forEach((file) => {
      const fileType = file.name.split('.').pop()?.toLowerCase();
      const dataSource: DataSource = {
        id: Math.random().toString(36).substr(2, 9),
        name: file.name,
        type: (fileType === 'pdf' || fileType === 'docx' || fileType === 'txt') ? fileType : 'pdf',
        size: file.size,
        status: 'uploaded',
      };
      
      setTimeout(() => {
        dispatch(addDataSource(dataSource));
      }, 500);
    });

    setTimeout(() => setUploading(false), 1000);
  }, [dispatch]);

  const handleRemove = (id: string) => {
    dispatch(removeDataSource(id));
  };

  const handleContinue = () => {
    navigate(ROUTES.DATA_VALIDATION);
  };

  const formatFileSize = (bytes: number = 0) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <CreationLayout
      step={2}
      title="Загрузите данные для обучения"
      description={`Сценарий: ${scenario || 'Не выбран'}`}
      onBack={() => navigate(ROUTES.SCENARIO_SELECT)}
    >
      <div className="space-y-6 max-w-4xl">
        <Card className="p-8 border-2 border-dashed hover:border-primary/50 transition-colors">
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon name="Upload" className="text-primary" size={32} />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium mb-1">
                      Перетащите файлы или нажмите для выбора
                    </p>
                    <p className="text-sm text-muted-foreground">
                      Поддерживаются PDF, DOCX, TXT до 10 МБ
                    </p>
                  </div>

                  <input
                    id="file-upload"
                    type="file"
                    multiple
                    accept=".pdf,.docx,.txt"
                    className="hidden"
                    onChange={handleFileUpload}
                  />
                </div>
              </label>
        </Card>

        {dataSources.length > 0 && (
              <Card className="p-6">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Icon name="FileText" size={20} className="mr-2" />
                  Загруженные файлы ({dataSources.length})
                </h3>
                
                <div className="space-y-3">
                  {dataSources.map((source) => (
                    <div
                      key={source.id}
                      className="flex items-center justify-between p-4 bg-accent/50 rounded-lg hover:bg-accent transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-background rounded-lg flex items-center justify-center shadow-sm">
                          <Icon name="FileText" className="text-primary" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{source.name}</p>
                          <p className="text-sm text-muted-foreground">
                            {formatFileSize(source.size)} • {source.type.toUpperCase()}
                          </p>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <Badge 
                          variant="outline"
                          className="bg-green-50 text-green-700 border-green-200"
                        >
                          <Icon name="CheckCircle" size={14} className="mr-1" />
                          Загружено
                        </Badge>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemove(source.id)}
                        >
                          <Icon name="Trash2" size={16} />
                        </Button>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
        )}

        <Card className="p-6 bg-primary/5 border-primary/20">
          <div className="flex gap-4">
            <div className="w-10 h-10 bg-primary/20 rounded-lg flex items-center justify-center flex-shrink-0">
              <Icon name="Lightbulb" className="text-primary" size={20} />
            </div>
            <div>
              <h4 className="font-medium mb-2">Рекомендации по загрузке данных</h4>
              <ul className="text-sm text-muted-foreground space-y-1">
                <li>• Используйте структурированные документы с четкими разделами</li>
                <li>• Включайте FAQ, инструкции и типовые сценарии</li>
                <li>• Избегайте дублирования информации в разных файлах</li>
              </ul>
            </div>
          </div>
        </Card>

        <div className="flex justify-end mt-8">
          <Button 
            size="lg"
            disabled={dataSources.length === 0 || uploading}
            onClick={handleContinue}
            className="gap-2"
          >
            Перейти к валидации
            <Icon name="ArrowRight" size={20} />
          </Button>
        </div>
      </div>
    </CreationLayout>
  );
}