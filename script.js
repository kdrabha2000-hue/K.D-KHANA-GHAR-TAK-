// 1. FIREBASE SETUP
const firebaseConfig = {
  apiKey: "AIzaSyDDTFzD8eaxS6hsQ_W5akOWRWixyZdjkSo",
  authDomain: "kd-ka-khana-ghar-tak.firebaseapp.com",
  databaseURL: "https://kd-ka-khana-ghar-tak-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kd-ka-khana-ghar-tak",
  storageBucket: "kd-ka-khana-ghar-tak.firebasestorage.app",
  messagingSenderId: "69933070653",
  appId: "1:69933070653:web:f9b93ba827d794bb376d54"
};

if (!firebase.apps.length) {
  firebase.initializeApp(firebaseConfig);
}
const database = firebase.database();

// GLOBAL VARIABLES
let currentUserPhone = null;
let cart = [];
let wishlist = [];
let discount = 0;
let currentCat = "All";

// LIVE BANNER ROTATION
let liveBanners = [
  "🔥 TODAY'S SPECIAL: Chicken Butter Masala @ ₹380",
  "🎂 SPECIAL BIRTHDAY CAKES: Normal, Custom & Size Offers Available!",
  "🎉 FLAT 30% OFF - Use Promo Code: FIRST30",
  "⚡ FASTEST DELIVERY: 8:00 AM to 9:30 PM in Udalguri!"
];
let currentBannerIdx = 0;

setInterval(() => {
  const bannerElem = document.getElementById('home-banner');
  if (bannerElem) {
    currentBannerIdx = (currentBannerIdx + 1) % liveBanners.length;
    bannerElem.innerText = liveBanners[currentBannerIdx];
  }
}, 3500);

