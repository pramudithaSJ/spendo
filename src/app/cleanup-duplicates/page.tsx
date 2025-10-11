'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ArrowLeft, AlertTriangle, CheckCircle2, Loader2 } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';
import { removeDuplicateCategories } from '@/lib/initializeCategoriesService';
import { categoryService } from '@/lib/categoryService';

export default function CleanupDuplicatesPage() {
  const [loading, setLoading] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [duplicateCount, setDuplicateCount] = useState<number | null>(null);
  const [cleanupComplete, setCleanupComplete] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { user } = useAuth();
  const router = useRouter();

  const analyzeDuplicates = async () => {
    if (!user) return;

    setAnalyzing(true);
    setError(null);

    try {
      const categories = await categoryService.getCategories(user.uid);

      // Group categories by name and type to find duplicates
      const categoryMap = new Map<string, number>();

      categories.forEach(cat => {
        const key = `${cat.name.toLowerCase()}-${cat.type}`;
        categoryMap.set(key, (categoryMap.get(key) || 0) + 1);
      });

      // Count duplicates
      let duplicates = 0;
      for (const [key, count] of categoryMap.entries()) {
        if (count > 1) {
          duplicates += count - 1; // Subtract 1 to keep one copy
        }
      }

      setDuplicateCount(duplicates);
    } catch (err) {
      console.error('Error analyzing duplicates:', err);
      setError('Failed to analyze categories. Please try again.');
    } finally {
      setAnalyzing(false);
    }
  };

  const handleCleanup = async () => {
    if (!user) return;

    const confirmed = window.confirm(
      `This will remove ${duplicateCount} duplicate categories. This action cannot be undone. Continue?`
    );

    if (!confirmed) return;

    setLoading(true);
    setError(null);

    try {
      await removeDuplicateCategories(user.uid);
      setCleanupComplete(true);
      setDuplicateCount(0);
    } catch (err) {
      console.error('Error cleaning up duplicates:', err);
      setError('Failed to clean up duplicates. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pb-20">
      {/* Header */}
      <header className="bg-white border-b border-gray-200">
        <div className="flex items-center justify-between p-4">
          <div className="flex items-center space-x-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="p-2"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <div>
              <h1 className="text-xl font-bold text-gray-900">Cleanup Duplicates</h1>
              <p className="text-sm text-gray-500">Remove duplicate categories</p>
            </div>
          </div>
        </div>
      </header>

      {/* Content */}
      <div className="p-4 space-y-6 max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Category Duplicate Cleanup</CardTitle>
            <CardDescription>
              This tool will help you identify and remove duplicate categories from your account.
              Duplicates are categories with the same name and type.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {error && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertTitle>Error</AlertTitle>
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            {cleanupComplete && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>Success</AlertTitle>
                <AlertDescription>
                  Successfully removed duplicate categories! Your categories are now clean.
                </AlertDescription>
              </Alert>
            )}

            {duplicateCount === null && (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Click the button below to analyze your categories for duplicates.
                </p>
                <Button
                  onClick={analyzeDuplicates}
                  disabled={analyzing}
                  className="bg-black text-white hover:bg-gray-800"
                >
                  {analyzing ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Analyzing...
                    </>
                  ) : (
                    'Analyze Categories'
                  )}
                </Button>
              </div>
            )}

            {duplicateCount !== null && duplicateCount > 0 && !cleanupComplete && (
              <div className="space-y-4">
                <Alert>
                  <AlertTriangle className="h-4 w-4" />
                  <AlertTitle>Duplicates Found</AlertTitle>
                  <AlertDescription>
                    Found <strong>{duplicateCount}</strong> duplicate {duplicateCount === 1 ? 'category' : 'categories'}.
                    The oldest version of each category will be kept.
                  </AlertDescription>
                </Alert>

                <div className="flex gap-2">
                  <Button
                    onClick={handleCleanup}
                    disabled={loading}
                    variant="destructive"
                    className="flex-1"
                  >
                    {loading ? (
                      <>
                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                        Cleaning...
                      </>
                    ) : (
                      'Remove Duplicates'
                    )}
                  </Button>
                  <Button
                    onClick={() => setDuplicateCount(null)}
                    variant="outline"
                    disabled={loading}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            )}

            {duplicateCount === 0 && !cleanupComplete && (
              <Alert>
                <CheckCircle2 className="h-4 w-4 text-green-600" />
                <AlertTitle>No Duplicates Found</AlertTitle>
                <AlertDescription>
                  Your categories are clean! No duplicate categories were found.
                </AlertDescription>
              </Alert>
            )}

            <div className="pt-4 border-t">
              <h3 className="font-medium mb-2">What this tool does:</h3>
              <ul className="text-sm text-muted-foreground space-y-1 list-disc list-inside">
                <li>Identifies categories with identical names and types</li>
                <li>Keeps the oldest version of each category</li>
                <li>Removes all duplicate versions</li>
                <li>Preserves all your transactions (they remain linked to kept categories)</li>
              </ul>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
