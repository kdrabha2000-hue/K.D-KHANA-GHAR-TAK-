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

let menu = [
  { id: 106, name: "Sprite / Coca-Cola (200ml)", price: 40, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200", isOut: false },
  { id: 107, name: "Fresh Cold Coffee", price: 70, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200", isOut: false },
  { id: 201, name: "Normal Cake (500gm)", price: 450, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200", isOut: false },
  { id: 202, name: "Customer Choice Cake (500gm)", price: 500, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200", isOut: false },
  { id: 203, name: "Offer Cake (1kg)", price: 850, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=200", isOut: false },
  { id: 204, name: "Offer Cake (2kg)", price: 1600, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=200", isOut: false },
  { id: 1, name: "Tandoori Roti", price: 15, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200", isOut: false },
  { id: 2, name: "Butter Roti", price: 20, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200", isOut: false },
  { id: 3, name: "Plain Naan", price: 40, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=200", isOut: false },
  { id: 10, name: "Dal Tadka", price: 120, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200", isOut: false },
  { id: 20, name: "Chicken Butter Masala (Full)", price: 380, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200", isOut: false },
  { id: 79, name: "Chicken Momo (Full)", price: 70, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200", isOut: false },
  { id: 90, name: "Chicken Pokora (Half)", price: 120, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200", isOut: false },
  { id: 100, name: "Chicken Egg Chowmein", price: 130, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200", isOut: false },
  { id: 110, name: "Chicken Fried Rice", price: 160, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200", isOut: false },
  { id: 120, name: "Gulab Jamun (2 pcs)", price: 50, cat: "Desserts", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200", isOut: false }
];

// USER SESSION LOAD (FIXED REALTIME UPDATE)
function loadUserSession(uid, phone, name, photo, address) {
  currentUser = { uid, phone, name };
  localStorage.setItem('kd_user_phone', phone);
  localStorage.setItem('kd_user_uid', uid);

  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('user-details-section').style.display = 'block';

  document.getElementById('display-name').innerText = name || "Hi Customer";
  document.getElementById('display-phone').innerText = "+91-" + phone;
  document.getElementById('user-phone-input').value = phone;
  document.getElementById('user-name-input').value = name || "";
  document.getElementById('user-address-input').value = address || "";
  document.getElementById('saved-addr-text').innerText = address || "No Address Saved";
  if (photo) document.getElementById('user-avatar-img').src = photo;

  document.getElementById('del-name').value = name || "";
  document.getElementById('del-address').value = address || "";
  document.getElementById('del-phone').value = phone || "";

  renderOrders();
}

auth.onAuthStateChanged((user) => {
  if (user) {
    let uid = user.uid;
    database.ref('users/' + uid).once('value', (snap) => {
      const u = snap.val() || {};
      loadUserSession(uid, u.phone || user.phoneNumber || "8453270362", u.name || user.displayName || "Hi Customer", u.photo || user.photoURL, u.address || "");
    });
  } else {
    const savedPhone = localStorage.getItem('kd_user_phone');
    const savedUid = localStorage.getItem('kd_user_uid');
    if (savedPhone && savedUid) {
      database.ref('users/' + savedUid).once('value', (snap) => {
        const u = snap.val() || {};
        loadUserSession(savedUid, u.phone || savedPhone, u.name || "Customer " + savedPhone.slice(-4), u.photo, u.address || "");
      });
    }
  }
});

function googleLogin() {
  const provider = new firebase.auth.GoogleAuthProvider();
  auth.signInWithPopup(provider).then((result) => {
    const user = result.user;
    database.ref('users/' + user.uid).update({
      name: user.displayName,
      email: user.email,
      phone: "8453270362"
    });
  }).catch(e => alert(e.message));
}

function loginWithPhoneDirect() {
  const phone = document.getElementById('auth-phone').value;
  if (!phone || phone.length < 10) return alert("Please enter a valid 10-digit phone number!");

  const customUid = "user_" + phone;
  database.ref('users/' + customUid).update({
    phone: phone,
    name: "Customer " + phone.slice(-4),
    joined: new Date().toLocaleString()
  }).then(() => {
    loadUserSession(customUid, phone, "Customer " + phone.slice(-4), null, "");
    alert("Phone Login Successful!");
  });
}

function uploadProfileCameraPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('user-avatar-img').src = e.target.result;
      if (currentUser) {
        database.ref('users/' + currentUser.uid).update({ photo: e.target.result });
      }
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function saveProfile() {
  if(!currentUser) return alert("Please Login first!");
  const name = document.getElementById('user-name-input').value;
  const address = document.getElementById('user-address-input').value;
  const phone = document.getElementById('user-phone-input').value;

  if (!phone || phone.length < 10) {
    return alert("Phone number cannot be left blank! Please enter a valid 10-digit number.");
  }

  database.ref('users/' + currentUser.uid).update({ name, address, phone })
    .then(() => {
      loadUserSession(currentUser.uid, phone, name, document.getElementById('user-avatar-img').src, address);
      alert("Profile Saved Successfully!");
    });
}

function customerLogout() {
  localStorage.clear();
  auth.signOut().then(() => location.reload());
}

function deleteAccount() {
  if(!currentUser) return alert("Please login first!");
  const reason = prompt("Enter reason for deleting account:");
  if(reason) {
    database.ref('deleted_accounts/' + currentUser.uid).set({ uid: currentUser.uid, reason, date: new Date().toLocaleString() })
      .then(() => {
        database.ref('users/' + currentUser.uid).remove();
        customerLogout();
      });
  }
}

// WISHLIST FUNCTIONALITY (FIXED)
function toggleWishlist(id) {
  if (wishlist.includes(id)) {
    wishlist = wishlist.filter(x => x !== id);
  } else {
    wishlist.push(id);
  }
  renderMenu();
  renderWishlist();
}

function renderWishlist() {
  const container = document.getElementById('wishlist-container');
  if (!container) return;
  const wishlistItems = menu.filter(m => wishlist.includes(m.id));

  if (wishlistItems.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px; color:#888;">Your Wishlist is empty. Tap ❤️ on items to add them here!</p>`;
    return;
  }

  container.innerHTML = wishlistItems.map(item => `
    <div class="food-card" onclick="openModal(${item.id})">
      <span class="wishlist-icon" onclick="event.stopPropagation(); toggleWishlist(${item.id})">❤️</span>
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-primary" onclick="event.stopPropagation(); addToCart(${item.id})">ADD +</button>
      </div>
    </div>
  `).join('');
}

// ORDERS TRACKING REALTIME (FIXED)
function renderOrders() {
  const container = document.getElementById('my-orders-list');
  if(!container) return;

  if(!currentUser) {
    container.innerHTML = "<p style='text-align:center; padding:20px; color:#888;'>Please login in Account tab to see order history & live tracking.</p>";
    return;
  }
  
  database.ref('orders').on('value', (snapshot) => {
    const data = snapshot.val();
    let myOrders = data ? Object.values(data).filter(o => o.uid === currentUser.uid || o.phone === currentUser.phone) : [];

    if (myOrders.length === 0) {
      container.innerHTML = "<p style='text-align:center; padding:20px; color:#888;'>No orders placed yet.</p>";
      return;
    }

    container.innerHTML = myOrders.map(o => {
      const statuses = ["Pending", "Accepted", "Out for Delivery", "Delivered"];
      const currentIdx = statuses.indexOf(o.status);

      return `
      <div class="order-card">
        <div><b>Order ID:</b> ${o.id} | <b>Date:</b> ${o.date}</div>
        <div><b>Items:</b> ${(o.items || []).map(i => i.name + ' x' + i.qty).join(', ')}</div>
        <div><b>Total:</b> ₹${o.total} (${o.pay})</div>
        
        <div class="timeline">
          <div class="timeline-step ${currentIdx >= 0 ? 'completed' : ''}"><div class="timeline-title">Order Placed</div></div>
          <div class="timeline-step ${currentIdx >= 1 ? 'completed' : ''}"><div class="timeline-title">Accepted / Cooking</div></div>
          <div class="timeline-step ${currentIdx >= 2 ? 'completed' : ''}"><div class="timeline-title">Out for Delivery</div></div>
          <div class="timeline-step ${currentIdx >= 3 ? 'completed' : ''}"><div class="timeline-title">Delivered</div></div>
        </div>

        ${o.status === 'Pending' ? `<button class="btn-sec" style="background:red;" onclick="cancelMyOrder('${o.id}')">Cancel Order</button>` : '🔒 Order Status Locked'}
      </div>
    `}).reverse().join('');
  });
}

function cancelMyOrder(id) {
  if(confirm("Cancel order?")) database.ref('orders/' + id).update({ status: 'CancelledByCustomer' });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  document.getElementById(pageId).classList.add('active');
  
  if(pageId === 'cart') renderCart();
  if(pageId === 'orders') renderOrders();
  if(pageId === 'wishlist') renderWishlist();
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

window.onload = function() {
  renderCategories();
  renderMenu();
};
