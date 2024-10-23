'use client';
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { Checkbox } from './ui/checkbox';

export default function IngredientMatcher() {
  const [input, setInput] = useState('');
  const [parsedIngredients, setParsedIngredients] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedIngredient, setSelectedIngredient] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [error, setError] = useState(null);
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    const ingredients = input.split('\n').filter(line => line.trim());
    
    try {
      const results = await Promise.all(
        ingredients.map(async (ing) => {
          const response = await fetch('/api/match', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({ ingredient: ing.trim() }),
          });
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
          }
          
          return response.json();
        })
      );
      
      setParsedIngredients(results);
    } catch (error) {
      console.error('Error:', error);
      setError('Failed to process ingredients');
    } finally {
      setLoading(false);
    }
  };

  const handleIngredientClick = (ingredient) => {
    setSelectedIngredient(ingredient);
    setDialogOpen(true);
  };
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-3xl mx-auto px-4">
        <Card className="shadow-lg border-0">
          <CardHeader className="text-center border-b bg-white rounded-t-lg">
            <CardTitle className="text-2xl font-bold text-gray-800">
              Ingredient Matcher
            </CardTitle>
            <p className="text-gray-600 mt-2">
              Enter multiple ingredients (one per line)
            </p>
          </CardHeader>
          <CardContent className="p-6">
            {error && (
              <div className="mb-4 p-4 bg-red-50 text-red-600 rounded-md">
                {error}
              </div>
            )}
            
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Textarea
                  id="ingredients"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  placeholder="Example:
3 lb of chicken diced
2 cups of flour sifted
1 tbsp of salt"
                  className="min-h-[150px] text-base p-4 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={loading}
                className="w-full py-6 text-lg bg-blue-600 hover:bg-blue-700 transition-colors"
              >
                {loading ? (
                  <span className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Processing...
                  </span>
                ) : 'Parse Ingredients'}
              </Button>
            </form>
            {parsedIngredients.length > 0 && (
              <div className="mt-8 space-y-4">
                <h3 className="text-lg font-semibold text-gray-700 mb-4">
                  Parsed Ingredients ({parsedIngredients.length})
                </h3>
                <div className="space-y-3">
                  {parsedIngredients.map((item, index) => (
                    <div
                      key={index}
                      onClick={() => handleIngredientClick(item)}
                      className={`flex items-start p-4 bg-white rounded-lg border 
                        ${item.isValidIngredient ? 'border-green-100' : 'border-red-100'}
                        hover:border-blue-500 hover:shadow-md transition-all cursor-pointer`}
                    >
                      <div className="h-16 w-16 flex-shrink-0 rounded-md overflow-hidden bg-gray-100">
                        {item?.match?.image ? (
                          <img
                            src={item.match.image}
                            alt={item.ingredient}
                            className="h-full w-full object-cover"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/64';
                            }}
                          />
                        ) : (
                          <div className="h-full w-full flex items-center justify-center bg-gray-200">
                            <span className="text-gray-400 text-xs">No image</span>
                          </div>
                        )}
                      </div>
                      <div className="ml-4 flex-1">
                        <div className="flex items-baseline">
                          <span className="font-bold text-gray-900">
                            {item.quantity} {item.unit}
                          </span>
                          <span className="ml-2 text-gray-800">
                            {item.ingredient}
                          </span>
                        </div>
                        {item.notes && (
                          <div className="text-sm text-gray-500 mt-1">
                            {item.notes}
                          </div>
                        )}
                        <div className="text-sm mt-1">
                          {item.isValidIngredient ? (
                            <span className="text-green-600">✓ Valid Ingredient</span>
                          ) : (
                            <span className="text-red-600">✗ Not an Ingredient</span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </CardContent>
        </Card>
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-gray-900">
                Ingredient Details
              </DialogTitle>
            </DialogHeader>
            {selectedIngredient && (
              <div className="mt-4 space-y-6">
                <div className="grid grid-cols-2 gap-y-4 text-sm">
                  <div className="font-medium text-gray-600">Matched Name:</div>
                  <div className="text-gray-900">{selectedIngredient?.match?.name || 'No match found'}</div>
                  
                  <div className="font-medium text-gray-600">Ingredient ID:</div>
                  <div className="text-gray-900">{selectedIngredient?.match?.id || 'N/A'}</div>
                  
                  <div className="font-medium text-gray-600">Input Name:</div>
                  <div className="text-gray-900">{selectedIngredient?.ingredient || 'N/A'}</div>
                  
                  <div className="font-medium text-gray-600">Estimated Weight:</div>
                  <div className="text-gray-900">
                    {selectedIngredient.isValidIngredient ? 
                      `${selectedIngredient.estimatedGrams} grams` : 
                      '0 grams (Not an ingredient)'}
                  </div>
                  
                  <div className="font-medium text-gray-600">Valid Ingredient:</div>
                  <div className={`text-${selectedIngredient.isValidIngredient ? 'green' : 'red'}-600 font-medium`}>
                    {selectedIngredient.isValidIngredient ? 'Yes' : 'No'}
                  </div>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}