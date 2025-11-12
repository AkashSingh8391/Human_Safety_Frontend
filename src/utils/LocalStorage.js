// Utility for localStorage operations

export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (err) {
    console.error("Error setting localStorage item", err);
  }
};

export const getItem = (key) => {
  try {
    const value = localStorage.getItem(key);
    return value ? JSON.parse(value) : null;
  } catch (err) {
    console.error("Error getting localStorage item", err);
    return null;
  }
};

export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (err) {
    console.error("Error removing localStorage item", err);
  }
};

export const clearStorage = () => {
  try {
    localStorage.clear();
  } catch (err) {
    console.error("Error clearing localStorage", err);
  }
};
