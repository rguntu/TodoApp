import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, Button, FlatList } from 'react-native';
import axios from 'axios';

const HomeScreen = () => {
  const [task, setTask] = useState('');
  const [tasks, setTasks] = useState([]);
const [savedTasks, setSavedTasks] = useState([]);

  useEffect(() => {
    // Fetch tasks from the API on component mount
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/tasks');
      setTasks(response.data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
}
  };

  const addTask = async () => {
    try {
      await axios.post('http://localhost:3000/tasks', { text: task });
      fetchTasks(); // Refresh the task list after adding a new task
      setTask('');
    } catch (error) {
      console.error('Error adding task:', error);
    }
  };

  const removeTask = async (taskId) => {
    try {
      console.log("removing...",taskId)
      console.log("removing url: ",`http://localhost:3000/tasks/${taskId}`)
      await axios.delete(`http://localhost:3000/tasks/${taskId}`);
      fetchTasks(); // Refresh the task list after removing a task
    } catch (error) {
      console.error('Error removing task:', error);
    }
  };

  const saveForLater = async (taskId) => {
    try {
      const response = await axios.get(`http://localhost:3000/tasks/${taskId}`);
      const taskToSave = response.data;
      await axios.post('http://localhost:3000/saved-tasks', taskToSave);
      await removeTask(taskId); // Remove the task from the main list when saved
      fetchTasks(); // Refresh the main task list
      fetchSavedTasks(); // Refresh the saved tasks list
    } catch (error) {
      console.error('Error saving task for later:', error);
    }
  };

  const fetchSavedTasks = async () => {
    try {
      const response = await axios.get('http://localhost:3000/saved-tasks');
      setSavedTasks(response.data);
    } catch (error) {
      console.error('Error fetching saved tasks:', error);
    }
  };

  useEffect(() => {
    // Fetch saved tasks from the API on component mount
    fetchSavedTasks();
  }, []);

  return (
    <View>
      <Text style={{ fontSize: 24, fontWeight: 'bold', marginBottom: 20 }}>Todo App</Text>
      <TextInput
        placeholder="Enter task"
        value={task}
        onChangeText={(text) => setTask(text)}
        style={{ borderWidth: 1, padding: 10, marginBottom: 10 }}
      />
      <Button title="Add Task" onPress={addTask} />
      <FlatList
        data={tasks}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={<Text>No Items Found</Text>}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <Text>{item.text}</Text>
            <View style={{ flexDirection: 'row' }}>
              <Button title="Save for Later" onPress={() => saveForLater(item._id)} />
              <Button title="Remove" onPress={() => removeTask(item._id)} />
            </View>
          </View>
        )}
      />
      <Text style={{ fontSize: 20, fontWeight: 'bold', marginTop: 20 }}>Saved for Later</Text>
      <FlatList
        data={savedTasks}
        keyExtractor={(item) => item._id.toString()}
        ListEmptyComponent={<Text>No Items Found</Text>}
        renderItem={({ item }) => (
          <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 10 }}>
            <Text>{item.text}</Text>
            <Button title="Remove" onPress={() => setSavedTasks(savedTasks.filter((task) => task._id !== item._id))} />
          </View>
        )}
      />
    </View>
  );
};

export default HomeScreen;
