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
let cart = JSON.parse(localStorage.getItem('kd_cart')) || [];
let wishlist = JSON.parse(localStorage.getItem('kd_wishlist')) || [];
let currentCat = "All";
let currentAdminUPI = "6000026478@okbizaxis";
let isSearching = false;

let menu = [
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

// OWNER LOGIN FUNCTION (SECURED)
function loginAdmin() {
  const passInp = document.getElementById('admin-pass');
  if (passInp && passInp.value.trim() === 'K.d@12345') {
    document.getElementById('auth-section').style.display = 'none';
    document.getElementById('admin-panel').style.display = 'block';
    alert("Welcome Restaurant Owner!");
    renderAdminOrders();
  } else {
    alert("Galat Password!");
  }
}

function renderAdminOrders() {
  database.ref('orders').on('value', (snap) => {
    const liveOrders = snap.val() ? Object.values(snap.val()) : [];
    const pendingOrders = liveOrders.filter(o => o.status === 'Pending');

    if (document.getElementById('stat-total')) document.getElementById('stat-total').innerText = liveOrders.length;
    if (document.getElementById('stat-pending')) document.getElementById('stat-pending').innerText = pendingOrders.length;
    if (document.getElementById('stat-earning')) document.getElementById('stat-earning').innerText = liveOrders.filter(o => o.status === 'Delivered').reduce((s, o) => s + (o.total || 0), 0);

    const container = document.getElementById('admin-orders-list');
    if (container) {
      container.innerHTML = liveOrders.map(o => `
        <div class="order-card">
          <b>ID: ${o.id}</b> | <b>User:</b> ${o.name} | <b>Phone:</b> ${o.phone}<br>
          <b>Address:</b> ${o.address}<br>
          <b>Total:</b> ₹${o.total} (${o.pay}) | Status: <b>${o.status}</b><br><br>
          <button class="btn-sec" style="background:#2ed573;" onclick="updateStatus('${o.id}', 'Accepted')">Accept</button>
          <button class="btn-sec" style="background:#00a8ff;" onclick="updateStatus('${o.id}', 'Out for Delivery')">Out for Delivery</button>
          <button class="btn-sec" style="background:#20bf6b;" onclick="updateStatus('${o.id}', 'Delivered')">Delivered</button>
          <button class="btn-sec" style="background:#ff4757;" onclick="updateStatus('${o.id}', 'CancelledByAdmin')">Reject</button>
        </div>
      `).reverse().join('');
    }
  });
}

function updateStatus(id, st) {
  database.ref('orders/' + id).update({ status: st });
}

function syncStorage() {
  localStorage.setItem('kd_cart', JSON.stringify(cart));
  localStorage.setItem('kd_wishlist', JSON.stringify(wishlist));
  if(currentUser) {
    database.ref('users/' + currentUser.uid + '/wishlist').set(wishlist);
  }
}

const topNotices = [
  "🚀 Welcome to K.D Restaurant! <br> 🥤 Get refreshing Cold Drinks with your meals!",
  "⚡ Superfast Express Delivery in Udalguri area!",
  "🎉 Order Fresh Birthday Cakes at Special Discount Prices!"
];
let noticeIdx = 0;
function startTopNoticeRotation() {
  setInterval(() => {
    const el = document.getElementById('top-announcement');
    if (!el) return;
    el.style.opacity = 0;
    setTimeout(() => {
      noticeIdx = (noticeIdx + 1) % topNotices.length;
      el.innerHTML = topNotices[noticeIdx];
      el.style.opacity = 1;
    }, 500);
  }, 6000);
}

const specialOffers = [
  "🔥 TODAY'S SPECIAL: Chicken Butter Masala @ ₹380",
  "🍗 SPECIAL OFFER: Chicken Pokora (Half) @ ₹120",
  "🎂 FRESH CAKE OFFER: Normal Cake (500gm) @ ₹450"
];
let bannerIdx = 0;
function startOfferBannerRotation() {
  setInterval(() => {
    const el = document.getElementById('home-banner');
    if (!el) return;
    el.style.opacity = 0;
    setTimeout(() => {
      bannerIdx = (bannerIdx + 1) % specialOffers.length;
      el.innerText = specialOffers[bannerIdx];
      el.style.opacity = 1;
    }, 500);
  }, 7000);
}

function startMenuRotation() {
  setInterval(() => {
    if (!isSearching) renderMenu();
  }, 8000);
}

function filterMenu() {
  const query = document.getElementById('search-input').value.toLowerCase().trim();
  if (query.length > 0) {
    isSearching = true;
    const filtered = menu.filter(m => m.name.toLowerCase().includes(query));
    renderMenu(filtered);
  } else {
    isSearching = false;
    renderMenu();
  }
}

function loadUserSession(uid, phone, name, photo, address, dbWish) {
  currentUser = { uid, phone, name };
  if(dbWish) { wishlist = dbWish; syncStorage(); }
  localStorage.setItem('kd_user_phone', phone);
  localStorage.setItem('kd_user_uid', uid);

  if (document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
  if (document.getElementById('user-details-section')) document.getElementById('user-details-section').style.display = 'block';

  if (document.getElementById('display-name')) document.getElementById('display-name').innerText = name || "Hi Customer";
  if (document.getElementById('display-phone')) document.getElementById('display-phone').innerText = "+91-" + phone;
  if (document.getElementById('user-phone-input')) document.getElementById('user-phone-input').value = phone;
  if (document.getElementById('user-name-input')) document.getElementById('user-name-input').value = name || "";
  if (document.getElementById('user-address-input')) document.getElementById('user-address-input').value = address || "";
  if (document.getElementById('saved-addr-text')) document.getElementById('saved-addr-text').innerText = address || "No Address Saved";
  if (photo && document.getElementById('user-avatar-img')) document.getElementById('user-avatar-img').src = photo;

  renderOrders(); renderMenu(); renderWishlist();
}

auth.onAuthStateChanged((user) => {
  if (user) {
    database.ref('users/' + user.uid).once('value', (snap) => {
      const u = snap.val() || {};
      loadUserSession(user.uid, u.phone || user.phoneNumber || "8453270362", u.name || user.displayName || "Hi Customer", u.photo || user.photoURL, u.address || "", u.wishlist);
    });
  } else {
    const savedPhone = localStorage.getItem('kd_user_phone');
    const savedUid = localStorage.getItem('kd_user_uid');
    if (savedPhone && savedUid) {
      database.ref('users/' + savedUid).once('value', (snap) => {
        const u = snap.val() || {};
        loadUserSession(savedUid, u.phone || savedPhone, u.name || "Customer " + savedPhone.slice(-4), u.photo, u.address || "", u.wishlist);
      });
    }
  }
});

function loginWithPhoneDirect() {
  const phone = document.getElementById('auth-phone').value;
  if (!phone || phone.length < 10) return alert("Please enter valid 10-digit number!");
  const customUid = "user_" + phone;
  database.ref('users/' + customUid).update({
    phone: phone, name: "Customer " + phone.slice(-4), joined: new Date().toLocaleString()
  }).then(() => {
    loadUserSession(customUid, phone, "Customer " + phone.slice(-4), null, "", []);
    alert("Login Successful!");
  });
}

function saveProfile() {
  if(!currentUser) return alert("Please Login first!");
  const name = document.getElementById('user-name-input').value;
  const address = document.getElementById('user-address-input').value;
  const phone = document.getElementById('user-phone-input').value;

  if (!phone || phone.length < 10) return alert("Valid phone number required!");

  database.ref('users/' + currentUser.uid).update({ name, address, phone }).then(() => {
    loadUserSession(currentUser.uid, phone, name, document.getElementById('user-avatar-img').src, address, wishlist);
    alert("Profile Saved!");
  });
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
  else wishlist.push(id);
  syncStorage();
  renderMenu();
  renderWishlist();
}

function renderWishlist() {
  const container = document.getElementById('wishlist-container');
  if (!container) return;
  const wishlistItems = menu.filter(m => wishlist.includes(m.id));

  if (wishlistItems.length === 0) {
    container.innerHTML = `<p style="grid-column:1/-1; text-align:center; padding:20px; color:#888;">Your Wishlist is empty.</p>`;
    return;
  }

  container.innerHTML = wishlistItems.map(item => `
    <div class="food-card">
      <span class="wishlist-icon" onclick="toggleWishlist(${item.id})">❤️</span>
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-add" onclick="addToCart(${item.id})">ADD</button>
      </div>
    </div>
  `).join('');
}

function renderMenu(customList = null) {
  const container = document.getElementById('menu-container');
  if (!container) return;

  let displayList = customList || (currentCat === "All" ? [...menu] : menu.filter(m => m.cat === currentCat));
  
  if (!customList) {
    displayList = displayList.sort(() => Math.random() - 0.5);
  }

  container.innerHTML = displayList.map(item => `
    <div class="food-card">
      <span class="wishlist-icon" onclick="toggleWishlist(${item.id})">${wishlist.includes(item.id) ? '❤️' : '🤍'}</span>
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-add" onclick="addToCart(${item.id})">Add</button>
      </div>
    </div>
  `).join('');
}

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

function addToCart(id) {
  const item = menu.find(m => m.id === id);
  if (!item || item.isOut) return;
  const exist = cart.find(c => c.id === id);
  if (exist) exist.qty++;
  else cart.push({ ...item, qty: 1 });
  syncStorage();
  updateCartCount();
  alert("Added to cart!");
}

function updateCartCount() {
  const countElem = document.getElementById('cart-count');
  if (countElem) countElem.innerText = cart.reduce((s, i) => s + i.qty, 0);
}

function proceedToPayment() {
  const name = document.getElementById('del-name').value;
  const phone = document.getElementById('del-phone').value;
  const address = document.getElementById('del-address').value;
  const payOptionElement = document.querySelector('input[name="pay-option"]:checked');
  const payOption = payOptionElement ? payOptionElement.value : "UPI";

  if (!name || !address || !phone) return alert("Please fill Name, Phone, and Address!");
  if (cart.length === 0) return alert("Cart is empty!");

  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const totalAmount = subtotal + (subtotal >= 200 ? 0 : 30);

  if (payOption === "UPI") {
    window.location.href = `upi://pay?pa=${currentAdminUPI}&pn=KD_KA_KHANA_GHAR_TAK&am=${totalAmount}&cu=INR`;
  }

  const orderId = "ORD" + Date.now().toString().slice(-5);
  let activeUid = (currentUser && currentUser.uid) ? currentUser.uid : localStorage.getItem('kd_user_uid') || ("user_" + phone);

  database.ref('orders/' + orderId).set({
    id: orderId, uid: activeUid, name, phone, address, pay: payOption, items: cart, total: totalAmount, status: "Pending", date: new Date().toLocaleString()
  }).then(() => {
    cart = [];
    syncStorage();
    updateCartCount();
    alert("Order Placed Successfully! ID: " + orderId);
    showPage('orders');
  });
}

function renderOrders() {
  const container = document.getElementById('my-orders-list');
  if(!container) return;
  const activePhone = (currentUser && currentUser.phone) || localStorage.getItem('kd_user_phone');
  const activeUid = (currentUser && currentUser.uid) || localStorage.getItem('kd_user_uid');

  if(!activePhone && !activeUid) {
    container.innerHTML = "<p style='text-align:center;'>Login to view orders.</p>";
    return;
  }

  database.ref('orders').on('value', (snapshot) => {
    const data = snapshot.val();
    let myOrders = data ? Object.values(data).filter(o => o.uid === activeUid || o.phone === activePhone) : [];
    container.innerHTML = myOrders.length === 0 ? "<p style='text-align:center;'>No orders placed yet.</p>" : myOrders.map(o => `
      <div class="order-card">
        <b>Order ID:</b> ${o.id} | <b>Date:</b> ${o.date}<br>
        <b>Total:</b> ₹${o.total} (${o.pay})<br>
        <b>Status:</b> ${o.status}<br><br>
        ${o.status === 'Pending' ? `<button class="btn-sec" style="background:red;" onclick="cancelMyOrder('${o.id}')">Cancel Order</button>` : ''}
      </div>
    `).reverse().join('');
  });
}

function cancelMyOrder(id) {
  if(confirm("Cancel order?")) database.ref('orders/' + id).update({ status: 'CancelledByCustomer' });
}

function showPage(pageId) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.querySelectorAll('.nav-item').forEach(n => n.classList.remove('active'));
  if (document.getElementById(pageId)) document.getElementById(pageId).classList.add('active');
  if(pageId === 'orders') renderOrders();
  if(pageId === 'wishlist') renderWishlist();
}

function customerLogout() { localStorage.clear(); auth.signOut().then(() => location.reload()); }

window.onload = function() {
  renderCategories();
  renderMenu();
  renderWishlist();
  updateCartCount();
  startTopNoticeRotation();
  startOfferBannerRotation();
  startMenuRotation();
};
