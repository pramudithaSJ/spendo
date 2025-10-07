'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useLanguage } from '@/contexts/LanguageContext';
import { 
  Banknote, 
  Laptop, 
  TrendingUp, 
  Gift, 
  Plus, 
  Utensils, 
  Car, 
  ShoppingBag, 
  Film, 
  Receipt, 
  Heart, 
  BookOpen, 
  Home, 
  Plane, 
  Minus,
  DollarSign,
  CreditCard
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Category } from '@/lib/types';

const iconMap = {
  Banknote, Laptop, TrendingUp, Gift, Plus, Utensils, Car, ShoppingBag, 
  Film, Receipt, Heart, BookOpen, Home, Plane, Minus, DollarSign, CreditCard
};

const availableIcons = Object.keys(iconMap) as (keyof typeof iconMap)[];

interface CategoryFormProps {
  category?: Category;
  defaultType?: 'income' | 'expense';
  onSubmit: (data: { name: string; type: 'income' | 'expense'; icon: string }) => void;
  onCancel: () => void;
  loading?: boolean;
}

export default function CategoryForm({ category, defaultType, onSubmit, onCancel, loading }: CategoryFormProps) {
  const [name, setName] = useState(category?.name || '');
  const [type, setType] = useState<'income' | 'expense'>(category?.type || defaultType || 'expense');
  const [selectedIcon, setSelectedIcon] = useState(category?.icon || 'Plus');
  const { t } = useLanguage();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onSubmit({
        name: name.trim(),
        type,
        icon: selectedIcon,
      });
    }
  };

  return (
    <Card className="w-full max-w-md mx-auto">
      <CardHeader>
        <CardTitle>
          {category ? t.categories.editCategory : t.categories.addCategory}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="name">{t.forms.categoryName}</Label>
            <Input
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder={t.forms.categoryNamePlaceholder}
              required
            />
          </div>

          <div className="space-y-3">
            <Label>{t.forms.type}</Label>
            <div className="flex gap-2">
              <Button
                type="button"
                variant={type === 'income' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setType('income')}
              >
                {t.dashboard.income}
              </Button>
              <Button
                type="button"
                variant={type === 'expense' ? 'default' : 'outline'}
                className="flex-1"
                onClick={() => setType('expense')}
              >
                {t.dashboard.expenses}
              </Button>
            </div>
          </div>

          <div className="space-y-3">
            <Label>{t.forms.icon}</Label>
            <div className="grid grid-cols-6 gap-2">
              {availableIcons.map((iconName) => {
                const IconComponent = iconMap[iconName];
                return (
                  <Button
                    key={iconName}
                    type="button"
                    variant="outline"
                    size="sm"
                    className={cn(
                      'h-10 w-10 p-0',
                      selectedIcon === iconName && 'bg-primary text-primary-foreground'
                    )}
                    onClick={() => setSelectedIcon(iconName)}
                  >
                    <IconComponent className="h-4 w-4" />
                  </Button>
                );
              })}
            </div>
          </div>

          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={onCancel}
              disabled={loading}
            >
              {t.common.cancel}
            </Button>
            <Button
              type="submit"
              className="flex-1"
              disabled={loading || !name.trim()}
            >
              {loading ? t.forms.saving : t.common.save}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}