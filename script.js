// Firebase Configuration
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

// DEFAULT MENU DATA
const defaultMenu = [
  { id: 106, name: "Sprite / Coca-Cola (200ml)", price: 40, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200", isOut: false },
  { id: 107, name: "Fresh Cold Coffee", price: 70, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200", isOut: false },
  { id: 201, name: "Normal Cake (500gm)", price: 450, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200", isOut: false },
  { id: 202, name: "Customer Choice Cake (500gm)", price: 500, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200", isOut: false },
  { id: 203, name: "Offer Cake (1kg)", price: 850, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=200", isOut: false },
  { id: 204, name: "Offer Cake (2kg)", price: 1600, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=200", isOut: false },
  { id: 1, name: "Tandoori Roti", price: 15, cat: "Breads & Naan", img: "https://images.unsplash.com/photo-1626074353765-517a681e40be?w=200", isOut: false },
  { id: 10, name: "Dal Tadka", price: 120, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200", isOut: false },
  { id: 20, name: "Chicken Butter Masala (Full)", price: 380, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200", isOut: false },
  { id: 79, name: "Chicken Momo (Full)", price: 70, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200", isOut: false },
  { id: 90, name: "Chicken Pokora (Half)", price: 120, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200", isOut: false },
  { id: 100, name: "Chicken Egg Chowmein", price: 130, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200", isOut: false },
  { id: 110, name: "Chicken Fried Rice", price: 160, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200", isOut: false },
  { id: 120, name: "Gulab Jamun (2 pcs)", price: 50, cat: "Desserts", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200", isOut: false }
];

let savedMenu = JSON.parse(localStorage.getItem('kd_custom_menu'));
let menu = (savedMenu && savedMenu.length > 0) ? savedMenu : defaultMenu;

// Custom Toast Notification
function showToast(message, type = "success") {
  const container = document.getElementById('toast-container');
  if (!container) return;
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerText = message;
  container.appendChild(toast);
  setTimeout(() => { toast.remove(); }, 3000);
}

function syncStorage() {
  localStorage.setItem('kd_cart', JSON.stringify(cart));
  localStorage.setItem('kd_wishlist', JSON.stringify(wishlist));
  localStorage.setItem('kd_custom_menu', JSON.stringify(menu));
  updateCartCount();
  if (currentUser) {
    database.ref('users/' + currentUser.uid + '/wishlist').set(wishlist);
    database.ref('users/' + currentUser.uid + '/cart').set(cart);
  }
}

// RENDER CATEGORIES
function renderCategories() {
  const categories = ["All", "Birthday Cakes", "Cold Drinks & Beverages", "Main Course", "Momos", "Breads & Naan", "Dal & Gravy", "Starters & Tandoor", "Desserts"];
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

// RENDER MENU ITEMS
function renderMenu(customList = null) {
  const container = document.getElementById('menu-container');
  if (!container) return;

  let displayList = customList || (currentCat === "All" ? [...menu] : menu.filter(m => m.cat === currentCat));

  if (!displayList || displayList.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px; color:#888;">No dishes found in this category.</p>`;
    return;
  }

  container.innerHTML = displayList.map(item => `
    <div class="food-card ${item.isOut ? 'out-of-stock' : ''}" onclick="openModal(${item.id})">
      <span class="wishlist-icon" onclick="event.stopPropagation(); toggleWishlist(${item.id})">${wishlist.includes(item.id) ? '❤️' : '🤍'}</span>
      <img src="${item.img}" class="food-img" onerror="this.src='https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200'">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-add" onclick="event.stopPropagation(); addToCart(${item.id})">${item.isOut ? 'OUT' : 'Add'}</button>
      </div>
    </div>
  `).join('');
}

// PRODUCT MODAL
function openModal(id) {
  const item = menu.find(m => m.id === id);
  if (!item) return;
  selectedModalItem = item;

  document.getElementById('modal-img').src = item.img;
  document.getElementById('modal-title').innerText = item.name + (item.isOut ? " (Out of Stock)" : "");
  document.getElementById('modal-price').innerText = "₹" + item.price;

  const heart = document.getElementById('modal-wishlist-heart');
  if (heart) {
    heart.className = wishlist.includes(item.id) ? "fas fa-heart" : "far fa-heart";
    heart.style.color = wishlist.includes(item.id) ? "#ff3f6c" : "#888";
  }

  const sugContainer = document.getElementById('modal-suggestions');
  if (sugContainer) {
    const suggestions = menu.filter(m => m.id !== item.id).slice(0, 5);
    sugContainer.innerHTML = suggestions.map(s => `
      <div style="min-width:110px; border:1px solid #eee; border-radius:8px; padding:6px; text-align:center; background:#fff;">
        <img src="${s.img}" style="width:100%; height:60px; object-fit:cover; border-radius:6px;">
        <div style="font-size:0.75rem; font-weight:bold; height:28px; overflow:hidden; margin-top:4px;">${s.name}</div>
        <div style="font-size:0.75rem; color:green; font-weight:bold;">₹${s.price}</div>
        <button class="btn-sec" style="font-size:0.7rem; padding:3px 8px; margin-top:4px; background:#2ed573;" onclick="addToCart(${s.id})">+ Add</button>
      </div>
    `).join('');
  }

  document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('product-modal').style.display = 'none';
}

function toggleModalWishlist() {
  if (selectedModalItem) {
    toggleWishlist(selectedModalItem.id);
    const heart = document.getElementById('modal-wishlist-heart');
    if (heart) {
      heart.className = wishlist.includes(selectedModalItem.id) ? "fas fa-heart" : "far fa-heart";
      heart.style.color = wishlist.includes(selectedModalItem.id) ? "#ff3f6c" : "#888";
    }
  }
}

function addToCartFromModal() {
  if (selectedModalItem) addToCart(selectedModalItem.id);
  closeModal();
}

function buyNowFromModal() {
  if (selectedModalItem) {
    const item = menu.find(m => m.id === selectedModalItem.id);
    if (item && !item.isOut) {
      const exist = cart.find(c => c.id === item.id);
      if (exist) exist.qty++;
      else cart.push({ ...item, qty: 1 });
      syncStorage();
    }
  }
  closeModal();
  showPage('cart');
}

// RESTAURANT OWNER AUTH
function toggleOwnerAuthSection() {
  const box = document.getElementById('owner-auth-box');
  if (box) box.style.display = box.style.display === 'none' ? 'block' : 'none';
}

function loginAdmin() {
  const passInp = document.getElementById('admin-pass');
  if (passInp && passInp.value.trim() === 'K.d@12345') {
    document.getElementById('admin-panel').style.display = 'block';
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('owner-auth-box').style.display = 'none';
    document.getElementById('user-details-section').style.display = 'none';
    showToast("Welcome Restaurant Owner! 👑");
    renderAdminOrders();
    renderAdminMenuEditor();
  } else {
    showToast("Galat Secret Password!", "error");
  }
}

function logoutAdmin() {
  document.getElementById('admin-panel').style.display = 'none';
  if (currentUser) {
    document.getElementById('user-details-section').style.display = 'block';
  } else {
    document.getElementById('auth-section').style.display = 'block';
  }
  showToast("Logged out from Admin Dashboard");
}

// ADMIN MENU EDITOR
function renderAdminMenuEditor() {
  const container = document.getElementById('admin-menu-edit-list');
  if (!container) return;

  container.innerHTML = menu.map(item => `
    <div style="display:flex; justify-content:space-between; align-items:center; background:#fff; padding:8px 10px; margin-bottom:8px; border-radius:6px; border:1px solid #ddd;">
      <div style="display:flex; align-items:center; gap:10px;">
        <img src="${item.img}" style="width:40px; height:40px; object-fit:cover; border-radius:4px;">
        <div>
          <b>${item.name}</b><br>
          <span style="color:green; font-weight:bold;">₹${item.price}</span>
        </div>
      </div>
      <div style="display:flex; gap:5px;">
        <button class="btn-sec" style="background:#f39c12; padding:4px 8px; font-size:0.75rem;" onclick="openEditDishModal(${item.id})">✏️ Edit</button>
        <button class="btn-sec" style="background:${item.isOut ? '#2ed573' : '#ff9f00'}; padding:4px 8px; font-size:0.75rem;" onclick="toggleStockStatus(${item.id})">${item.isOut ? 'In Stock' : 'Mark Out'}</button>
        <button class="btn-sec" style="background:#dc3545; padding:4px 8px; font-size:0.75rem;" onclick="adminDeleteDish(${item.id})">Delete</button>
      </div>
    </div>
  `).join('');
}

function openEditDishModal(id) {
  const item = menu.find(m => m.id === id);
  if (!item) return;

  document.getElementById('edit-dish-id').value = item.id;
  document.getElementById('edit-dish-name').value = item.name;
  document.getElementById('edit-dish-price').value = item.price;
  document.getElementById('edit-dish-img').value = item.img;
  document.getElementById('edit-dish-modal').style.display = 'flex';
}

function closeEditDishModal() {
  document.getElementById('edit-dish-modal').style.display = 'none';
}

function saveEditedDish() {
  const id = parseInt(document.getElementById('edit-dish-id').value);
  const name = document.getElementById('edit-dish-name').value;
  const price = parseInt(document.getElementById('edit-dish-price').value);
  const imgUrl = document.getElementById('edit-dish-img').value;
  const fileInp = document.getElementById('edit-dish-file');

  const itemIndex = menu.findIndex(m => m.id === id);
  if (itemIndex > -1) {
    menu[itemIndex].name = name;
    menu[itemIndex].price = price;

    if (fileInp.files && fileInp.files[0]) {
      const reader = new FileReader();
      reader.onload = function (e) {
        menu[itemIndex].img = e.target.result;
        syncStorage(); renderMenu(); renderAdminMenuEditor();
        closeEditDishModal();
        showToast("Dish Updated Successfully!");
      };
      reader.readAsDataURL(fileInp.files[0]);
    } else {
      if (imgUrl) menu[itemIndex].img = imgUrl;
      syncStorage(); renderMenu(); renderAdminMenuEditor();
      closeEditDishModal();
      showToast("Dish Updated Successfully!");
    }
  }
}

function toggleStockStatus(id) {
  const item = menu.find(m => m.id === id);
  if (item) {
    item.isOut = !item.isOut;
    syncStorage(); renderMenu(); renderAdminMenuEditor();
    showToast(`Status updated for ${item.name}`);
  }
}

function adminDeleteDish(id) {
  if (confirm("Delete this dish permanently?")) {
    menu = menu.filter(m => m.id !== id);
    syncStorage(); renderMenu(); renderAdminMenuEditor();
    showToast("Dish deleted!");
  }
}

function adminAddItem() {
  const name = document.getElementById('add-item-name').value;
  const price = parseInt(document.getElementById('add-item-price').value);
  const cat = document.getElementById('add-item-cat').value;
  const urlInp = document.getElementById('add-item-url').value;
  const fileInp = document.getElementById('item-file-input');

  if (!name || !price) return showToast("Enter Name and Price!", "error");

  const newId = Date.now();
  let defaultImg = urlInp || "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=200";

  if (fileInp.files && fileInp.files[0]) {
    const reader = new FileReader();
    reader.onload = function (e) {
      menu.push({ id: newId, name, price, cat, img: e.target.result, isOut: false });
      syncStorage(); renderMenu(); renderAdminMenuEditor();
      showToast("New Item Added!");
    };
    reader.readAsDataURL(fileInp.files[0]);
  } else {
    menu.push({ id: newId, name, price, cat, img: defaultImg, isOut: false });
    syncStorage(); renderMenu(); renderAdminMenuEditor();
    showToast("New Item Added!");
  }
}

// RENDER ORDERS WITH LIVE TIMELINE
function renderOrders() {
  const container = document.getElementById('my-orders-list');
  if (!container) return;
  const activePhone = (currentUser && currentUser.phone) || localStorage.getItem('kd_user_phone');
  const activeUid = (currentUser && currentUser.uid) || localStorage.getItem('kd_user_uid');

  database.ref('orders').on('value', (snapshot) => {
    const data = snapshot.val();
    let myOrders = data ? Object.values(data).filter(o => o.uid === activeUid || o.phone === activePhone) : [];

    if (myOrders.length === 0) {
      container.innerHTML = "<p style='text-align:center; padding:20px; color:#888;'>No orders placed yet.</p>";
      return;
    }

    container.innerHTML = myOrders.map(o => {
      let itemsSummary = (o.items || []).map(i => `${i.name} x${i.qty}`).join(', ');

      let step1 = o.status === 'Pending' || o.status === 'Accepted' || o.status === 'Out for Delivery' || o.status === 'Delivered';
      let step2 = o.status === 'Accepted' || o.status === 'Out for Delivery' || o.status === 'Delivered';
      let step3 = o.status === 'Out for Delivery' || o.status === 'Delivered';
      let step4 = o.status === 'Delivered';

      return `
        <div class="order-card">
          <div style="display:flex; justify-content:space-between; align-items:center;">
            <b>Order ID: ${o.id}</b>
            <span style="font-size:0.8rem; background:#e0f7fa; color:#006064; padding:3px 8px; border-radius:12px; font-weight:bold;">${o.status}</span>
          </div>
          <small style="color:#777;">${o.date}</small><br>
          <div style="margin-top:4px;"><b>Customer:</b> ${o.name} | <b>Phone:</b> ${o.phone}</div>
          <div><b>Address:</b> ${o.address}</div>
          <div style="margin-top:2px;"><b>Items:</b> ${itemsSummary}</div>
          <div style="margin-top:4px; font-weight:bold; color:var(--accent-red);">Total: ₹${o.total} (${o.pay})</div>

          <div class="timeline-container">
            <div class="timeline-item ${step1 ? 'active' : ''}">
              <div class="timeline-dot"></div>
              <div class="timeline-title">Order Confirmed</div>
              <div class="timeline-desc">Your Order has been placed successfully.</div>
            </div>
            <div class="timeline-item ${step2 ? 'active' : ''}">
              <div class="timeline-dot"></div>
              <div class="timeline-title">Order Processed</div>
              <div class="timeline-desc">Seller/Restaurant has processed your order.</div>
            </div>
            <div class="timeline-item ${step3 ? 'active' : ''}">
              <div class="timeline-dot"></div>
              <div class="timeline-title">Out For Delivery</div>
              <div class="timeline-desc">Your item is out for delivery with partner.</div>
            </div>
            <div class="timeline-item ${step4 ? 'active' : ''}">
              <div class="timeline-dot"></div>
              <div class="timeline-title">Delivered</div>
              <div class="timeline-desc">Your item has been delivered. Enjoy your meal!</div>
            </div>
          </div>

          ${o.status === 'Pending' ? `<button class="btn-sec" style="background:red; margin-top:10px;" onclick="cancelMyOrder('${o.id}')">Cancel Order</button>` : ''}
        </div>
      `;
    }).reverse().join('');
  });
}

function renderAdminOrders() {
  const container = document.getElementById('admin-orders-list');
  if (!container) return;

  database.ref('orders').on('value', (snapshot) => {
    const data = snapshot.val();
    let orders = data ? Object.values(data) : [];

    document.getElementById('stat-total').innerText = orders.length;
    document.getElementById('stat-pending').innerText = orders.filter(o => o.status === 'Pending').length;
    document.getElementById('stat-earning').innerText = orders.filter(o => o.status === 'Delivered').reduce((s, o) => s + o.total, 0);

    if (orders.length === 0) {
      container.innerHTML = "<p style='text-align:center;'>No orders received yet.</p>";
      return;
    }

    container.innerHTML = orders.map(o => `
      <div class="order-card" style="border-left:4px solid #00a8ff;">
        <div style="display:flex; justify-content:space-between;">
          <b>ID: ${o.id}</b>
          <b style="color:orange;">${o.status}</b>
        </div>
        <small>${o.date}</small>
        <div><b>Customer:</b> ${o.name} (${o.phone})</div>
        <div><b>Address:</b> ${o.address}</div>
        <div><b>Items:</b> ${(o.items || []).map(i => i.name + ' x' + i.qty).join(', ')}</div>
        <div><b>Total:</b> ₹${o.total} (${o.pay})</div>

        <div style="display:flex; gap:5px; margin-top:8px; flex-wrap:wrap;">
          <button class="btn-sec" style="background:#2ed573;" onclick="updateOrderStatus('${o.id}', 'Accepted')">Accept</button>
          <button class="btn-sec" style="background:#ff9f00;" onclick="updateOrderStatus('${o.id}', 'Out for Delivery')">Out for Delivery</button>
          <button class="btn-sec" style="background:#00a8ff;" onclick="updateOrderStatus('${o.id}', 'Delivered')">Delivered</button>
          <button class="btn-sec" style="background:#dc3545;" onclick="updateOrderStatus('${o.id}', 'Cancelled')">Cancel</button>
        </div>
      </div>
    `).reverse().join('');
  });
}

function updateOrderStatus(id, status) {
  database.ref('orders/' + id).update({ status });
  showToast(`Order status set to ${status}`);
}

function clearAllOrders() {
  if (confirm("Delete all orders from system?")) {
    database.ref('orders').remove();
    showToast("All orders cleared!");
  }
}

// USER SESSION MANAGEMENT
function loadUserSession(uid, phone, name, photo, address, dbWish, dbCart) {
  currentUser = { uid, phone, name, address };
  if (dbWish) wishlist = dbWish;
  if (dbCart) cart = dbCart;
  syncStorage();

  document.getElementById('auth-section').style.display = 'none';
  document.getElem