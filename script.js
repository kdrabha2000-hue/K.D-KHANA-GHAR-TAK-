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
let cart = JSON.parse(localStorage.getItem('kd_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('kd_wishlist')) || [];
let userCoins = parseInt(localStorage.getItem('kd_coins')) || 14;
let currentCat = "All";
let isStoreOpen = true;
let currentAdminUPI = "6000026478@okbizaxis";

let menu = [
  { id: 106, name: "Sprite / Coca-Cola (200ml)", price: 40, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200", isOut: false },
  { id: 107, name: "Fresh Cold Coffee", price: 70, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200", isOut: false },
  { id: 201, name: "Normal Cake (500gm)", price: 450, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200", isOut: false },
  { id: 202, name: "Customer Choice Cake (500gm)", price: 500, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200", isOut: false },
  { id: 1, name: "Tandoori Roti", price: 15, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200", isOut: false },
  { id: 10, name: "Dal Tadka", price: 120, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200", isOut: false },
  { id: 20, name: "Chicken Butter Masala (Full)", price: 380, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200", isOut: false },
  { id: 79, name: "Chicken Momo (Full)", price: 70, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200", isOut: false }
];

function loadUserSession(uid, phone, name, photo, address, dbWish) {
  currentUser = { uid, phone, name, address };
  if(dbWish) { wishlist = dbWish; syncStorage(); }
  localStorage.setItem('kd_user_phone', phone);
  localStorage.setItem('kd_user_uid', uid);

  document.getElementById('auth-section').style.display = 'none';
  document.getElementById('user-details-section').style.display = 'block';

  document.getElementById('display-name').innerText = name || "Customer Name";
  document.getElementById('display-phone').innerText = "+91-" + phone;
  document.getElementById('user-phone-input').value = phone;
  document.getElementById('user-name-input').value = name || "";
  document.getElementById('user-address-input').value = address || "";
  document.getElementById('saved-addr-text').innerText = address || "No Address Saved";
  if (photo) document.getElementById('user-avatar-img').src = photo;

  renderOrders(); renderMenu(); renderWishlist();
}

auth.onAuthStateChanged((user) => {
  if (user) {
    database.ref('users/' + user.uid).once('value', (snap) => {
      const u = snap.val() || {};
      loadUserSession(user.uid, u.phone || user.phoneNumber || "8453270362", u.name || "Hi Customer", u.photo, u.address || "", u.wishlist);
    });
  } else {
    const savedPhone = localStorage.getItem('kd_user_phone') || "8453270362";
    const savedUid = localStorage.getItem('kd_user_uid') || "user_8453270362";
    database.ref('users/' + savedUid).once('value', (snap) => {
      const u = snap.val() || {};
      loadUserSession(savedUid, u.phone || savedPhone, u.name || "Hi Customer", u.photo, u.address || "", u.wishlist);
    });
  }
});

function saveProfile() {
  if(!currentUser) return alert("Please Login first!");
  const name = document.getElementById('user-name-input').value;
  const address = document.getElementById('user-address-input').value;
  const phone = document.getElementById('user-phone-input').value;

  if (!phone || phone.length < 10) return alert("Valid phone number required!");

  database.ref('users/' + currentUser.uid).update({ name, address, phone }).then(() => {
    loadUserSession(currentUser.uid, phone, name, document.getElementById('user-avatar-img').src, address, wishlist);
    alert("Profile Saved Successfully!");
  });
}

function renderOrders() {
  const container = document.getElementById('my-orders-list');
  if(!container) return;
  const activePhone = (currentUser && currentUser.phone) || localStorage.getItem('kd_user_phone');
  const activeUid = (currentUser && currentUser.uid) || localStorage.getItem('kd_user_uid');

  database.ref('orders').on('value', (snapshot) => {
    const data = snapshot.val();
    let myOrders = data ? Object.values(data).filter(o => o.uid === activeUid || o.phone === activePhone) : [];
    
    if (myOrders.length === 0) {
      container.innerHTML = "<p style='text-align:center;'>No orders placed yet.</p>";
      return;
    }

    container.innerHTML = myOrders.map(o => {
      let step1 = o.status === 'Pending' || o.status === 'Accepted' || o.status === 'Out for Delivery' || o.status === 'Delivered' ? 'active' : '';
      let step2 = o.status === 'Accepted' || o.status === 'Out for Delivery' || o.status === 'Delivered' ? 'active' : '';
      let step3 = o.status === 'Out for Delivery' || o.status === 'Delivered' ? 'active' : '';
      let step4 = o.status === 'Delivered' ? 'active' : '';

      return `
        <div class="order-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <b>Order ID: ${o.id}</b>
            <span style="font-size:0.8rem; background:#e0f7fa; color:#006064; padding:3px 8px; border-radius:12px; font-weight:bold;">${o.status}</span>
          </div>
          <small style="color:#777;">${o.date}</small><br>
          <div style="margin-top:6px;"><b>Total:</b> ₹${o.total} (${o.pay})</div>

          <div class="tracking-container">
            <div class="tracking-steps">
              <div class="tracking-step ${step1}">
                <div class="step-icon"><i class="fas fa-check"></i></div>Placed
              </div>
              <div class="tracking-step ${step2}">
                <div class="step-icon"><i class="fas fa-utensils"></i></div>Accepted
              </div>
              <div class="tracking-step ${step3}">
                <div class="step-icon"><i class="fas fa-motorcycle"></i></div>On The Way
              </div>
              <div class="tracking-step ${step4}">
                <div class="step-icon"><i class="fas fa-home"></i></div>Delivered
              </div>
            </div>
          </div>

          ${o.status === 'Pending' ? `<button class="btn-sec" style="background:red;" onclick="cancelMyOrder('${o.id}')">Cancel Order</button>` : ''}
        </div>
      `;
    }).reverse().join('');
  });
}

function renderCategories() {
  const categories = ["All", "Birthday Cakes", "Cold Drinks & Beverages", "Main Course", "Momos", "Breads & Naan", "Dal & Gravy"];
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
  let displayList = currentCat === "All" ? [...menu] : menu.filter(m => m.cat === currentCat);

  container.innerHTML = displayList.map(item => `
    <div class="food-card ${item.isOut ? 'out-of-stock' : ''}" onclick="openModal(${item.id})">
      <span class="wishlist-icon" onclick="event.stopPropagation(); toggleWishlist(${item.id})">${wishlist.includes(item.id) ? '❤️' : '🤍'}</span>
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-add" onclick="event.stopPropagation(); addToCart(${item.id})">${item.isOut ? 'OUT' : 'Add'}</button>
      </div>
    </div>
  `).join('');
}

function syncStorage() {
  localStorage.setItem('kd_cart', JSON.stringify(cart));
  localStorage.setItem('kd_wishlist', JSON.stringify(wishlist));
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (document.getElementById(pageId)) document.getElementById(pageId).classList.add('active');
  if(pageId === 'orders') renderOrders();
}

function customerLogout() { localStorage.clear(); auth.signOut().then(() => location.reload()); }

window.onload = function() {
  renderCategories();
  renderMenu();
};
