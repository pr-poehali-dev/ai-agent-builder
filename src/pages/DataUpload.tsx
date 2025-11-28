import { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import Icon from '@/components/ui/icon';
import { ROUTES } from '@/config/routes';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { addDataSource, removeDataSource, DataSource } from '@/store/agentSlice';

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
    navigate(ROUTES.VALIDATION);
  };

  const formatFileSize = (bytes: number = 0) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i];
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-white to-gray-50">
      <div className="container mx-auto px-4 py-12">
        <div className="max-w-4xl mx-auto">
          <div className="mb-8 animate-fade-in">
            <Button 
              variant="ghost" 
              onClick={() => navigate(ROUTES.SCENARIO_SELECTION)}
              className="mb-4"
            >
              <Icon name="ArrowLeft" size={16} className="mr-2" />
              Назад
            </Button>
            
            <div className="flex items-center gap-3 mb-4">
              <Badge variant="outline" className="text-sm">
                Шаг 2 из 4
              </Badge>
              <Progress value={50} className="flex-1 max-w-xs" />
            </div>

            <h1 className="text-4xl font-bold text-gray-900 mb-3">
              Загрузите данные для обучения
            </h1>
            <p className="text-lg text-gray-600">
              Сценарий: <span className="font-medium">{scenario || 'Не выбран'}</span>
            </p>
          </div>

          <div className="space-y-6">
            <Card className="p-8 border-2 border-dashed border-gray-300 hover:border-primary/50 transition-colors">
              <label htmlFor="file-upload" className="cursor-pointer block">
                <div className="text-center space-y-4">
                  <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center mx-auto">
                    <Icon name="Upload" className="text-primary" size={32} />
                  </div>
                  
                  <div>
                    <p className="text-lg font-medium mb-1">
                      Перетащите файлы или нажмите для выбора
                    </p>
                    <p className="text-sm text-gray-500">
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
                      className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                      <div className="flex items-center gap-3 flex-1">
                        <div className="w-10 h-10 bg-white rounded-lg flex items-center justify-center shadow-sm">
                          <Icon name="FileText" className="text-primary" size={20} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium truncate">{source.name}</p>
                          <p className="text-sm text-gray-500">
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

            <Card className="p-6 bg-blue-50/50 border-blue-100">
              <div className="flex gap-4">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Icon name="Lightbulb" className="text-blue-600" size={20} />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Рекомендации по загрузке данных</h4>
                  <ul className="text-sm text-gray-600 space-y-1">
                    <li>• Используйте структурированные документы с четкими разделами</li>
                    <li>• Включайте FAQ, инструкции и типовые сценарии</li>
                    <li>• Избегайте дублирования информации в разных файлах</li>
                  </ul>
                </div>
              </div>
            </Card>
          </div>

          <div className="flex justify-between mt-8">
            <Button 
              variant="outline"
              onClick={() => navigate(ROUTES.SCENARIO_SELECTION)}
            >
              <Icon name="ArrowLeft" className="mr-2" size={16} />
              Назад
            </Button>
            <Button 
              size="lg"
              disabled={dataSources.length === 0 || uploading}
              onClick={handleContinue}
            >
              Перейти к валидации
              <Icon name="ArrowRight" className="ml-2" size={20} />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
