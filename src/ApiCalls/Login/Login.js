export const loginUser = async (username, pass) => {
  const response = await fetch('http://localhost:5000/users'); 
  const data = await response.json();
  
  const userData = data.find((u) => u.username === username && u.password === pass);
  
  if (userData) {
    const { password, ...user } = userData;
    return { success: true, user };
  } else {
    return { success: false, message: "Invalid credentials" };
  }
};
