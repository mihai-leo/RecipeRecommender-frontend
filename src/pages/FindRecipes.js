import React, { useState, useEffect, useContext } from 'react';
import Select from 'react-select';
import api from '../services/api';
import { AuthContext } from '../services/AuthContext';
import { useNavigate } from 'react-router-dom';

const FindRecipes = () => {
  const [selectedOption, setSelectedOption] = useState(null);
  const [ingredients, setIngredients] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [results, setResults] = useState([]);
  const [favorites, setFavorites] = useState([]);
  const [inputValue, setInputValue] = useState('');
  const [expandedRecipeId, setExpandedRecipeId] = useState(null);
  const [showFavorites, setShowFavorites] = useState(true);

  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();
  const userId = localStorage.getItem('userId');

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const fetchSuggestions = async (input) => {
    try {
      const res = await api.get(`/ingredients/autocomplete?q=${input}`);
      return res.data
        .filter((name) => typeof name === 'string')
        .map((name) => ({ label: name, value: name }));
    } catch {
      return [];
    }
  };

  useEffect(() => {
    if (!inputValue) return setSuggestions([]);
    fetchSuggestions(inputValue).then(setSuggestions);
  }, [inputValue]);

  const handleIngredientSelect = (selected) => {
    if (selected && !ingredients.includes(selected.value)) {
      setIngredients((prev) => [...prev, selected.value]);
      setSelectedOption(null);
    }
  };

  const handleFindByIngredients = async (e) => {
    e.preventDefault();
    if (ingredients.length === 0) {
      alert('Please add at least one ingredient');
      return;
    }
    try {
      const res = await api.post('/home-cook/find-recipes', {
        ingredientNames: ingredients,
      });
      setResults(res.data);
    } catch {
      alert('Error finding recipes');
    }
  };

  const addToFavorites = async (recipeId) => {
    if (!userId) return alert('You must be logged in to add favorites.');
    try {
      await api.post('/home-cook/add-favorite', { userId, recipeId });
      fetchFavorites();
    } catch {
      alert('Error adding to favorites');
    }
  };

  const removeFromFavorites = async (recipeId) => {
    if (!userId) return alert('You must be logged in to remove favorites.');
    try {
      await api.delete('/home-cook/remove-favorite', {
        data: { userId, recipeId },
      });
      fetchFavorites();
    } catch {
      alert('Error removing from favorites');
    }
  };

  const fetchFavorites = async () => {
    if (!userId) return;
    try {
      const res = await api.get(`/home-cook/favorites/${userId}`);
      setFavorites(res.data);
    } catch {
      alert('Error fetching favorites');
    }
  };

  useEffect(() => {
    if (userId) {
      fetchFavorites();
    }
  }, [userId]);

  const toggleIngredients = (id) => {
    setExpandedRecipeId(expandedRecipeId === id ? null : id);
  };

  const renderRecipe = (recipe, isFavoriteList = false) => (
    <li key={recipe.id} style={{ 
      marginBottom: 20, 
      padding: 15, 
      border: '1px solid #ccc', 
      borderRadius: 8, 
      backgroundColor: '#f9f9f9',
      color: '#333'
    }}>
      <h4>{recipe.name}</h4>
      {recipe.imageUrl && (
        <img
          src={recipe.imageUrl}
          alt={recipe.name}
          style={{ width: 200, borderRadius: 8, marginBottom: 10 }}
        />
      )}
      <p style={{ whiteSpace: 'pre-wrap', color: '#555' }}>{recipe.instructions}</p>
      <div style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}>
        <button
          style={{
            backgroundColor: isFavoriteList ? '#d9534f' : '#5cb85c',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
          onClick={() =>
            isFavoriteList ? removeFromFavorites(recipe.id) : addToFavorites(recipe.id)
          }
        >
          {isFavoriteList ? '🗑 Remove Favorite' : '❤️ Add Favorite'}
        </button>
        <button
          onClick={() => toggleIngredients(recipe.id)}
          style={{
            backgroundColor: '#0275d8',
            color: 'white',
            border: 'none',
            padding: '8px 12px',
            borderRadius: 4,
            cursor: 'pointer',
          }}
        >
          {expandedRecipeId === recipe.id ? 'Hide Ingredients' : 'Show Ingredients'}
        </button>
      </div>
      {expandedRecipeId === recipe.id && recipe.ingredients?.length > 0 && (
        <ul style={{ marginTop: 10 }}>
          {recipe.ingredients.map((ing, index) => (
            <li key={index} style={{ color: '#555' }}>
              {ing.name} - {ing.quantity}
            </li>
          ))}
        </ul>
      )}
    </li>
  );

  return (
    <div style={{ maxWidth: 1000, margin: 'auto', padding: 20, backgroundColor: '#ffffff', color: '#000', fontFamily: 'Segoe UI, sans-serif' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h2>🍳 Find Recipes You Can Make</h2>
        <button
          onClick={handleLogout}
          style={{
            padding: '10px 16px',
            backgroundColor: '#d9534f',
            color: 'white',
            border: 'none',
            borderRadius: 5,
            cursor: 'pointer',
          }}
        >
          Log Out
        </button>
      </div>

      <section style={{ backgroundColor: '#f0f0f0', padding: 20, borderRadius: 8, marginBottom: 30 }}>
        <form onSubmit={handleFindByIngredients} style={{ display: 'flex', flexWrap: 'wrap', gap: 10 }}>
          <Select
            value={selectedOption}
            onChange={handleIngredientSelect}
            onInputChange={setInputValue}
            options={suggestions}
            placeholder="Search ingredient..."
            isClearable
            isSearchable
            styles={{
              container: (base) => ({ ...base, flex: 1, minWidth: 250 }),
              control: (base) => ({ ...base, backgroundColor: '#fff', borderColor: '#ccc' }),
              menu: (base) => ({ ...base, backgroundColor: '#fff' }),
              singleValue: (base) => ({ ...base, color: '#333' }),
              input: (base) => ({ ...base, color: '#333' }),
            }}
          />
          <button
            type="submit"
            style={{
              padding: '10px 20px',
              backgroundColor: '#5cb85c',
              color: 'white',
              border: 'none',
              borderRadius: 5,
              cursor: 'pointer',
              fontWeight: 'bold'
            }}
          >
            🔍 Find Recipes
          </button>
        </form>

        {ingredients.length > 0 && (
          <div style={{ marginTop: 20 }}>
            <h4>Your Ingredients:</h4>
            <ul style={{ display: 'flex', gap: 10, flexWrap: 'wrap', listStyle: 'none', padding: 0 }}>
              {ingredients.map((ing, idx) => (
                <li key={idx} style={{
                  backgroundColor: '#ddd',
                  color: '#333',
                  padding: '6px 12px',
                  borderRadius: 20,
                  fontSize: 14
                }}>{ing}</li>
              ))}
            </ul>
          </div>
        )}
      </section>

      <section style={{ marginBottom: 40 }}>
        <h3>Recommended Recipes</h3>
        {results.length === 0 ? (
          <p style={{ color: '#888' }}>No recipes found. Try adding more ingredients above.</p>
        ) : (
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>{results.map((r) => renderRecipe(r))}</ul>
        )}
      </section>

      <section>
        <div
          onClick={() => setShowFavorites(!showFavorites)}
          style={{
            cursor: 'pointer',
            backgroundColor: '#e6e6e6',
            padding: 15,
            borderRadius: 6,
            marginBottom: 10,
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <h3 style={{ margin: 0 }}>My Favorite Recipes</h3>
          <span style={{ fontSize: 20 }}>{showFavorites ? '▾' : '▸'}</span>
        </div>
        {showFavorites && (
          <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
            {favorites.length === 0 ? (
              <p style={{ color: '#666' }}>You haven't added any favorites yet.</p>
            ) : (
              favorites.map((fav) => renderRecipe(fav, true))
            )}
          </ul>
        )}
      </section>
    </div>
  );
};

export default FindRecipes;
