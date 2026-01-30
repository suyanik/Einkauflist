import { ShoppingCart, BarChart3, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface HeaderProps {
  activeTab: 'list' | 'report';
  onTabChange: (tab: 'list' | 'report') => void;
}

export function Header({ activeTab, onTabChange }: HeaderProps) {
  const today = new Date().toLocaleDateString('tr-TR', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  return (
    <header className="sticky top-0 z-50 w-full bg-white border-b border-slate-200 shadow-sm">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo ve Başlık */}
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-indigo-500 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-200">
              <ShoppingCart className="w-5 h-5 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Alışveriş Listesi</h1>
              <p className="text-xs text-slate-500 hidden sm:block">Şirket İçi Yönetim Sistemi</p>
            </div>
          </div>

          {/* Tarih */}
          <div className="hidden md:flex items-center gap-2 text-sm text-slate-600">
            <Calendar className="w-4 h-4 text-indigo-500" />
            <span className="font-medium">{today}</span>
          </div>

          {/* Sekme Butonları */}
          <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-lg">
            <Button
              variant={activeTab === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('list')}
              className={`gap-2 ${
                activeTab === 'list'
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              <span className="hidden sm:inline">Liste</span>
            </Button>
            <Button
              variant={activeTab === 'report' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => onTabChange('report')}
              className={`gap-2 ${
                activeTab === 'report'
                  ? 'bg-indigo-500 hover:bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-600 hover:text-slate-800 hover:bg-slate-200'
              }`}
            >
              <BarChart3 className="w-4 h-4" />
              <span className="hidden sm:inline">Rapor</span>
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
}
