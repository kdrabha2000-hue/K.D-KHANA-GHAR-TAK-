// FIREBASE INITIALIZATION
const firebaseConfig = {
  apiKey: "AIzaSyDDTFzD8eaxS6hsQ_W5akOWRWixyZdjkSo",
  authDomain: "kd-ka-khana-ghar-tak.firebaseapp.com",
  projectId: "kd-ka-khana-ghar-tak",
  storageBucket: "kd-ka-khana-ghar-tak.firebasestorage.app",
  messagingSenderId: "69933070653",
  appId: "1:69933070653:web:f9b93ba827d794bb376d54"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

// GOOGLE SIGN-IN FUNCTION
function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider)
    .then((result) => {
      const user = result.user;
      alert("Welcome " + (user.displayName || "User") + "!");
      document.getElementById('user-name-input').value = user.displayName || "";
      document.getElementById('vip-tag').innerHTML = "<span style='color:gold; font-weight:bold;'>👑 VIP MEMBER</span>";
    })
    .catch((error) => {
      console.error(error);
      alert("Login Error: " + error.message);
    });
}

// MASTER MENU DATA CATEGORY-WISE
let menu = [
  // Breads & Naan
  { id: 1, name: "Plain Tawa Roti", price: 10, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 2, name: "Tawa Roti Butter", price: 15, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 3, name: "Tandoori Roti", price: 25, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 4, name: "Tandoori Butter Roti", price: 35, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 5, name: "Plain Naan", price: 60, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200" },
  { id: 6, name: "Butter Naan", price: 80, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200" },
  { id: 7, name: "Lacha Paratha", price: 30, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },

  // Dal & Gravy
  { id: 8, name: "Plain Dal", price: 70, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200" },
  { id: 9, name: "Dal Fry", price: 110, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200" },
  { id: 10, name: "Dal Tarka", price: 140, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200" },
  { id: 11, name: "Dal Makhani", price: 200, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200" },

  // Main Course
  { id: 12, name: "Plain Rice", price: 140, cat: "Main Course", img: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200" },
  { id: 13, name: "Jeera Rice", price: 160, cat: "Main Course", img: "https://images.unsplash.com/photo-1516684732162-798a0062be99?w=200" },
  { id: 14, name: "Chole Masala", price: 220, cat: "Main Course", img: "https://images.unsplash.com/photo-1588853218252-76343542283a?w=200" },
  { id: 15, name: "Paneer Masala", price: 200, cat: "Main Course", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200" },
  { id: 16, name: "Shahi Paneer", price: 260, cat: "Main Course", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200" },
  { id: 17, name: "Palak Paneer", price: 200, cat: "Main Course", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200" },
  { id: 18, name: "Mix Veg", price: 180, cat: "Main Course", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200" },
  { id: 19, name: "Aloo Gobi", price: 160, cat: "Main Course", img: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=200" },
  { id: 20, name: "Chicken Butter Masala (Full)", price: 380, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
  { id: 21, name: "Chicken Butter Masala (Half)", price: 200, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
  { id: 22, name: "Chicken Curry (Full)", price: 240, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
  { id: 23, name: "Chicken Curry (Half)", price: 140, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200" },
  { id: 24, name: "Mutton Curry (Full)", price: 400, cat: "Main Course", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
  { id: 25, name: "Mutton Curry (Half)", price: 220, cat: "Main Course", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
  { id: 26, name: "Mutton Rogan Josh", price: 300, cat: "Main Course", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
  { id: 27, name: "Pork Curry (Full)", price: 280, cat: "Main Course", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
  { id: 28, name: "Pork Curry (Half)", price: 150, cat: "Main Course", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },
  { id: 29, name: "Pork Masala", price: 300, cat: "Main Course", img: "https://images.unsplash.com/photo-1544025162-d76694265947?w=200" },

  // Pasta
  { id: 30, name: "Red Sauce Pasta (Full)", price: 100, cat: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281273?w=200" },
  { id: 31, name: "Red Sauce Pasta (Half)", price: 60, cat: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281273?w=200" },
  { id: 32, name: "White Sauce Pasta (Full)", price: 120, cat: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281273?w=200" },
  { id: 33, name: "White Sauce Pasta (Half)", price: 70, cat: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281273?w=200" },
  { id: 34, name: "Chicken Pasta (Full)", price: 180, cat: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281273?w=200" },
  { id: 35, name: "Chicken Pasta (Half)", price: 100, cat: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281273?w=200" },
  { id: 36, name: "Cheese Pasta (Full)", price: 200, cat: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281273?w=200" },
  { id: 37, name: "Cheese Pasta (Half)", price: 110, cat: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281273?w=200" },
  { id: 38, name: "Macaroni R&W", price: 100, cat: "Pasta", img: "https://images.unsplash.com/photo-1621996346565-e3d5d6281273?w=200" },

  // Breakfast & Snacks
  { id: 39, name: "Roti Veg", price: 40, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 40, name: "Puri Veg", price: 40, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 41, name: "Paratha Veg", price: 40, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 42, name: "Aloo Paratha", price: 50, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 43, name: "Sandwich Veg", price: 50, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200" },
  { id: 44, name: "Sandwich Non-Veg", price: 80, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200" },
  { id: 45, name: "Paneer Paratha", price: 100, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 46, name: "Bread Butter", price: 60, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200" },
  { id: 47, name: "Cheese Paratha", price: 120, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200" },
  { id: 48, name: "Cornflakes", price: 80, cat: "Breakfast & Snacks", img: "https://images.unsplash.com/photo-1528735602780-2552fd46c7af?w=200" },

  // Tea & Coffee
  { id: 49, name: "Black Tea", price: 10, cat: "Tea & Coffee", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200" },
  { id: 50, name: "Ice Tea", price: 35, cat: "Tea & Coffee", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200" },
  { id: 51, name: "Milk Tea", price: 20, cat: "Tea & Coffee", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200" },
  { id: 52, name: "Coconut Tea", price: 50, cat: "Tea & Coffee", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200" },
  { id: 53, name: "Chocolate Tea", price: 60, cat: "Tea & Coffee", img: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?w=200" },
  { id: 54, name: "Black Coffee", price: 20, cat: "Tea & Coffee", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200" },
  { id: 55, name: "Milk Coffee", price: 40, cat: "Tea & Coffee", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200" },
  { id: 56, name: "Cold Coffee", price: 70, cat: "Tea & Coffee", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200" },

  // Chowmein & Rolls
  { id: 57, name: "Veg Chow (Full)", price: 50, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 58, name: "Veg Chow (Half)", price: 30, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 59, name: "Egg Chow (Full)", price: 70, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 60, name: "Egg Chow (Half)", price: 60, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 61, name: "Chicken Chow (Full)", price: 100, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 62, name: "Chicken Chow (Half)", price: 60, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 63, name: "Pork Chow (Full)", price: 120, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200" },
  { id: 64, name: "Veg Roll", price: 40, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 65, name: "Egg Roll", price: 60, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 66, name: "Chicken Roll", price: 80, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 67, name: "Pork Roll", price: 100, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },
  { id: 68, name: "Baba Roll", price: 120, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200" },

  // Fried Rice
  { id: 69, name: "Veg Fried Rice (Full)", price: 60, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200" },
  { id: 70, name: "Veg Fried Rice (Half)", price: 40, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200" },
  { id: 71, name: "Egg Fried Rice (Full)", price: 80, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200" },
  { id: 72, name: "Egg Fried Rice (Half)", price: 50, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200" },
  { id: 73, name: "Chicken Fried Rice (Full)", price: 100, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200" },
  { id: 74, name: "Chicken Fried Rice (Half)", price: 60, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200" },
  { id: 75, name: "Pork Fried Rice (Full)", price: 120, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200" },
  { id: 76, name: "Pork Fried Rice (Half)", price: 70, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200" },

  // Momos
  { id: 77, name: "Veg Momo (Full)", price: 50, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
  { id: 78, name: "Veg Momo (Half)", price: 30, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
  { id: 79, name: "Chicken Momo (Full)", price: 70, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
  { id: 80, name: "Chicken Momo (Half)", price: 40, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
  { id: 81, name: "Pork Momo (Full)", price: 80, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
  { id: 82, name: "Pork Momo (Half)", price: 50, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
  { id: 83, name: "Paneer Momo (Full)", price: 100, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
  { id: 84, name: "Paneer Momo (Half)", price: 60, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
  { id: 85, name: "Cheese Momo (Full)", price: 120, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },
  { id: 86, name: "Cheese Momo (Half)", price: 70, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200" },

  // Starters & Tandoor
  { id: 87, name: "Chicken Pokora (Full)", price: 100, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 88, name: "Chicken Pokora (Half)", price: 50, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 89, name: "Chicken Drumstick", price: 50, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 90, name: "Tandoori Chicken (Full)", price: 500, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200" },
  { id: 91, name: "Tandoori Chicken (Half)", price: 300, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200" },
  { id: 92, name: "Tandoori Kabab (Full)", price: 500, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200" },
  { id: 93, name: "Tandoori Kabab (Half)", price: 300, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200" },
  { id: 94, name: "Chicken Tikka (Full)", price: 500, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200" },
  { id: 95, name: "Chicken Tikka (Half)", price: 300, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=200" },
  { id: 96, name: "Chilli Chicken (Full)", price: 200, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 97, name: "Chilli Chicken (Half)", price: 110, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 98, name: "Chicken Dry Fried (Full)", price: 200, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 99, name: "Chicken Dry Fried (Half)", price: 110, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 100, name: "Pork Chilli (Full)", price: 280, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 101, name: "Pork Chilli (Half)", price: 150, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 102, name: "Pork Dry Fried (Full)", price: 260, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 103, name: "Pork Dry Fried (Half)", price: 140, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 104, name: "Paneer Pokora", price: 100, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },
  { id: 105, name: "Veg Pokora", price: 50, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200" },

  // Juices & Drinks
  { id: 106, name: "Fresh Lime Water", price: 50, cat: "Juices & Drinks", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200" },
  { id: 107, name: "Apple Juice", price: 100, cat: "Juices & Drinks", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200" },
  { id: 108, name: "Mango Juice", price: 100, cat: "Juices & Drinks", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200" },
  { id: 109, name: "Grape Juice", price: 100, cat: "Juices & Drinks", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200" },
  { id: 110, name: "Cranberry Juice", price: 100, cat: "Juices & Drinks", img: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?w=200" },

  // Desserts
  { id: 111, name: "Gulab Jamun", price: 50, cat: "Desserts", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200" },
  { id: 112, name: "Rasgulla", price: 50, cat: "Desserts", img: "https://images.unsplash.com/photo-1589301760014-d929f3979dbc?w=200" },
  { id: 113, name: "Ice Cream", price: 70, cat: "Desserts", img: "https://images.unsplash.com/photo-1567206563064-6f60f4002b57?w=200" }
];

let cart = [];
let wishlist = [];
let orders = [];
let discount = 0;
let currentCat = "All";

// NAVIGATION LOGIC
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if(pageId === 'cart') renderCart();
  if(pageId === 'wishlist') renderWishlist();
  if(pageId === 'orders') renderOrders();
}

function toggleNotifications() {
  const box = document.getElementById('notif-box');
  box.style.display = box.style.display === 'block' ? 'none' : 'block';
}

// RENDER CATEGORY BAR
function renderCategories() {
  const categories = ["All", "Breads & Naan", "Dal & Gravy", "Main Course", "Pasta", "Breakfast & Snacks", "Tea & Coffee", "Chowmein & Rolls", "Fried Rice", "Momos", "Starters & Tandoor", "Juices & Drinks", "Desserts"];
  const bar = document.getElementById('category-bar');
  bar.innerHTML = categories.map(c => `
    <div class="cat-chip ${c === currentCat ? 'active' : ''}" onclick="selectCategory('${c}')">${c}</div>
  `).join('');
}

function selectCategory(cat) {
  currentCat = cat;
  renderCategories();
  renderMenu();
}

// RENDER MENU
function renderMenu() {
  const container = document.getElementById('menu-container');
  let filtered = menu;
  if(currentCat !== "All") filtered = menu.filter(m => m.cat === currentCat);
  
  container.innerHTML = filtered.map(item => `
    <div class="food-card">
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-primary" style="margin-top:5px;" onclick="addToCart(${item.id})">ADD +</button>
      </div>
      <span onclick="toggleWishlist(${item.id})" style="cursor:pointer; font-size:1.2rem;">
        ${wishlist.includes(item.id) ? '❤️' : '🤍'}
      </span>
    </div>
  `).join('');
}

function filterMenu() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const container = document.getElementById('menu-container');
  const filtered = menu.filter(m => m.name.toLowerCase().includes(query));
  container.innerHTML = filtered.map(item => `
    <div class="food-card">
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-primary" style="margin-top:5px;" onclick="addToCart(${item.id})">ADD +</button>
      </div>
    </div>
  `).join('');
}

// CART & CHECKOUT
function addToCart(id) {
  const item = menu.find(m => m.id === id);
  const exist = cart.find(c => c.id === id);
  if(exist) exist.qty++;
  else cart.push({...item, qty: 1});
  updateCartCount();
  alert(item.name + " added to cart!");
}

function updateCartCount() {
  document.getElementById('cart-count').innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function renderCart() {
  const container = document.getElementById('cart-items');
  if(cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    document.getElementById('bill-summary').innerHTML = "";
    return;
  }
  container.innerHTML = cart.map(i => `
    <div class="food-card">
      <div class="food-info">
        <b>${i.name}</b><br>₹${i.price} x ${i.qty} = ₹${i.price * i.qty}
      </div>
      <div>
        <button onclick="changeQty(${i.id}, -1)">-</button>
        <span style="margin:0 5px;">${i.qty}</span>
        <button onclick="changeQty(${i.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
  
  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const finalTotal = Math.max(0, subtotal - discount);
  document.getElementById('bill-summary').innerHTML = `
    <div>Subtotal: ₹${subtotal}</div>
    <div>Discount: -₹${discount}</div>
    <div><b>Total Payable: ₹${finalTotal}</b></div>
  `;
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if(!item) return;
  item.qty += delta;
  if(item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCartCount();
  renderCart();
}

function applyCoupon() {
  const code = document.getElementById('coupon-code').value.toUpperCase();
  if(code === 'FIRST30') {
    discount = 30;
    alert("Coupon Applied! ₹30 OFF");
  } else {
    alert("Invalid Coupon Code!");
  }
  renderCart();
}

function placeOrder() {
  const name = document.getElementById('del-name').value;
  const phone = document.getElementById('del-phone').value;
  const address = document.getElementById('del-address').value;
  const pay = document.getElementById('payment-mode').value;
  
  if(!name || !phone || !address) return alert("Please fill all delivery details!");
  if(cart.length === 0) return alert("Cart is empty!");

  const newOrder = {
    id: "ORD" + Date.now().toString().slice(-5),
    name, phone, address, pay,
    items: [...cart],
    total: cart.reduce((s, i) => s + (i.price * i.qty), 0) - discount,
    status: "Pending"
  };

  orders.push(newOrder);
  cart = [];
  updateCartCount();
  alert("Order Placed Successfully! Tracking ID: " + newOrder.id);
  showPage('orders');
}

// WISHLIST
function toggleWishlist(id) {
  if(wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
  else wishlist.push(id);
  renderMenu();
}

function renderWishlist() {
  const container = document.getElementById('wishlist-container');
  const items = menu.filter(m => wishlist.includes(m.id));
  if(items.length === 0) return container.innerHTML = "<p>No items in wishlist.</p>";
  container.innerHTML = items.map(i => `
    <div class="food-card">
      <img src="${i.img}" class="food-img">
      <div class="food-info">
        <b>${i.name}</b><br>₹${i.price}
        <button class="btn-primary" onclick="addToCart(${i.id})">ADD +</button>
      </div>
    </div>
  `).join('');
}

// LIVE ORDERS TRACKING
function renderOrders() {
  const container = document.getElementById('my-orders-list');
  if(orders.length === 0) return container.innerHTML = "<p>No live orders.</p>";
  container.innerHTML = orders.map(o => `
    <div class="order-card">
      <div><b>Order ID:</b> ${o.id}</div>
      <div><b>Status:</b> <span style="color:var(--accent-red);">${o.status}</span></div>
      <div><b>Total:</b> ₹${o.total} (${o.pay})</div>
    </div>
  `).join('');
}

// PROFILE & ADMIN SETUP
function saveProfile() {
  alert("Profile Saved!");
}

function loginAdmin() {
  const email = document.getElementById('admin-email').value;
  const pass = document.getElementById('admin-pass').value;
  if(email === 'kdrabha2000@gmail.com' && pass === 'admin123') {
    document.getElementById('admin-panel').style.display = 'block';
    alert("Welcome Admin!");
    renderAdmin();
  } else {
    alert("Access Denied!");
  }
}

function renderAdmin() {
  document.getElementById('stat-total').innerText = orders.length;
  document.getElementById('stat-pending').innerText = orders.filter(o => o.status === 'Pending').length;
  document.getElementById('stat-earning').innerText = orders.reduce((s, o) => s + o.total, 0);

  const container = document.getElementById('admin-orders-list');
  container.innerHTML = orders.map(o => `
    <div class="order-card">
      <b>${o.id}</b> - ${o.name} (${o.phone})<br>
      Address: ${o.address}<br>
      Status: <b>${o.status}</b><br>
      <button class="btn-sec" onclick="updateStatus('${o.id}', 'Accepted')">Accept</button>
      <button class="btn-sec" onclick="updateStatus('${o.id}', 'Out for Delivery')">Out for Delivery</button>
      <button class="btn-sec" onclick="updateStatus('${o.id}', 'Delivered')">Delivered</button>
    </div>
  `).join('');
}

function updateStatus(id, st) {
  const ord = orders.find(o => o.id === id);
  if(ord) ord.status = st;
  renderAdmin();
}

function adminAddItem() {
  const name = document.getElementById('add-item-name').value;
  const price = Number(document.getElementById('add-item-price').value);
  const cat = document.getElementById('add-item-cat').value;
  if(!name || !price) return alert("Fill item details!");
  
  menu.push({ id: Date.now(), name, price, cat, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200" });
  alert("Item added live!");
  renderMenu();
}

// INITIAL LOAD
renderCategories();
renderMenu();
