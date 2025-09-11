'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  Settings, 
  LogOut, 
  ChevronRight, 
  Tag, 
  BarChart3,
  Shield,
  HelpCircle,
  Mail
} from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

export default function ProfilePage() {
  const [loading, setLoading] = useState(false);
  const { user, logout } = useAuth();
  const router = useRouter();

  const handleLogout = async () => {
    setLoading(true);
    try {
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Error logging out:', error);
    } finally {
      setLoading(false);
    }
  };

  const menuItems = [
    {
      icon: Tag,
      label: 'Manage Categories',
      description: 'Add, edit, or delete expense categories',
      href: '/categories',
      color: 'text-blue-600 bg-blue-50'
    },
    {
      icon: BarChart3,
      label: 'Reports & Analytics',
      description: 'View spending patterns and insights',
      href: '/reports',
      color: 'text-green-600 bg-green-50'
    },
    {
      icon: Settings,
      label: 'App Settings',
      description: 'Preferences and configuration',
      href: '/settings',
      color: 'text-gray-600 bg-gray-50'
    },
    {
      icon: Shield,
      label: 'Privacy & Security',
      description: 'Account security settings',
      href: '/privacy',
      color: 'text-purple-600 bg-purple-50'
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      description: 'Get help and contact support',
      href: '/help',
      color: 'text-orange-600 bg-orange-50'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="px-4 py-6">
          <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
          <p className="text-sm text-gray-500 mt-1">Manage your account and preferences</p>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6">
        {/* User Info Card */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-6">
            <div className="flex items-center space-x-4">
              <div className="w-16 h-16 bg-black rounded-full flex items-center justify-center">
                <User className="h-8 w-8 text-white" />
              </div>
              <div className="flex-1">
                <h2 className="text-lg font-semibold text-gray-900">
                  {user?.displayName || 'User'}
                </h2>
                <div className="flex items-center space-x-1 text-sm text-gray-500 mt-1">
                  <Mail className="h-4 w-4" />
                  <span>{user?.email}</span>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Member since {user?.metadata?.creationTime ? 
                    new Date(user.metadata.creationTime).toLocaleDateString() : 
                    'Recently'
                  }
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Quick Stats */}
        <Card className="bg-white border-gray-200">
          <CardHeader>
            <CardTitle className="text-base font-semibold">Quick Overview</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">Transactions</div>
              </div>
              <div className="text-center p-3 bg-gray-50 rounded-lg">
                <div className="text-lg font-bold text-gray-900">0</div>
                <div className="text-xs text-gray-500">Categories</div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Menu Items */}
        <div className="space-y-3">
          {menuItems.map((item, index) => (
            <Link key={index} href={item.href}>
              <Card className="bg-white border-gray-200 hover:bg-gray-50 transition-colors cursor-pointer">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-4">
                    <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${item.color}`}>
                      <item.icon className="h-5 w-5" />
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-gray-900">{item.label}</h3>
                      <p className="text-sm text-gray-500">{item.description}</p>
                    </div>
                    <ChevronRight className="h-5 w-5 text-gray-400" />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Logout Section */}
        <Card className="bg-white border-gray-200">
          <CardContent className="p-4">
            <Button
              onClick={handleLogout}
              disabled={loading}
              variant="outline"
              className="w-full flex items-center justify-center space-x-2 text-red-600 border-red-200 hover:bg-red-50"
            >
              <LogOut className="h-4 w-4" />
              <span>{loading ? 'Signing out...' : 'Sign Out'}</span>
            </Button>
          </CardContent>
        </Card>

        {/* App Info */}
        <div className="text-center py-4">
          <p className="text-xs text-gray-400">Spendo v1.0.0</p>
          <p className="text-xs text-gray-400 mt-1">
            Built with ❤️ for better expense tracking
          </p>
        </div>
      </div>

      <BottomNavigation />
    </div>
  );
}