import React, { useState, useEffect } from 'react';
import Select from 'react-select';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const RecipeCreatorDashboard = () => {
  const creatorId = localStorage.getItem('userId');
  const [activeTab, setActiveTab] = useState('add'); // 'add' or 'my-recipes'
  const [form, setForm] = useState({ name: '', instructions: '', imageUrl: '' });
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [suggestionsList, setSuggestionsList] = useState([[]]);
  const [myRecipes, setMyRecipes] = useState([]);
  const [editing, setEditing] = useState(null);

  const navigate = useNavigate();

  // Redirect to login if no userId found (not logged in)
  useEffect(() => {
    if (!creatorId) {
      navigate('/login');
    }
  }, [creatorId, navigate]);

  const fetchSuggestions = async (input) => {
    try {
      const res = await api.get(`/ingredients/autocomplete?q=${input}`);
      return res.data.map((name) => ({ label: name, value: name }));
    } catch {
      return [];
    }
  };

  const handleIngredientChange = (index, field, value) => {
    const updated = [...ingredients];
    updated[index][field] = value;
    setIngredients(updated);
  };

  const addIngredientField = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
    setSuggestionsList([...suggestionsList, []]);
  };

  const handleSelectInputChange = (idx, inputValue) => {
    fetchSuggestions(inputValue).then((options) => {
      const updated = [...suggestionsList];
      updated[idx] = options;
      setSuggestionsList(updated);
    });
    return inputValue;
  };

  const resetForm = () => {
    setForm({ name: '', instructions: '', imageUrl: '' });
    setIngredients([{ name: '', quantity: '' }]);
    setSuggestionsList([[]]);
    setEditing(null);
  };

  const handleRecipeSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      creatorId: Number(creatorId),
      name: form.name,
      instructions: form.instructions,
      imageUrl: form.imageUrl,
      ingredients,
    };

    try {
      if (editing) {
        await api.put(`/creator/update-recipe/${editing.id}`, payload);
        alert('Recipe updated!');
      } else {
        await api.post('/creator/add-recipe', payload);
        alert('Recipe added!');
      }
      resetForm();
      fetchMyRecipes();
    } catch (err) {
      console.error(err);
      alert('Error submitting recipe');
    }
  };

  const fetchMyRecipes = async () => {
    try {
      const res = await api.get(`/creator/my-recipes/${creatorId}`);
      setMyRecipes(res.data);
    } catch {
      alert('Error fetching your recipes');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Delete this recipe?')) return;
    try {
      await api.delete(`/creator/delete-recipe/${id}`);
      fetchMyRecipes();
    } catch {
      alert('Error deleting recipe');
    }
  };

  const startEdit = (recipe) => {
    setForm({ name: recipe.name, instructions: recipe.instructions, imageUrl: recipe.imageUrl });
    setIngredients(recipe.ingredients.length > 0 ? recipe.ingredients : [{ name: '', quantity: '' }]);
    setEditing(recipe);
    setActiveTab('add');
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate('/login');
  };

  useEffect(() => {
    fetchMyRecipes();
  }, []);

  return (
    <div style={{ display: 'flex', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif", minHeight: '100vh' }}>
      {/* Sidebar */}
      <div
        style={{
          width: '220px',
          padding: '20px',
          borderRight: '1px solid #ccc',
          backgroundColor: '#f8f9fa',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          gap: '15px',
        }}
      >
        <h3 style={{ marginBottom: '30px' }}>Recipe Creator</h3>
        <button
          onClick={() => setActiveTab('add')}
          style={{
            padding: '10px 15px',
            width: '100%',
            backgroundColor: activeTab === 'add' ? '#007bff' : '#e2e6ea',
            color: activeTab === 'add' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          Add Recipe
        </button>
        <button
          onClick={() => setActiveTab('my-recipes')}
          style={{
            padding: '10px 15px',
            width: '100%',
            backgroundColor: activeTab === 'my-recipes' ? '#007bff' : '#e2e6ea',
            color: activeTab === 'my-recipes' ? 'white' : 'black',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'left',
          }}
        >
          My Recipes
        </button>
        <button
          onClick={handleLogout}
          style={{
            marginTop: 'auto',
            padding: '10px 15px',
            width: '100%',
            backgroundColor: '#dc3545',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            textAlign: 'center',
          }}
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div style={{ flex: 1, padding: '20px' }}>
        {activeTab === 'add' && (
          <>
            <h2 style={{ marginBottom: '20px' }}>{editing ? 'Edit Recipe' : 'Add Recipe'}</h2>
            <form onSubmit={handleRecipeSubmit} style={{ maxWidth: '600px' }}>
              <input
                placeholder="Recipe Name"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '15px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                }}
                required
              />
              <textarea
                placeholder="Instructions"
                value={form.instructions}
                onChange={(e) => setForm({ ...form, instructions: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  height: '120px',
                  marginBottom: '15px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                  resize: 'vertical',
                }}
                required
              />
              <input
                placeholder="Image URL"
                value={form.imageUrl}
                onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                style={{
                  width: '100%',
                  padding: '10px',
                  marginBottom: '20px',
                  borderRadius: '4px',
                  border: '1px solid #ccc',
                  fontSize: '16px',
                }}
              />
              <h4>Ingredients</h4>
              {ingredients.map((ing, idx) => (
                <div key={idx} style={{ marginBottom: '12px', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div style={{ width: '300px' }}>
                    <Select
                      value={ing.name ? { label: ing.name, value: ing.name } : null}
                      onChange={(option) => handleIngredientChange(idx, 'name', option?.value || '')}
                      onInputChange={(val) => handleSelectInputChange(idx, val)}
                      options={suggestionsList[idx]}
                      isClearable
                      placeholder="Ingredient"
                      filterOption={null}
                    />
                  </div>
                  <input
                    placeholder="Quantity"
                    value={ing.quantity}
                    onChange={(e) => handleIngredientChange(idx, 'quantity', e.target.value)}
                    style={{
                      width: '120px',
                      padding: '8px',
                      fontSize: '14px',
                      borderRadius: '4px',
                      border: '1px solid #ccc',
                    }}
                    required={!!ing.name}
                  />
                </div>
              ))}
              <button
                type="button"
                onClick={addIngredientField}
                style={{
                  padding: '8px 15px',
                  backgroundColor: '#28a745',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  marginBottom: '20px',
                }}
              >
                + Add Ingredient
              </button>
              <br />
              <button
                type="submit"
                style={{
                  padding: '12px 25px',
                  backgroundColor: '#007bff',
                  color: 'white',
                  border: 'none',
                  borderRadius: '4px',
                  cursor: 'pointer',
                  fontSize: '16px',
                }}
              >
                {editing ? 'Update Recipe' : 'Submit Recipe'}
              </button>
              {editing && (
                <button
                  type="button"
                  onClick={resetForm}
                  style={{
                    marginLeft: '15px',
                    padding: '12px 25px',
                    backgroundColor: '#6c757d',
                    color: 'white',
                    border: 'none',
                    borderRadius: '4px',
                    cursor: 'pointer',
                    fontSize: '16px',
                  }}
                >
                  Cancel
                </button>
              )}
            </form>
          </>
        )}

        {activeTab === 'my-recipes' && (
          <>
            <h2 style={{ marginBottom: '20px' }}>My Recipes</h2>
            {myRecipes.length === 0 && <p>You haven't added any recipes yet.</p>}
            {myRecipes.map((r) => (
              <div
                key={r.id}
                style={{
                  borderBottom: '1px solid #ddd',
                  paddingBottom: '15px',
                  marginBottom: '15px',
                }}
              >
                <strong style={{ fontSize: '18px' }}>{r.name}</strong>
                <p style={{ margin: '8px 0' }}>{r.instructions}</p>
                {r.imageUrl && (
                  <img
                    src={r.imageUrl}
                    alt={r.name}
                    width="200"
                    style={{ borderRadius: '6px', marginBottom: '10px' }}
                  />
                )}
                <div>
                  <button
                    onClick={() => startEdit(r)}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#007bff',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                      marginRight: '10px',
                    }}
                  >
                    Edit
                  </button>
                  <button
                    onClick={() => handleDelete(r.id)}
                    style={{
                      padding: '8px 15px',
                      backgroundColor: '#dc3545',
                      color: 'white',
                      border: 'none',
                      borderRadius: '4px',
                      cursor: 'pointer',
                    }}
                  >
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  );
};

export default RecipeCreatorDashboard;
