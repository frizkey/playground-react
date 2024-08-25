import React, { useState, useEffect } from 'react';

const useTodos = () => {
  const [todos, setTodos] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    const storedTodos = localStorage.getItem('todos');
    if (storedTodos) {
      try {
        setTodos(JSON.parse(storedTodos));
      } catch (err) {
        setError('Failed to load todos from storage');
      }
    }
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem('todos', JSON.stringify(todos));
    } catch (err) {
      setError('Failed to save todos to storage');
    }
  }, [todos]);

  const addTodo = (text) => {
    if (text.trim() === '') {
      setError('Todo cannot be empty');
      return;
    }
    if (text.length > 100) {
      setError('Todo is too long (max 100 characters)');
      return;
    }
    if (/[<>]/.test(text)) {
      setError('Todo cannot contain < or > characters');
      return;
    }
    try {
      setTodos([...todos, { id: Date.now(), text }]);
      setError(null);
    } catch (err) {
      setError('Failed to add todo');
    }
  };

  const removeTodo = (id) => {
    try {
      const newTodos = todos.filter(todo => todo.id !== id);
      setTodos(newTodos);
      setError(null);
    } catch (err) {
      setError('Failed to remove todo');
    }
  };

  return { todos, addTodo, removeTodo, error };
};

function App() {
  const [input, setInput] = useState('');
  const { todos, addTodo, removeTodo, error } = useTodos();

  const handleAddTodo = () => {
    addTodo(input);
    setInput('');
  };

  return (
    <div className="App">
      <h1>Todo List</h1>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <input
        type="text"
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter a new todo"
      />
      <button onClick={handleAddTodo}>Add Todo</button>
      <ul>
        {todos.map((todo) => (
          <li key={todo.id}>
            {todo.text}
            <button onClick={() => removeTodo(todo.id)}>Remove</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
