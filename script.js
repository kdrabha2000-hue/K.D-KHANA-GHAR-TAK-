const firebaseConfig = {
  apiKey: "AIzaSyDDTFzD8eaxS6hsQ_W5akOWRWixyZdjkSo",
  authDomain: "kd-ka-khana-ghar-tak.firebaseapp.com",
  databaseURL: "https://kd-ka-khana-ghar-tak-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kd-ka-khana-ghar-tak",
  storageBucket: "kd-ka-khana-ghar-tak.firebasestorage.app",
  messagingSenderId: "69933070653",
  appId: "1:69933070653:web:f9b93ba827d794bb376d54"
};

if (!firebase.apps.length) firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const database = firebase.database();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

let currentUser = null;
let selectedModalItem = null;
let cart = [];
let wishlist = [];
let discount = 0;
let currentCat = "All";
let isStoreOpen = true;
let currentAdminUPI = "6000026478@okbizaxis";

// COMPLETE 114 RESTAURANT MENU DATA
let menu = [
  // Cold Drinks & Beverages
  { id: 106, name: "Sprite / Coca-Cola (200ml)", price: 40, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200", isOut: false },
  { id: 107, name: "Fresh Cold Coffee", price: 70, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200", isOut: false },

  // Birthday Cakes
  { id: 201, name: "Normal Cake (500gm)", price: 450, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200", isOut: false },
  { id: 202, name: "Customer Choice Cake (500gm)", price: 500, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200", isOut: false },
  { id: 203, name: "Offer Cake (1kg)", price: 850, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=200", isOut: false },
  { id: 204, name: "Offer Cake (2kg)", price: 1600, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=200", isOut: false },

  // Breads & Naan
  { id: 1, name: "Tandoori Roti", price: 15, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200", isOut: false },
  { id: 2, name: "Butter Roti", price: 20, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200", isOut: false },
  { id: 3, name: "Plain Naan", price: 40, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200", isOut: false },
  { id: 4, name: "Butter Naan", price: 50, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200", isOut: false },
  { id: 5, name: "Garlic Naan", price: 70, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200", isOut: false },

  // Dal & Gravy
  { id: 10, name: "Dal Tadka", price: 120, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200", isOut: false },
  { id: 11, name: "Dal Makhani", price: 180, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200", isOut: false },

  // Main Course
  { id: 20, name: "Chicken Butter Masala (Full)", price: 380, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200", isOut: false },
  { id: 21, name: "Chicken Curry (Full)", price: 240, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200", isOut: false },
  { id: 22, name: "Kadai Paneer", price: 220, cat: "Main Course", img: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=200", isOut: false },

  // Momos
  { id: 79, name: "Chicken Momo (Full)", price: 70, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200", isOut: false },
  { id: 81, name: "Pork Momo (Full)", price: 80, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200", isOut: false },

  // Starters & Tandoor
  { id: 90, name: "Chicken Pokora (Half)", price: 120, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200", isOut: false },
  { id: 91, name: "Chicken Pokora (Full)", price: 220, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200", isOut: false },
  { id: 92, name: "Paneer Tikka", price: 200, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=200", isOut: false },

  // Chowmein & Rolls
  { id: 100, name: "Chicken Egg Chowmein", price: 130, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200", isOut: false },
  { id: 101, name: "Chicken Roll", price: 90, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1626777552726-4a6b54c97e46?w=200", isOut: false },

  // Fried Rice
  { id: 110, name: "Chicken Fried Rice", price: 160, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200", isOut: false },

  // Desserts
  { id: 120, name: "Gulab Jamun (2 pcs)", price: 50, cat: "Desserts", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200", isOut: false }
];

// AUTH OBSERVER
auth.onAuthStateChanged((user) => {
  if (user) {
    currentUser = user;
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('user-details-section').style.display = 'block';
    
    let uid = user.uid;
    let name = user.displayName || "";
    let photo = user.photoURL || "https://cdn-icons-png.flaticon.com/512/3135/3135715.png";
    let phone = user.phoneNumber || "";

    if (document.getElementById('display-name')) document.getElementById('display-name').innerText = name || phone || "Logged User";
    if (document.getElementById('user-avatar-img')) document.getElementById('user-avatar-img').src = photo;

    database.ref('users/' + uid).once('value', (snap) => {
      if(snap.val()) {
        const u = snap.val();
        if (document.getElementById('user-name-input')) document.getElementById('user-name-input').value = u.name || name;
        if (document.getElementById('user-address-input')) document.getElementById('user-address-input').value = u.address || "";
        if (document.getElementById('del-name')) document.getElementById('del-name').value = u.name || name;
        if (document.getElementById('del-address')) document.getElementById('del-address').value = u.address || "";
      }
    });

    renderOrders();
  } else {
    currentUser = null;
    document.getElementById('auth-section').style.display = 'block';
    document.getElementById('user-details-section').style.display = 'none';
    if (document.getElementById('display-name')) document.getElementById('display-name').innerText = "Guest User";
  }
});

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then(() => alert("Google Sign-In Successful!"));
}

function toggleAdminPassBox() {
  const box = document.getElementById('admin-pass-box');
  box.style.display = box.style.display === 'block' ? 'none' : 'block';
}

function loginAdmin() {
  const passInp = document.getElementById('admin-pass');
  if (passInp && passInp.value === 'K.d@12345') {
    document.getElementById('admin-panel').style.display = 'block';
    alert("Welcome Admin!");
    renderAdmin();
  } else {
    alert("Invalid Admin Password!");
  }
}

// EDIT ITEM MODAL FOR ADMIN
function openEditModal(id) {
  const item = menu.find(m => m.id === id);
  if(!item) return;
  document.getElementById('edit-item-id').value = item.id;
  document.getElementById('edit-item-name').value = item.name;
  document.getElementById('edit-item-price').value = item.price;
  document.getElementById('edit-item-cat').value = item.cat;
  document.getElementById('edit-item-modal').style.display = 'flex';
}

function closeEditModal() {
  document.getElementById('edit-item-modal').style.display = 'none';
}

function saveItemModification() {
  const id = parseInt(document.getElementById('edit-item-id').value);
  const name = document.getElementById('edit-item-name').value;
  const price = parseFloat(document.getElementById('edit-item-price').value);
  const cat = document.getElementById('edit-item-cat').value;
  const fileInput = document.getElementById('edit-item-file');

  const item = menu.find(m => m.id === id);
  if(item) {
    item.name = name;
    item.price = price;
    item.cat = cat;

    if (fileInput.files && fileInput.files[0]) {
      const reader = new FileReader();
      reader.onload = function(e) {
        item.img = e.target.result;
        finishItemSave();
      };
      reader.readAsDataURL(fileInput.files[0]);
    } else {
      finishItemSave();
    }
  }
}

function finishItemSave() {
  alert("Item updated successfully!");
  closeEditModal();
  renderMenu();
  renderAdmin();
}

function deleteOrderItem(orderId) {
  if(confirm("Are you sure you want to delete this order record?")) {
    database.ref('orders/' + orderId).remove().then(() => alert("Order Deleted!"));
  }
}

// PAYMENT ENGINE
function proceedToPayment() {
  if(!currentUser) return alert("Please Login first!");
  if (!isStoreOpen) return alert("Restaurant is currently CLOSED!");

  const name = document.getElementById('del-name').value;
  const address = document.getElementById('del-address').value;
  const payOption = document.querySelector('input[name="pay-option"]:checked').value;
  const instructions = document.getElementById('del-instruction').value;

  if (!name || !address) return alert("Please fill delivery details!");
  if (cart.length === 0) return alert("Cart is empty!");

  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const deliveryFee = subtotal >= 200 ? 0 : 30;
  const totalAmount = Math.max(0, subtotal + deliveryFee - discount);

  if (payOption === "UPI") {
    const upiUrl = `upi://pay?pa=${currentAdminUPI}&pn=KD_KA_KHANA_GHAR_TAK&am=${totalAmount}&cu=INR`;
    window.location.href = upiUrl;
  }

  placeOrderData(name, address, payOption, instructions, totalAmount);
}

function placeOrderData(name, address, payOption, instructions, totalAmount) {
  const orderId = "ORD" + Date.now().toString().slice(-5);
  const newOrder = {
    id: orderId,
    uid: currentUser.uid,
    name: name,
    address: address,
    phone: document.getElementById('del-phone').value || "N/A",
    instructions: instructions,
    pay: payOption,
    items: cart,
    total: totalAmount,
    status: "Pending",
    date: new Date().toLocaleString()
  };

  database.ref('orders/' + orderId).set(newOrder).then(() => {
    cart = [];
    updateCartCount();
    alert("Order Placed Successfully! Order ID: " + orderId);
    showPage('orders');
  });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  
  if(pageId === 'cart') renderCart();
  if(pageId === 'orders') renderOrders();
}

function renderCategories() {
  const categories = ["All", "Birthday Cakes", "Cold Drinks & Beverages", "Main Course", "Momos", "Breads & Naan", "Dal & Gravy", "Pasta", "Breakfast & Snacks", "Tea & Coffee", "Chowmein & Rolls", "Fried Rice", "Starters & Tandoor", "Desserts"];
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
  
  if (filtered.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px; color:#888;">No items currently in ${currentCat}. You can add items from Admin Panel!</p>`;
    return;
  }

  container.innerHTML = filtered.map(item => `
    <div class="food-card" onclick="openModal(${item.id})">
      <span class="wishlist-icon" onclick="event.stopPropagation(); toggleWishlist(${item.id})">${wishlist.includes(item.id) ? '❤️' : '🤍'}</span>
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price} ${item.isOut ? '<span style="color:red; font-size:0.7rem;">(Out of Stock)</span>' : ''}</div>
        <button class="btn-primary" ${item.isOut ? 'disabled style="background:#ccc;"' : ''} onclick="event.stopPropagation(); addToCart(${item.id})">ADD +</button>
      </div>
    </div>
  `).join('');
}

function addToCart(id) {
  const item = menu.find(m => m.id === id);
  if (!item || item.isOut) return;
  const exist = cart.find(c => c.id === id);
  if (exist) exist.qty++;
  else cart.push({ ...item, qty: 1 });
  updateCartCount();
}

function updateCartCount() {
  const countElem = document.getElementById('cart-count');
  if (countElem) countElem.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function renderAdmin() {
  database.ref('orders').on('value', (snap) => {
    const liveOrders = snap.val() ? Object.values(snap.val()) : [];
    const pendingOrders = liveOrders.filter(o => o.status === 'Pending');

    document.getElementById('stat-total').innerText = liveOrders.length;
    document.getElementById('stat-pending').innerText = pendingOrders.length;
    document.getElementById('stat-earning').innerText = liveOrders.filter(o => o.status === 'Delivered').reduce((s, o) => s + (o.total || 0), 0);

    const container = document.getElementById('admin-orders-list');
    container.innerHTML = liveOrders.map(o => {
      const isCancelled = o.status.includes('Cancelled');
      return `
      <div class="order-card">
        <b>ID: ${o.id}</b> | <b>User:</b> ${o.name} | <b>Phone:</b> ${o.phone || 'N/A'}<br>
        <b>Address:</b> ${o.address}<br>
        <b>Items:</b> ${(o.items || []).map(i => i.name + ' x' + i.qty).join(', ')}<br>
        <b>Total Bill:</b> ₹${o.total} (${o.pay})<br>
        Status: <b>${o.status}</b><br><br>
        
        ${isCancelled ? `<div class="cancelled-box">❌ ORDER CANCELLED</div>` : `
          <button class="btn-sec" style="background:#2ed573;" onclick="updateStatus('${o.id}', 'Accepted')">Accept</button>
          <button class="btn-sec" style="background:#00a8ff;" onclick="updateStatus('${o.id}', 'Out for Delivery')">Out for Delivery</button>
          <button class="btn-sec" style="background:#20bf6b;" onclick="updateStatus('${o.id}', 'Delivered')">Delivered</button>
          <button class="btn-sec" style="background:#ff4757;" onclick="updateStatus('${o.id}', 'CancelledByAdmin')">Reject</button>
        `}
        <button class="btn-sec" style="background:#333; margin-left:5px;" onclick="deleteOrderItem('${o.id}')">🗑️ Delete</button>
      </div>
    `}).reverse().join('');
  });

  const menuContainer = document.getElementById('admin-menu-list');
  menuContainer.innerHTML = menu.map(m => `
    <div class="admin-item-row">
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${m.img}" style="width:40px; height:40px; border-radius:4px; object-fit:cover;">
        <div><b>${m.name}</b><br><span style="color:#777;">₹${m.price} [${m.cat}]</span></div>
      </div>
      <div>
        <button onclick="openEditModal(${m.id})" style="background:#00a8ff; color:white; border:none; padding:4px 8px; border-radius:4px; margin-right:4px;">✏️ Edit</button>
        <button onclick="toggleStock(${m.id})" style="background:${m.isOut ? 'red' : 'green'}; color:white; border:none; padding:4px 8px; border-radius:4px;">${m.isOut ? 'In-Stock' : 'Out-Stock'}</button>
      </div>
    </div>
  `).join('');
}

function updateStatus(id, st) {
  database.ref('orders/' + id).update({ status: st });
}

function toggleStock(id) {
  const item = menu.find(m => m.id === id);
  if (item) {
    item.isOut = !item.isOut;
    renderMenu();
    renderAdmin();
  }
}

window.onload = function() {
  renderCategories();
  renderMenu();
};
