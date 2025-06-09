import React, { useState } from 'react';
import Select from 'react-select';
import api from '../services/api';

const AddRecipe = () => {
  const [name, setName] = useState('');
  const [instructions, setInstructions] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [ingredients, setIngredients] = useState([{ name: '', quantity: '' }]);
  const [suggestionsList, setSuggestionsList] = useState([[]]); // suggestions per ingredient input

  // Fetch ingredient suggestions from API
  const fetchSuggestions = async (inputValue) => {
    if (!inputValue || inputValue.trim() === '') return [];
    try {
      const res = await api.get(`/ingredients/autocomplete?q=${inputValue}`);
      return res.data
        .filter((name) => typeof name === 'string')
        .map((name) => ({ label: name, value: name }));
    } catch (err) {
      console.error('Error fetching suggestions:', err);
      return [];
    }
  };

  // Called on input change - must be synchronous and return the input string immediately
  const handleInputChange = (index, inputValue) => {
    if (!inputValue || inputValue.trim() === '') {
      const newSuggestions = [...suggestionsList];
      newSuggestions[index] = [];
      setSuggestionsList(newSuggestions);
      return inputValue;
    }

    // Fetch suggestions asynchronously, but don't await here
    fetchSuggestions(inputValue).then((options) => {
      const newSuggestions = [...suggestionsList];
      newSuggestions[index] = options;
      setSuggestionsList(newSuggestions);
    });

    return inputValue;
  };

  // Handle selection change for ingredient name
  const handleIngredientNameChange = (index, selectedOption) => {
    const updated = [...ingredients];
    updated[index].name = selectedOption ? selectedOption.value : '';
    setIngredients(updated);
  };

  // Handle quantity change for ingredient
  const handleIngredientQuantityChange = (index, value) => {
    const updated = [...ingredients];
    updated[index].quantity = value;
    setIngredients(updated);
  };

  // Add new empty ingredient field
  const addIngredientField = () => {
    setIngredients([...ingredients, { name: '', quantity: '' }]);
    setSuggestionsList([...suggestionsList, []]);
  };

  // Submit form handler
  const handleSubmit = async (e) => {
    e.preventDefault();
    const creatorId = localStorage.getItem('userId');
    console.log('Sending recipe:', {
      creatorId,
      name,
      instructions,
      imageUrl,
      ingredients,
    });

    try {
      await api.post('/creator/add-recipe', {
        creatorId: Number(creatorId),
        name,
        instructions,
        imageUrl,
        ingredients,
      });
      alert('Recipe added successfully!');
      setName('');
      setInstructions('');
      setImageUrl('');
      setIngredients([{ name: '', quantity: '' }]);
      setSuggestionsList([[]]);
    } catch (err) {
      console.error('Error:', err.response?.data || err.message);
      alert(
        'Error adding recipe: ' +
          (err.response?.data || 'Unknown error') +
          err.message
      );
    }
  };

  return (
    <div>
      <h2>Add Recipe</h2>
      <form onSubmit={handleSubmit}>
        <input
          value={name}
          placeholder="Recipe Name"
          onChange={(e) => setName(e.target.value)}
        />
        <br />
        <textarea
          value={instructions}
          placeholder="Instructions"
          onChange={(e) => setInstructions(e.target.value)}
        />
        <br />
        <input
          value={imageUrl}
          placeholder="Image URL (optional)"
          onChange={(e) => setImageUrl(e.target.value)}
        />
        <br />

        <h4>Ingredients:</h4>
        {ingredients.map((ing, idx) => (
          <div key={idx} style={{ marginBottom: '10px' }}>
            <div style={{ width: '300px', display: 'inline-block', marginRight: '10px' }}>
              <Select
                value={ing.name ? { label: ing.name, value: ing.name } : null}
                onChange={(selected) => handleIngredientNameChange(idx, selected)}
                onInputChange={(inputValue) => handleInputChange(idx, inputValue)}
                options={suggestionsList[idx] || []}
                placeholder="Ingredient Name"
                isClearable
                isSearchable
                filterOption={null} // disable internal filtering, as options are already filtered
              />
            </div>
            <input
              style={{ width: '120px' }}
              placeholder="Quantity"
              value={ing.quantity}
              onChange={(e) => handleIngredientQuantityChange(idx, e.target.value)}
            />
          </div>
        ))}

        <button type="button" onClick={addIngredientField}>
          + Add Ingredient
        </button>
        <br />
        <br />
        <button type="submit">Submit Recipe</button>
      </form>
    </div>
  );
};

export default AddRecipe;