// MENU DATA (113 Food Items + Birthday Cakes)
let menu = [
  // Birthday Cakes
  { id: 201, name: "Normal Cake (500gm)", price: 450, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200" },
  { id: 202, name: "Customer Choice Cake (500gm)", price: 500, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200" },
  { id: 203, name: "Offer Cake (1kg)", price: 850, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=200" },
  { id: 204, name: "Offer Cake (2kg)", price: 1600, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=200" },

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

// NAVIGATION
function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  
  if(pageId === 'cart') renderCart();
  if(pageId === 'orders') renderOrders();
}

function toggleNotifications() {
  const box = document.getElementById('notif-box');
  if (box) box.style.display = box.style.display === 'block' ? 'none' : 'block';
}

// UI RENDERING
function renderCategories() {
  const categories = ["All", "Birthday Cakes", "Breads & Naan", "Dal & Gravy", "Main Course", "Pasta", "Breakfast & Snacks", "Tea & Coffee", "Chowmein & Rolls", "Fried Rice", "Momos", "Starters & Tandoor", "Juices & Drinks", "Desserts"];
  const bar = document.getElementById('category-bar');
  if (bar) {
    bar.innerHTML = categories.map(c => `
      <div class="cat-chip ${c === currentCat ? 'active' : ''}" onclick="selectCategory('${c}')">${c}</div>
    `).join('');
  }
}

function selectCategory(cat) {
  currentCat = cat;
  renderCategories();
  renderMenu();
}

function renderMenu() {
  const container = document.getElementById('menu-container');
  if (!container) return;
  let filtered = currentCat === "All" ? menu : menu.filter(m => m.cat === currentCat);
  
  container.innerHTML = filtered.map(item => `
    <div class="food-card">
      <span class="wishlist-icon" onclick="toggleWishlist(${item.id})">${wishlist.includes(item.id) ? '❤️' : '🤍'}</span>
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-primary" onclick="addToCart(${item.id})">ADD +</button>
      </div>
    </div>
  `).join('');
}

function filterMenu() {
  const inputElem = document.getElementById('search-input');
  if (!inputElem) return;
  const query = inputElem.value.toLowerCase();
  const container = document.getElementById('menu-container');
  if (!container) return;
  const filtered = menu.filter(m => m.name.toLowerCase().includes(query));
  container.innerHTML = filtered.map(item => `
    <div class="food-card">
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-primary" onclick="addToCart(${item.id})">ADD +</button>
      </div>
    </div>
  `).join('');
}

// CART LOGIC
function addToCart(id) {
  const item = menu.find(m => m.id === id);
  if (!item) return;
  const exist = cart.find(c => c.id === id);
  if (exist) exist.qty++;
  else cart.push({ ...item, qty: 1 });
  updateCartCount();
  alert(item.name + " added to cart!");
}

function updateCartCount() {
  const countElem = document.getElementById('cart-count');
  if (countElem) {
    countElem.innerText = cart.reduce((s, i) => s + i.qty, 0);
  }
}

function renderCart() {
  const container = document.getElementById('cart-items');
  const summary = document.getElementById('bill-summary');
  if (!container) return;

  if (cart.length === 0) {
    container.innerHTML = "<p>Your cart is empty.</p>";
    if (summary) summary.innerHTML = "";
    return;
  }
  container.innerHTML = cart.map(i => `
    <div class="order-card" style="display:flex; justify-content:space-between; align-items:center;">
      <div><b>${i.name}</b><br>₹${i.price} x ${i.qty} = ₹${i.price * i.qty}</div>
      <div>
        <button onclick="changeQty(${i.id}, -1)">-</button> 
        <span style="margin:0 5px;">${i.qty}</span> 
        <button onclick="changeQty(${i.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
  
  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  if (summary) {
    summary.innerHTML = `
      <div>Subtotal: ₹${subtotal}</div>
      <div>Discount: -₹${discount}</div>
      <div><b>Total Payable: ₹${Math.max(0, subtotal - discount)}</b></div>
    `;
  }
}

function changeQty(id, delta) {
  const item = cart.find(c => c.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(c => c.id !== id);
  updateCartCount();
  renderCart();
}

// CUSTOMER AUTH & DATA SYNC
function customerLogin() {
  const phoneInput = document.getElementById('auth-phone');
  if (!phoneInput) return;
  const phone = phoneInput.value;
  if(phone.length >= 10) {
    currentUserPhone = phone;
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-details-section').style.display = 'block';
    document.getElementById('display-name').innerText = "User: " + phone;
    document.getElementById('del-phone').value = phone; 
    
    database.ref('users/' + phone).once('value', (snap) => {
      if(snap.val()) {
        if (document.getElementById('user-name-input')) document.getElementById('user-name-input').value = snap.val().name || "";
        if (document.getElementById('user-address-input')) document.getElementById('user-address-input').value = snap.val().address || "";
        if (document.getElementById('del-name')) document.getElementById('del-name').value = snap.val().name || "";
        if (document.getElementById('del-address')) document.getElementById('del-address').value = snap.val().address || "";
      }
    });
    alert("Logged In Successfully! Saved profile loaded.");
    renderOrders();
  } else {
    alert("Enter a valid 10-digit phone number!");
  }
}

function saveProfile() {
  if(!currentUserPhone) return alert("Please Login first!");
  const name = document.getElementById('user-name-input').value;
  const address = document.getElementById('user-address-input').value;
  database.ref('users/' + currentUserPhone).set({ name, address })
    .then(() => alert("Profile Saved Successfully!"));
}

function deleteAccount() {
  if(!currentUserPhone) return alert("Please login first!");
  const reason = prompt("We are sad to see you go! Please enter the reason for deleting your account:");
  if(reason) {
    database.ref('deleted_accounts/' + currentUserPhone).set({
      phone: currentUserPhone,
      reason: reason,
      date: new Date().toLocaleString()
    }).then(() => {
      database.ref('users/' + currentUserPhone).remove();
      alert("Account deleted successfully.");
      location.reload();
    });
  }
}

// PLACE ORDER & HISTORY (WITH TIMELINE LIVE TRACKING)
function placeOrder() {
  if(!currentUserPhone) return alert("Please Login in Profile tab first!");
  
  const nameInp = document.getElementById('del-name');
  const addressInp = document.getElementById('del-address');
  const payInp = document.getElementById('payment-mode');

  if (!nameInp || !addressInp) return;

  const name = nameInp.value;
  const address = addressInp.value;
  const pay = payInp ? payInp.value : "COD";

  if (!name || !address) return alert("Please fill all delivery details!");
  if (cart.length === 0) return alert("Cart is empty!");

  const orderId = "ORD" + Date.now().toString().slice(-5);
  const newOrder = {
    id: orderId,
    phone: currentUserPhone,
    name: name,
    address: address,
    pay: pay,
    items: cart,
    total: cart.reduce((s, i) => s + (i.price * i.qty), 0) - discount,
    status: "Pending",
    date: new Date().toLocaleString()
  };

  database.ref('orders/' + orderId).set(newOrder).then(() => {
    cart = [];
    updateCartCount();
    alert("Order Placed Successfully! Tracking ID: " + orderId);
    showPage('orders');
  });
}

function renderOrders() {
  const container = document.getElementById('my-orders-list');
  if(!container) return;

  if(!currentUserPhone) {
    container.innerHTML = "<p>Please login in Profile tab to see your order history and tracking.</p>";
    return;
  }
  
  database.ref('orders').on('value', (snapshot) => {
    const data = snapshot.val();
    let myOrders = data ? Object.values(data).filter(o => o.phone === currentUserPhone) : [];
    
    let totalCount = myOrders.length;
    let cancelByMe = myOrders.filter(o => o.status === 'CancelledByCustomer').length;
    let cancelByAdmin = myOrders.filter(o => o.status === 'CancelledByAdmin').length;

    container.innerHTML = `
      <div class="bill-summary" style="margin-bottom:15px;">
        <b>My Stats:</b> Total Orders: ${totalCount} | Cancelled by Me: ${cancelByMe} | Cancelled by KD: ${cancelByAdmin}
      </div>
      ${myOrders.length === 0 ? "<p>No orders placed yet.</p>" : myOrders.map(o => {
        
        // Status Order Logic for Timeline
        const statuses = ["Pending", "Accepted", "Out for Delivery", "Delivered"];
        const currentIdx = statuses.indexOf(o.status);

        return `
        <div class="order-card" style="margin-bottom:20px;">
          <div><b>Order ID:</b> ${o.id} | <b>Date:</b> ${o.date}</div>
          <div><b>Items:</b> ${(o.items || []).map(i => i.name + ' x' + i.qty).join(', ')}</div>
          <div><b>Total Amount:</b> ₹${o.total} (${o.pay})</div>
          
          <!-- VISUAL TRACKING TIMELINE -->
          <div style="margin-top:15px; font-weight:bold; font-size:0.9rem;">Order Status Timeline:</div>
          <div class="timeline">
            
            <div class="timeline-step ${currentIdx >= 0 ? 'completed' : ''}">
              <div class="timeline-title">Order Placed</div>
              <div class="timeline-time">${o.date}</div>
              <div class="timeline-desc">Your order has been received by K.D Kitchen.</div>
            </div>

            <div class="timeline-step ${currentIdx >= 1 ? 'completed' : (currentIdx === 0 ? 'active' : '')}">
              <div class="timeline-title">Order Confirmed / Cooking</div>
              <div class="timeline-desc">Restaurant accepted your order and started cooking.</div>
            </div>

            <div class="timeline-step ${currentIdx >= 2 ? 'completed' : (currentIdx === 1 ? 'active' : '')}">
              <div class="timeline-title">Out For Delivery</div>
              <div class="timeline-desc">Delivery partner picked up your food.</div>
            </div>

            <div class="timeline-step ${currentIdx >= 3 ? 'completed' : (currentIdx === 2 ? 'active' : '')}">
              <div class="timeline-title">Delivered</div>
              <div class="timeline-desc">Food delivered to your address. Enjoy your meal!</div>
            </div>

          </div>

          <!-- LOCK LOGIC: Only Pending orders can be cancelled -->
          ${o.status === 'Pending' ? 
            `<button class="btn-sec" style="background:red; margin-top:5px;" onclick="cancelMyOrder('${o.id}')">Cancel Order</button>` 
            : `<p style="color:orange; font-size:0.8rem; margin-top:5px;">🔒 Order Locked (Accepted / Cooking in progress)</p>`}
          
          <button class="btn-sec" style="background:#2196F3; margin-top:5px;" onclick="reorder('${o.id}')">1-Click Re-Order</button>
        </div>
      `}).reverse().join('')}
    `;
  });
}

function cancelMyOrder(id) {
  if(confirm("Are you sure you want to cancel this order?")) {
    database.ref('orders/' + id).update({ status: 'CancelledByCustomer' });
  }
}

function reorder(id) {
  database.ref('orders/' + id).once('value', (snap) => {
    if(snap.val() && snap.val().items) {
      cart = [...snap.val().items];
      updateCartCount();
      alert("Items added to cart from past order!");
      showPage('cart');
    }
  });
}

// ADMIN DASHBOARD (Protected by Password: K.d@12345)
function loginAdmin() {
  const passInp = document.getElementById('admin-pass');
  if (!passInp) return;
  
  if (passInp.value === 'K.d@12345') {
    document.getElementById('admin-panel').style.display = 'block';
    alert("Welcome Admin!");
    renderAdmin();
  } else {
    alert("Access Denied! Invalid Admin Password.");
  }
}

function renderAdmin() {
  database.ref('orders').on('value', (snap) => {
    const ordersData = snap.val();
    const liveOrders = ordersData ? Object.values(ordersData) : [];

    const totalElem = document.getElementById('stat-total');
    const pendingElem = document.getElementById('stat-pending');
    const earningElem = document.getElementById('stat-earning');

    if (totalElem) totalElem.innerText = liveOrders.length;
    if (pendingElem) pendingElem.innerText = liveOrders.filter(o => o.status === 'Pending').length;
    if (earningElem) earningElem.innerText = liveOrders.filter(o => o.status === 'Delivered').reduce((s, o) => s + (o.total || 0), 0);

    const container = document.getElementById('admin-orders-list');
    if (container) {
      container.innerHTML = liveOrders.length === 0 ? "<p>No incoming orders.</p>" : liveOrders.map(o => `
        <div class="order-card">
          <b>${o.id}</b> - ${o.name} <a href="tel:${o.phone}" style="color:gold;">📞 Call (${o.phone})</a><br>
          Address: ${o.address}<br>
          Items: ${(o.items || []).map(i => i.name + ' x' + i.qty).join(', ')}<br>
          Status: <b>${o.status}</b><br>
          <button class="btn-sec" onclick="updateStatus('${o.id}', 'Accepted')">Accept Order</button>
          <button class="btn-sec" onclick="updateStatus('${o.id}', 'Out for Delivery')">Out for Delivery</button>
          <button class="btn-sec" onclick="updateStatus('${o.id}', 'Delivered')">Delivered</button>
          <button class="btn-sec" style="background:red;" onclick="updateStatus('${o.id}', 'CancelledByAdmin')">Reject Order</button>
        </div>
      `).reverse().join('');
    }
  });

  // Account Deletion Reason Logs
  database.ref('deleted_accounts').on('value', (snap) => {
    const logsData = snap.val();
    const logs = logsData ? Object.values(logsData) : [];
    const container = document.getElementById('admin-delete-logs');
    if(container) {
      container.innerHTML = logs.length === 0 ? "<p>No deleted accounts.</p>" : logs.map(l => `
        <div style="font-size:0.85rem; padding:5px; border-bottom:1px solid #eee;">
          <b>Phone:</b> ${l.phone} | <b>Date:</b> ${l.date}<br>
          <b>Reason:</b> ${l.reason}
        </div>
      `).join('');
    }
  });

  // Admin Menu Manager
  const menuContainer = document.getElementById('admin-menu-list');
  if (menuContainer) {
    menuContainer.innerHTML = menu.map(m => `
      <div class="admin-item-row">
        <span>${m.name} (₹<input type="number" id="price-${m.id}" value="${m.price}" style="width:60px; padding:2px; display:inline;">)</span>
        <div>
          <button onclick="adminEditPrice(${m.id})" style="background:#2196F3; color:white; border:none; padding:4px 6px; border-radius:4px;">Save Price</button>
          <button onclick="adminDeleteItem(${m.id})" style="background:red; color:white; border:none; padding:4px 6px; border-radius:4px;">Delete</button>
        </div>
      </div>
    `).join('');
  }
}

function updateStatus(id, st) {
  database.ref('orders/' + id).update({ status: st });
}

function adminAddItem() {
  const nameInp = document.getElementById('add-item-name');
  const priceInp = document.getElementById('add-item-price');
  const catInp = document.getElementById('add-item-cat');

  if (!nameInp || !priceInp || !catInp) return;

  const name = nameInp.value;
  const price = Number(priceInp.value);
  const cat = catInp.value;

  if (!name || !price) return alert("Fill item details!");

  menu.push({ id: Date.now(), name, price, cat, img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200" });
  alert("Item added to live menu!");
  renderMenu();
  renderAdmin();
}

function adminDeleteItem(id) {
  menu = menu.filter(m => m.id !== id);
  alert("Item deleted!");
  renderMenu();
  renderAdmin();
}

function adminEditPrice(id) {
  const priceInp = document.getElementById(`price-${id}`);
  if (!priceInp) return;
  const newPrice = Number(priceInp.value);
  const item = menu.find(m => m.id === id);
  if (item && newPrice) {
    item.price = newPrice;
    alert("Price updated for " + item.name + "!");
    renderMenu();
  }
}

function adminUpdateBanner() {
  const textInp = document.getElementById('new-banner-text');
  if (!textInp || !textInp.value) return alert("Enter banner text!");
  liveBanners.push("🔥 " + textInp.value);
  const bannerElem = document.getElementById('home-banner');
  if (bannerElem) bannerElem.innerText = "🔥 " + textInp.value;
  alert("New Banner Added to Slideshow!");
  textInp.value = "";
}

function adminAssignVIP() {
  const phoneInp = document.getElementById('vip-user-phone');
  if (!phoneInp || !phoneInp.value) return alert("Enter customer phone number!");
  database.ref('users/' + phoneInp.value).update({ isVIP: true })
    .then(() => alert("Customer " + phoneInp.value + " is now a 👑 VIP Member!"));
  phoneInp.value = "";
}

function adminCreateCoupon() {
  const codeInp = document.getElementById('new-coupon-code');
  const discInp = document.getElementById('new-coupon-discount');
  if (!codeInp || !discInp) return;

  const code = codeInp.value.toUpperCase();
  const disc = Number(discInp.value);
  if (!code || !disc) return alert("Enter valid code and discount!");
  
  database.ref('coupons/' + code).set({ discount: disc })
    .then(() => alert("Coupon " + code + " created for ₹" + disc + " OFF!"));
  
  codeInp.value = "";
  discInp.value = "";
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
  else wishlist.push(id);
  renderMenu();
}

function applyCoupon() {
  const codeInp = document.getElementById('coupon-code');
  if (!codeInp) return;
  const code = codeInp.value.toUpperCase();
  if (code === 'FIRST30') {
    discount = 30;
    alert("Coupon Applied! ₹30 OFF");
  } else {
    alert("Invalid Coupon Code!");
  }
  renderCart();
}

function useSavedAddress() {
  const dropdown = document.getElementById('saved-address-dropdown');
  const addressBox = document.getElementById('del-address');
  if (dropdown && addressBox && dropdown.value) {
    addressBox.value = dropdown.value;
  }
}

// INITIAL LOAD
window.onload = function() {
  renderCategories();
  renderMenu();
};
