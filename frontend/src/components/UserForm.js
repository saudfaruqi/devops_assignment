import React, { useState, useEffect } from 'react';
import { AlertCircle, User, Mail, Calendar, MapPin, Users } from 'lucide-react';

const UserForm = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    age: '',
    gender: '',
    address: ''
  });
  const [errors, setErrors] = useState({});
  const [editMode, setEditMode] = useState(null);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');

  const validateForm = () => {
    const newErrors = {};
    if (!formData.fullName || formData.fullName.length < 3) {
      newErrors.fullName = 'Name must be at least 3 characters long';
    }
    if (!formData.email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email address';
    }
    if (!formData.age || parseInt(formData.age) < 18) {
      newErrors.age = 'Age must be 18 or older';
    }
    if (!formData.gender) {
      newErrors.gender = 'Please select a gender';
    }
    if (!formData.address || formData.address.length < 10) {
      newErrors.address = 'Address must be at least 10 characters long';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      const response = await fetch('http://localhost:3001/api/users', {
        method: editMode ? 'PUT' : 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editMode ? { ...formData, id: editMode } : formData),
      });

      if (response.ok) {
        const result = await response.json();
        if (editMode) {
          setUsers(users.map(user => user.id === editMode ? result : user));
          setEditMode(null);
        } else {
          setUsers([...users, result]);
        }
        setFormData({ fullName: '', email: '', age: '', gender: '', address: '' });
        showToastMessage(editMode ? 'User updated successfully!' : 'User added successfully!');
      }
    } catch (error) {
      showToastMessage('Error saving user data');
    }
  };

  const handleDelete = async (id) => {
    try {
      const response = await fetch(`http://localhost:3001/api/users/${id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setUsers(users.filter(user => user.id !== id));
        showToastMessage('User deleted successfully!');
      }
    } catch (error) {
      showToastMessage('Error deleting user');
    }
  };

  const handleEdit = (user) => {
    setFormData(user);
    setEditMode(user.id);
  };

  const showToastMessage = (message) => {
    setToastMessage(message);
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users');
        if (response.ok) {
          const data = await response.json();
          setUsers(data);
        }
      } catch (error) {
        console.error('Error fetching users:', error);
      }
    };
    fetchUsers();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-50 py-12">
      <div className="container mx-auto px-4">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-12">
          User Management System
        </h1>
        
        <form onSubmit={handleSubmit} className="max-w-lg mx-auto bg-white p-8 rounded-2xl shadow-xl mb-12">
          <h2 className="text-2xl font-bold mb-8 text-gray-800 flex items-center">
            <Users className="w-6 h-6 mr-2 text-blue-500" />
            {editMode ? 'Edit User' : 'Add New User'}
          </h2>
          
          <div className="space-y-6">
            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Full Name</label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter full name"
                />
              </div>
              {errors.fullName && <p className="text-red-500 text-xs mt-1">{errors.fullName}</p>}
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter email address"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Age</label>
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="number"
                  value={formData.age}
                  onChange={(e) => setFormData({...formData, age: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Enter age"
                />
              </div>
              {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Gender</label>
              <select
                value={formData.gender}
                onChange={(e) => setFormData({...formData, gender: e.target.value})}
                className="w-full pl-3 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all appearance-none bg-white"
              >
                <option value="">Select Gender</option>
                <option value="Male">Male</option>
                <option value="Female">Female</option>
                <option value="Other">Other</option>
              </select>
              {errors.gender && <p className="text-red-500 text-xs mt-1">{errors.gender}</p>}
            </div>

            <div className="relative">
              <label className="block text-gray-700 text-sm font-semibold mb-2">Address</label>
              <div className="relative">
                <MapPin className="absolute left-3 top-3 w-5 h-5 text-gray-400" />
                <textarea
                  value={formData.address}
                  onChange={(e) => setFormData({...formData, address: e.target.value})}
                  className="w-full pl-10 pr-3 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  rows="3"
                  placeholder="Enter address"
                />
              </div>
              {errors.address && <p className="text-red-500 text-xs mt-1">{errors.address}</p>}
            </div>
          </div>

          <button
            type="submit"
            className="w-full mt-8 bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-3 px-4 rounded-lg hover:from-blue-600 hover:to-indigo-700 transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 font-semibold"
          >
            {editMode ? 'Update User' : 'Add User'}
          </button>
        </form>

        <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {users.map(user => (
            <div key={user.id} className="bg-white p-6 rounded-xl shadow-lg hover:shadow-xl transition-shadow">
              <div className="border-b pb-4 mb-4">
                <h3 className="text-lg font-bold text-gray-800">ID: {user.id}</h3>
              </div>
              <div className="space-y-3">
                <p className="flex items-center text-gray-600">
                  <User className="w-4 h-4 mr-2 text-blue-500" />
                  <strong className="mr-2">Name:</strong> {user.fullName}
                </p>
                <p className="flex items-center text-gray-600">
                  <Mail className="w-4 h-4 mr-2 text-blue-500" />
                  <strong className="mr-2">Email:</strong> {user.email}
                </p>
                <p className="flex items-center text-gray-600">
                  <Calendar className="w-4 h-4 mr-2 text-blue-500" />
                  <strong className="mr-2">Age:</strong> {user.age}
                </p>
                <p className="flex items-center text-gray-600">
                  <Users className="w-4 h-4 mr-2 text-blue-500" />
                  <strong className="mr-2">Gender:</strong> {user.gender}
                </p>
                <p className="flex items-center text-gray-600">
                  <MapPin className="w-4 h-4 mr-2 text-blue-500" />
                  <strong className="mr-2">Address:</strong> {user.address}
                </p>
              </div>
              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => handleEdit(user)}
                  className="flex-1 bg-yellow-500 text-white py-2 px-4 rounded-lg hover:bg-yellow-600 transition-colors font-semibold"
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDelete(user.id)}
                  className="flex-1 bg-red-500 text-white py-2 px-4 rounded-lg hover:bg-red-600 transition-colors font-semibold"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showToast && (
          <div className="fixed bottom-4 right-4 bg-gray-800 text-white px-6 py-3 rounded-lg flex items-center shadow-lg animate-fade-in">
            <AlertCircle className="w-5 h-5 mr-2" />
            {toastMessage}
          </div>
        )}
      </div>
    </div>
  );
};

export default UserForm;