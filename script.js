// FIREBASE SETUP WITH LOCAL PERSISTENCE
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
const auth = firebase.auth();
const database = firebase.database();

auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

// GLOBAL VARIABLES
let currentUser = null;
let selectedModalItem = null;
let confirmationResultGlobal = null;
let cart = [];
let wishlist = [];
let discount = 0;
let currentCat = "All";
let isStoreOpen = true;
let currentAdminUPI = "6000026478@okbizaxis";
let userCoins = 0;

// LIVE BANNER ROTATION
let liveBanners = [
  "🔥 TODAY'S SPECIAL: Chicken Butter Masala @ ₹380",
  "🎂 SPECIAL BIRTHDAY CAKES: Normal, Custom & Size Offers Available!",
  "🥤 PAIRS WELL WITH COLD DRINKS: Sprite, Coke & Cold Coffee available!",
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

// MENU DATA (114 Food Items + Birthday Cakes + Drinks)
let menu = [
  // Cold Drinks & Beverages
  { id: 106, name: "Sprite / Coca-Cola (200ml)", price: 40, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1622483767028-3f66f32aef97?w=200", isOut: false },
  { id: 107, name: "Fresh Cold Coffee", price: 70, cat: "Cold Drinks & Beverages", img: "https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=200", isOut: false },

  // Birthday Cakes
  { id: 201, name: "Normal Cake (500gm)", price: 450, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1558961363-fa8fdf82db35?w=200", isOut: false },
  { id: 202, name: "Customer Choice Cake (500gm)", price: 500, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=200", isOut: false },
  { id: 203, name: "Offer Cake (1kg)", price: 850, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1535141192574-5d4897c12636?w=200", isOut: false },
  { id: 204, name: "Offer Cake (2kg)", price: 1600, cat: "Birthday Cakes", img: "https://images.unsplash.com/photo-1562777717-dc6984f65a63?w=200", isOut: false },

  // Main Course
  { id: 20, name: "Chicken Butter Masala (Full)", price: 380, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200", isOut: false },
  { id: 22, name: "Chicken Curry (Full)", price: 240, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200", isOut: false },

  // Momos
  { id: 79, name: "Chicken Momo (Full)", price: 70, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200", isOut: false },
  { id: 81, name: "Pork Momo (Full)", price: 80, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200", isOut: false }
];

// AUTH OBSERVER (PERSISTENCE)
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
        userCoins = u.coins || 10;
        if (document.getElementById('coins-count')) document.getElementById('coins-count').innerText = userCoins;
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

function setupRecaptcha() {
  if (!window.recaptchaVerifier) {
    window.recaptchaVerifier = new firebase.auth.RecaptchaVerifier('recaptcha-container', { 'size': 'invisible' });
  }
}

function sendOTP() {
  const phone = document.getElementById('auth-phone').value;
  if (!phone || phone.length < 10) return alert("Enter valid 10-digit phone number!");

  setupRecaptcha();
  const phoneNumber = "+91" + phone;
  auth.signInWithPhoneNumber(phoneNumber, window.recaptchaVerifier)
    .then((confirmationResult) => {
      confirmationResultGlobal = confirmationResult;
      document.getElementById('otp-box').style.display = 'block';
      alert("OTP Sent to " + phoneNumber);
    })
    .catch((error) => alert("OTP Error: " + error.message));
}

function verifyOTP() {
  const code = document.getElementById('otp-input').value;
  if (!code || code.length < 6) return alert("Enter 6-digit OTP!");

  if (confirmationResultGlobal) {
    confirmationResultGlobal.confirm(code).then(() => alert("Phone Verification Successful!"));
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

function uploadProfileCameraPhoto(input) {
  if (input.files && input.files[0]) {
    const reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('user-avatar-img').src = e.target.result;
      if (currentUser) database.ref('users/' + currentUser.uid).update({ photoUrl: e.target.result });
    };
    reader.readAsDataURL(input.files[0]);
  }
}

function saveProfile() {
  if(!currentUser) return alert("Please Login first!");
  const name = document.getElementById('user-name-input').value;
  const address = document.getElementById('user-address-input').value;

  database.ref('users/' + currentUser.uid).update({ name, address })
    .then(() => alert("Profile Saved!"));
}

function customerLogout() {
  auth.signOut().then(() => location.reload());
}

function deleteAccount() {
  if(!currentUser) return alert("Please login first!");
  const reason = prompt("Enter reason for deleting account:");
  if(reason) {
    database.ref('deleted_accounts/' + currentUser.uid).set({ uid: currentUser.uid, reason, date: new Date().toLocaleString() })
      .then(() => {
        database.ref('users/' + currentUser.uid).remove();
        auth.currentUser.delete().then(() => location.reload());
      });
  }
}

// VOICE SEARCH
function startVoiceSearch() {
  if ('webkitSpeechRecognition' in window) {
    const recognition = new webkitSpeechRecognition();
    recognition.onresult = function(event) {
      const text = event.results[0][0].transcript;
      document.getElementById('search-input').value = text;
      filterMenu();
    };
    recognition.start();
  } else {
    alert("Voice Search not supported in this browser.");
  }
}

// PRODUCT POPUP MODAL & CROSS-SELLING
function openModal(id) {
  const item = menu.find(m => m.id === id);
  if (!item) return;
  selectedModalItem = item;
  
  document.getElementById('modal-img').src = item.img;
  document.getElementById('modal-title').innerText = item.name;
  document.getElementById('modal-price').innerText = "₹" + item.price;
  document.getElementById('product-modal').style.display = 'flex';
}

function closeModal() {
  document.getElementById('product-modal').style.display = 'none';
}

function addToCartFromModal() {
  if (selectedModalItem) {
    addToCart(selectedModalItem.id);
    closeModal();
  }
}

function buyNowFromModal() {
  if (selectedModalItem) {
    addToCart(selectedModalItem.id);
    closeModal();
    showPage('cart');
  }
}

function addSuggestedDrink(id) {
  addToCart(id);
  alert("Cold Drink added to cart!");
}

// PAYMENT ENGINE & UPI INTEGRATION
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
    // TRIGGER DIRECT UPI APP TO 6000026478@okbizaxis
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

// UI RENDERING
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

function filterMenu() {
  const query = document.getElementById('search-input').value.toLowerCase();
  const container = document.getElementById('menu-container');
  if (!container) return;
  const filtered = menu.filter(m => m.name.toLowerCase().includes(query));
  container.innerHTML = filtered.map(item => `
    <div class="food-card" onclick="openModal(${item.id})">
      <img src="${item.img}" class="food-img">
      <div class="food-info">
        <div class="food-title">${item.name}</div>
        <div class="food-price">₹${item.price}</div>
        <button class="btn-primary" onclick="event.stopPropagation(); addToCart(${item.id})">ADD +</button>
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
      <div>
        <b>${i.name}</b><br>
        <span style="color:green; font-weight:bold;">75% OFF</span> <s style="color:#888;">₹${i.price * 2}</s> <b>₹${i.price}</b> x ${i.qty}
      </div>
      <div>
        <button onclick="changeQty(${i.id}, -1)">-</button> 
        <span style="margin:0 5px;">${i.qty}</span> 
        <button onclick="changeQty(${i.id}, 1)">+</button>
      </div>
    </div>
  `).join('');
  
  const subtotal = cart.reduce((s, i) => s + (i.price * i.qty), 0);
  const deliveryFee = subtotal >= 200 ? 0 : 30;
  if (summary) {
    summary.innerHTML = `
      <div>Item Subtotal: ₹${subtotal}</div>
      <div>Delivery Fee: ${deliveryFee === 0 ? '<span style="color:green; font-weight:bold;">FREE</span>' : '₹30'}</div>
      <div>Discount: -₹${discount}</div>
      <div><b>Total Payable: ₹${Math.max(0, subtotal + deliveryFee - discount)}</b></div>
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

function renderOrders() {
  const container = document.getElementById('my-orders-list');
  if(!container) return;

  if(!currentUser) {
    container.innerHTML = "<p>Please login in Profile tab to see order history & live tracking.</p>";
    return;
  }
  
  database.ref('orders').on('value', (snapshot) => {
    const data = snapshot.val();
    let myOrders = data ? Object.values(data).filter(o => o.uid === currentUser.uid) : [];

    container.innerHTML = myOrders.length === 0 ? "<p>No orders placed yet.</p>" : myOrders.map(o => {
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

        ${o.status === 'Pending' ? `<button class="btn-sec" style="background:red;" onclick="cancelMyOrder('${o.id}')">Cancel Order</button>` : '🔒 Order Locked'}
      </div>
    `}).reverse().join('');
  });
}

function cancelMyOrder(id) {
  if(confirm("Cancel order?")) database.ref('orders/' + id).update({ status: 'CancelledByCustomer' });
}

// ADMIN PANEL REALTIME LISTENERS & SOUND ALERT
function renderAdmin() {
  database.ref('orders').on('value', (snap) => {
    const liveOrders = snap.val() ? Object.values(snap.val()) : [];

    // SOUND ALERT FOR NEW PENDING ORDER
    const pendingOrders = liveOrders.filter(o => o.status === 'Pending');
    if (pendingOrders.length > 0) {
      document.getElementById('order-sound').play().catch(() => {});
    }

    document.getElementById('stat-total').innerText = liveOrders.length;
    document.getElementById('stat-pending').innerText = pendingOrders.length;
    document.getElementById('stat-earning').innerText = liveOrders.filter(o => o.status === 'Delivered').reduce((s, o) => s + (o.total || 0), 0);

    const container = document.getElementById('admin-orders-list');
    container.innerHTML = liveOrders.map(o => `
      <div class="order-card">
        <b>${o.id}</b> - ${o.name} | Address: ${o.address}<br>
        Items: ${(o.items || []).map(i => i.name + ' x' + i.qty).join(', ')}<br>
        Status: <b>${o.status}</b><br>
        <button class="btn-sec" onclick="updateStatus('${o.id}', 'Accepted')">Accept</button>
        <button class="btn-sec" onclick="updateStatus('${o.id}', 'Out for Delivery')">Out for Delivery</button>
        <button class="btn-sec" onclick="updateStatus('${o.id}', 'Delivered')">Delivered</button>
      </div>
    `).reverse().join('');
  });

  const menuContainer = document.getElementById('admin-menu-list');
  menuContainer.innerHTML = menu.map(m => `
    <div class="admin-item-row">
      <b>${m.name}</b> - ₹${m.price}<br>
      <button onclick="toggleStock(${m.id})" style="background:${m.isOut ? 'red' : 'green'}; color:white; border:none; padding:3px 6px; border-radius:4px;">${m.isOut ? 'Mark In-Stock' : 'Mark Out-of-Stock'}</button>
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

function updateAdminUPI() {
  const newUPI = document.getElementById('admin-upi-input').value;
  if (newUPI) {
    currentAdminUPI = newUPI;
    alert("Store UPI ID updated to " + newUPI);
  }
}

function toggleStoreStatus() {
  isStoreOpen = !isStoreOpen;
  document.getElementById('store-status-text').innerText = isStoreOpen ? "OPEN" : "CLOSED";
  document.getElementById('store-status-text').style.color = isStoreOpen ? "green" : "red";
}

function toggleWishlist(id) {
  if (wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
  else wishlist.push(id);
  renderMenu();
}

window.onload = function() {
  renderCategories();
  renderMenu();
};
