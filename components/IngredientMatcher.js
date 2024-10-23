'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';

export default function IngredientMatcher() {
  const [input, setInput] = useState('');
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    
    try {
      const response = await fetch('/api/match', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ ingredient: input }),
      });
      
      const data = await response.json();
      setResult(data);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto p-4 space-y-4">
      <Card>
        <CardHeader>
          <CardTitle>Ingredient Matcher</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="ingredient" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
                Enter ingredient (e.g., "3 lb of chicken diced")
              </label>
              <Input
                id="ingredient"
                type="text"
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="4 lb of chicken diced"
              />
            </div>
            
            <Button type="submit" disabled={loading}>
              {loading ? 'Finding Match...' : 'Find Match'}
            </Button>
          </form>

          {result && (
            <div className="mt-6 space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Parsed Ingredient</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">Quantity:</div>
                    <div>{result.quantity}</div>
                    <div className="font-medium">Unit:</div>
                    <div>{result.unit}</div>
                    <div className="font-medium">Ingredient:</div>
                    <div>{result.ingredient}</div>
                    <div className="font-medium">Notes:</div>
                    <div>{result.notes || 'None'}</div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Best Match in Database</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="font-medium">ID:</div>
                    <div>{result.match.id}</div>
                    <div className="font-medium">Name:</div>
                    <div>{result.match.name}</div>
                  </div>
                </CardContent>
              </Card>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}