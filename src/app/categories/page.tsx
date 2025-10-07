'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Edit, Trash2, ArrowLeft } from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import CategoryForm from '@/components/forms/CategoryForm';
import { useAuth } from '@/contexts/AuthContext';
import { useLanguage } from '@/contexts/LanguageContext';
import { categoryService, defaultCategories } from '@/lib/categoryService';
import { Category } from '@/lib/types';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import * as LucideIcons from 'lucide-react';

export default function CategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const [activeTab, setActiveTab] = useState<'income' | 'expense'>('expense');
  const [formLoading, setFormLoading] = useState(false);

  const { user } = useAuth();
  const { t } = useLanguage();

  useEffect(() => {
    loadCategories();
  }, [user]);

  const loadCategories = async () => {
    if (!user) return;
    
    try {
      const userCategories = await categoryService.getCategories(user.uid);
      
      // If user has no categories, create default ones
      if (userCategories.length === 0) {
        await createDefaultCategories();
        const newCategories = await categoryService.getCategories(user.uid);
        setCategories(newCategories);
      } else {
        setCategories(userCategories);
      }
    } catch (error) {
      console.error('Error loading categories:', error);
    } finally {
      setLoading(false);
    }
  };

  const createDefaultCategories = async () => {
    if (!user) return;
    
    const promises = defaultCategories.map(cat => 
      categoryService.addCategory({
        ...cat,
        userId: user.uid,
      })
    );
    
    await Promise.all(promises);
  };

  const handleAddCategory = async (data: { name: string; type: 'income' | 'expense'; icon: string }) => {
    if (!user) return;
    
    setFormLoading(true);
    try {
      await categoryService.addCategory({
        ...data,
        userId: user.uid,
      });
      await loadCategories();
      setActiveTab(data.type); // Switch to the tab of the created category
      setShowForm(false);
    } catch (error) {
      console.error('Error adding category:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleEditCategory = async (data: { name: string; type: 'income' | 'expense'; icon: string }) => {
    if (!editingCategory) return;
    
    setFormLoading(true);
    try {
      await categoryService.updateCategory(editingCategory.id, data);
      await loadCategories();
      setActiveTab(data.type); // Switch to the tab of the edited category
      setEditingCategory(null);
      setShowForm(false);
    } catch (error) {
      console.error('Error updating category:', error);
    } finally {
      setFormLoading(false);
    }
  };

  const handleDeleteCategory = async (id: string) => {
    if (!confirm(t.categories.deleteConfirm)) return;

    try {
      await categoryService.deleteCategory(id);
      await loadCategories();
    } catch (error) {
      console.error('Error deleting category:', error);
    }
  };

  const filteredCategories = categories.filter(cat => cat.type === activeTab);

  const getIconComponent = (iconName: string) => {
    const IconComponent = (LucideIcons as any)[iconName];
    return IconComponent || LucideIcons.Circle;
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p>{t.categories.loadingCategories}</p>
      </div>
    );
  }

  if (showForm) {
    return (
      <div className="min-h-screen bg-background p-4 pb-20">
        <div className="flex items-center mb-6">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setShowForm(false);
              setEditingCategory(null);
            }}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            {t.common.back}
          </Button>
        </div>
        
        <CategoryForm
          category={editingCategory || undefined}
          defaultType={activeTab}
          onSubmit={editingCategory ? handleEditCategory : handleAddCategory}
          onCancel={() => {
            setShowForm(false);
            setEditingCategory(null);
          }}
          loading={formLoading}
        />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => window.history.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">{t.categories.categories}</h1>
              <p className="text-sm text-gray-500">{t.categories.manageCategories}</p>
            </div>
          </div>
          <Button
            size="sm"
            onClick={() => setShowForm(true)}
            className="bg-black text-white hover:bg-gray-800"
          >
            <Plus className="h-4 w-4 mr-2" />
            {t.common.add}
          </Button>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* Tabs */}
        <div className="flex gap-2">
          <Button
            variant={activeTab === 'expense' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setActiveTab('expense')}
          >
            {t.categories.expenses} ({categories.filter(c => c.type === 'expense').length})
          </Button>
          <Button
            variant={activeTab === 'income' ? 'default' : 'outline'}
            className="flex-1"
            onClick={() => setActiveTab('income')}
          >
            {t.categories.income} ({categories.filter(c => c.type === 'income').length})
          </Button>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 gap-4">
          {filteredCategories.map((category) => {
            const IconComponent = getIconComponent(category.icon);
            return (
              <Card key={category.id} className="relative">
                <CardHeader className="pb-2">
                  <div className="flex items-center justify-between">
                    <div className="w-8 h-8 bg-secondary rounded-full flex items-center justify-center">
                      <IconComponent className="h-4 w-4" />
                    </div>
                    <div className="flex gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0"
                        onClick={() => {
                          setEditingCategory(category);
                          setShowForm(true);
                        }}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-6 w-6 p-0 text-destructive hover:text-destructive"
                        onClick={() => handleDeleteCategory(category.id)}
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <p className="text-sm font-medium truncate">{category.name}</p>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredCategories.length === 0 && (
          <div className="text-center py-8">
            <p className="text-muted-foreground">
              {activeTab === 'expense' ? t.categories.noExpenseCategories : t.categories.noIncomeCategories}
            </p>
            <Button
              variant="outline"
              className="mt-4"
              onClick={() => setShowForm(true)}
            >
              <Plus className="h-4 w-4 mr-2" />
              {t.categories.addFirstCategory}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}