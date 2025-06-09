import React, { useEffect, useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { AuthContext } from '../services/AuthContext';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const [editingUser, setEditingUser] = useState(null);
  const [editingRecipe, setEditingRecipe] = useState(null);
  const [editingIngredient, setEditingIngredient] = useState(null);

  // New state to track collapsible sections
  const [usersOpen, setUsersOpen] = useState(false);
  const [recipesOpen, setRecipesOpen] = useState(false);
  const [ingredientsOpen, setIngredientsOpen] = useState(false);

  const navigate = useNavigate();
  const { logout } = useContext(AuthContext);

  const fetchAll = async () => {
    try {
      const [usersRes, recipesRes, ingredientsRes] = await Promise.all([
        api.get('/admin/users'),
        api.get('/admin/recipes'),
        api.get('/admin/ingredients'),
      ]);
      setUsers(usersRes.data);
      setRecipes(recipesRes.data);
      setIngredients(ingredientsRes.data);
    } catch (err) {
      alert('Failed to fetch admin data');
    }
  };

  useEffect(() => {
    fetchAll();
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const inputStyle = {
    padding: '6px 10px',
    marginRight: 10,
    borderRadius: 4,
    border: '1px solid #ccc',
    width: '200px',
    fontSize: '14px',
  };

  const buttonStyle = {
    padding: '6px 12px',
    marginRight: 8,
    borderRadius: 4,
    border: 'none',
    cursor: 'pointer',
  };

  const sectionStyle = {
    marginBottom: 40,
    padding: 20,
    border: '1px solid #ddd',
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
  };

  const cardStyle = {
    marginBottom: 15,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 6,
    boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
  };

  // Helper for section header style with clickable cursor
  const sectionHeaderStyle = {
    cursor: 'pointer',
    userSelect: 'none',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  };

  // Arrow icon for toggle
  const Arrow = ({ open }) => (
    <span style={{ fontSize: 18, marginLeft: 10 }}>{open ? '▼' : '▶'}</span>
  );

  return (
    <div style={{ maxWidth: 1000, margin: '20px auto', fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif" }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 30 }}>
        <h2>Admin Dashboard</h2>
        <button
          onClick={handleLogout}
          style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white', padding: '8px 16px' }}
        >
          Logout
        </button>
      </div>

      {/* Users Section */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle} onClick={() => setUsersOpen(!usersOpen)}>
          <h3 style={{ margin: 0 }}>Users</h3>
          <Arrow open={usersOpen} />
        </div>
        {usersOpen && (
          <>
            {users.length === 0 && <p>No users found.</p>}
            {users.map((u) => (
              <div key={u.id} style={cardStyle}>
                {editingUser?.id === u.id ? (
                  <>
                    <input
                      name="name"
                      value={editingUser.name}
                      onChange={(e) => setEditingUser({ ...editingUser, [e.target.name]: e.target.value })}
                      style={inputStyle}
                      placeholder="Name"
                    />
                    <input
                      name="email"
                      value={editingUser.email}
                      onChange={(e) => setEditingUser({ ...editingUser, [e.target.name]: e.target.value })}
                      style={inputStyle}
                      placeholder="Email"
                    />
                    <select
                      name="role"
                      value={editingUser.role}
                      onChange={(e) => setEditingUser({ ...editingUser, [e.target.name]: e.target.value })}
                      style={{ ...inputStyle, width: '150px' }}
                    >
                      <option value="ADMIN">ADMIN</option>
                      <option value="RECIPE_CREATOR">RECIPE_CREATOR</option>
                      <option value="HOME_COOK">HOME_COOK</option>
                    </select>
                    <div>
                      <button
                        onClick={async () => {
                          try {
                            await api.put(`/admin/users/${editingUser.id}`, editingUser);
                            setEditingUser(null);
                            fetchAll();
                          } catch {
                            alert('Failed to update user');
                          }
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#4caf50', color: 'white' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingUser(null)}
                        style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>{u.name}</strong> ({u.email}) — <em>{u.role}</em>
                    </div>
                    <div>
                      <button
                        onClick={() => setEditingUser(u)}
                        style={{ ...buttonStyle, backgroundColor: '#2196f3', color: 'white' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Are you sure you want to delete this user?')) return;
                          try {
                            await api.delete(`/admin/users/${u.id}`);
                            fetchAll();
                          } catch {
                            alert('Failed to delete user');
                          }
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white' }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </section>

      {/* Recipes Section */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle} onClick={() => setRecipesOpen(!recipesOpen)}>
          <h3 style={{ margin: 0 }}>Recipes</h3>
          <Arrow open={recipesOpen} />
        </div>
        {recipesOpen && (
          <>
            {recipes.length === 0 && <p>No recipes found.</p>}
            {recipes.map((r) => (
              <div key={r.id} style={cardStyle}>
                {editingRecipe?.id === r.id ? (
                  <>
                    <input
                      name="name"
                      value={editingRecipe.name}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, [e.target.name]: e.target.value })}
                      style={inputStyle}
                      placeholder="Name"
                    />
                    <input
                      name="instructions"
                      value={editingRecipe.instructions}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, [e.target.name]: e.target.value })}
                      style={{ ...inputStyle, width: '300px' }}
                      placeholder="Instructions"
                    />
                    <input
                      name="imageUrl"
                      value={editingRecipe.imageUrl}
                      onChange={(e) => setEditingRecipe({ ...editingRecipe, [e.target.name]: e.target.value })}
                      style={inputStyle}
                      placeholder="Image URL"
                    />
                    <div>
                      <button
                        onClick={async () => {
                          try {
                            await api.put(`/admin/recipes/${editingRecipe.id}`, editingRecipe);
                            setEditingRecipe(null);
                            fetchAll();
                          } catch {
                            alert('Failed to update recipe');
                          }
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#4caf50', color: 'white' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingRecipe(null)}
                        style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>
                      <strong>{r.name}</strong>
                    </div>
                    <div>
                      <button
                        onClick={() => setEditingRecipe(r)}
                        style={{ ...buttonStyle, backgroundColor: '#2196f3', color: 'white' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Are you sure you want to delete this recipe?')) return;
                          try {
                            await api.delete(`/admin/recipes/${r.id}`);
                            fetchAll();
                          } catch {
                            alert('Failed to delete recipe');
                          }
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white' }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </section>

      {/* Ingredients Section */}
      <section style={sectionStyle}>
        <div style={sectionHeaderStyle} onClick={() => setIngredientsOpen(!ingredientsOpen)}>
          <h3 style={{ margin: 0 }}>Ingredients</h3>
          <Arrow open={ingredientsOpen} />
        </div>
        {ingredientsOpen && (
          <>
            {ingredients.length === 0 && <p>No ingredients found.</p>}
            {ingredients.map((i) => (
              <div key={i.id} style={cardStyle}>
                {editingIngredient?.id === i.id ? (
                  <>
                    <input
                      name="name"
                      value={editingIngredient.name}
                      onChange={(e) => setEditingIngredient({ ...editingIngredient, [e.target.name]: e.target.value })}
                      style={inputStyle}
                      placeholder="Name"
                    />
                    <div>
                      <button
                        onClick={async () => {
                          try {
                            await api.put(`/admin/ingredients/${editingIngredient.id}`, editingIngredient);
                            setEditingIngredient(null);
                            fetchAll();
                          } catch {
                            alert('Failed to update ingredient');
                          }
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#4caf50', color: 'white' }}
                      >
                        Save
                      </button>
                      <button
                        onClick={() => setEditingIngredient(null)}
                        style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white' }}
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                ) : (
                  <>
                    <div>{i.name}</div>
                    <div>
                      <button
                        onClick={() => setEditingIngredient(i)}
                        style={{ ...buttonStyle, backgroundColor: '#2196f3', color: 'white' }}
                      >
                        Edit
                      </button>
                      <button
                        onClick={async () => {
                          if (!window.confirm('Are you sure you want to delete this ingredient?')) return;
                          try {
                            await api.delete(`/admin/ingredients/${i.id}`);
                            fetchAll();
                          } catch {
                            alert('Failed to delete ingredient');
                          }
                        }}
                        style={{ ...buttonStyle, backgroundColor: '#f44336', color: 'white' }}
                      >
                        Delete
                      </button>
                    </div>
                  </>
                )}
              </div>
            ))}
          </>
        )}
      </section>
    </div>
  );
};

export default AdminDashboard;
