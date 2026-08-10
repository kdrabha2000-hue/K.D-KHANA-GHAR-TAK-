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
  { id: 10, name: "Dal Tadka", price: 120, cat: "Dal & Gravy", img: "https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=200", isOut: false },
  { id: 20, name: "Chicken Butter Masala (Full)", price: 380, cat: "Main Course", img: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=200", isOut: false },
  { id: 79, name: "Chicken Momo (Full)", price: 70, cat: "Momos", img: "https://images.unsplash.com/photo-1625220194771-7ebdea0b70b9?w=200", isOut: false },
  { id: 90, name: "Chicken Pokora (Half)", price: 120, cat: "Starters & Tandoor", img: "https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=200", isOut: false },
  { id: 100, name: "Chicken Egg Chowmein", price: 130, cat: "Chowmein & Rolls", img: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=200", isOut: false },
  { id: 110, name: "Chicken Fried Rice", price: 160, cat: "Fried Rice", img: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=200", isOut: false },
  { id: 120, name: "Gulab Jamun (2 pcs)", price: 50, cat: "Desserts", img: "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=200", isOut: false }
];

function sync() {
  localStorage.setItem('kd_cart', JSON.stringify(cart));
  localStorage.setItem('kd_wishlist', JSON.stringify(wishlist));
  if(currentUser) database.ref('users/' + currentUser.uid + '/wishlist').set(wishlist);
}

function loadUserSession(uid, phone, name, photo, address, dbWishlist) {
  currentUser = { uid, phone, name };
  if(dbWishlist) { wishlist = dbWishlist; sync(); }
  localStorage.setItem('kd_user_phone', phone);
  localStorage.setItem('kd_user_uid', uid);
  
  if (document.getElementById('auth-section')) document.getElementById('auth-section').style.display = 'none';
  if (document.getElementById('user-details-section')) document.getElementById('user-details-section').style.display = 'block';
  if (document.getElementById('display-name')) document.getElementById('display-name').innerText = name;
  if (document.getElementById('user-phone-input')) document.getElementById('user-phone-input').value = phone;
  if (document.getElementById('user-name-input')) document.getElementById('user-name-input').value = name;
  if (document.getElementById('user-address-input')) document.getElementById('user-address-input').value = address || "";
  if (document.getElementById('saved-addr-text')) document.getElementById('saved-addr-text').innerText = address || "No Address Saved";
  if (photo && document.getElementById('user-avatar-img')) document.getElementById('user-avatar-img').src = photo;
  renderOrders(); renderMenu(); renderWishlist();
}

auth.onAuthStateChanged((user) => {
  if (user) {
    database.ref('users/' + user.uid).once('value', (snap) => {
      const u = snap.val() || {};
      loadUserSession(user.uid, u.phone || "8453270362", u.name || "Hi Customer", u.photo, u.address, u.wishlist);
    });
  } else {
    const savedPhone = localStorage.getItem('kd_user_phone');
    const savedUid = localStorage.getItem('kd_user_uid');
    if (savedPhone && savedUid) {
      database.ref('users/' + savedUid).once('value', (snap) => {
        const u = snap.val() || {};
        loadUserSession(savedUid, u.phone || savedPhone, u.name || "Customer", u.photo, u.address, u.wishlist);
      });
    }
  }
});

function toggleWishlist(id) {
  if (wishlist.includes(id)) wishlist = wishlist.filter(x => x !== id);
  else wishlist.push(id);
  sync(); renderMenu(); renderWishlist();
}

function renderMenu() {
  const container = document.getElementById('menu-container');
  if (!container) return;
  // RANDOM SHUFFLE LOGIC
  let displayList = currentCat === "All" ? [...menu] : menu.filter(m => m.cat === currentCat);
  displayList = displayList.sort(() => Math.random() - 0.5); 
  
  container.innerHTML = displayList.map(item => `
    <div class="food-card">
      <span class="wishlist-icon" onclick="toggleWishlist(${item.id})">${wishlist.includes(item.id) ? '❤️' : '🤍'}</span>
      <img src="${item.img}" style="width:100%; height:100px;">
      <div style="padding:5px;">${item.name}<br><b>₹${item.price}</b><br><button onclick="addToCart(${item.id})">Add</button></div>
    </div>
  `).join('');
}

function addToCart(id) {
  const item = menu.find(m => m.id === id);
  if(item) {
    const ex = cart.find(c => c.id === id);
    if(ex) ex.qty++; else cart.push({...item, qty:1});
    sync(); updateCartCount(); alert("Added!");
  }
}

function proceedToPayment() {
  const name = document.getElementById('del-name').value;
  const phone = document.getElementById('del-phone').value;
  const address = document.getElementById('del-address').value;
  if (!name || !address || !phone) return alert("Fill delivery details!");
  const orderId = "ORD" + Date.now().toString().slice(-5);
  database.ref('orders/' + orderId).set({ id: orderId, name, phone, address, items: cart, total: cart.reduce((s,i)=>s+(i.price*i.qty),0), status: "Pending", date: new Date().toLocaleString(), uid: currentUser ? currentUser.uid : "guest" })
    .then(() => { cart = []; sync(); updateCartCount(); alert("Order Placed!"); showPage('orders'); });
}

function renderOrders() {
  const container = document.getElementById('my-orders-list');
  if(!container) return;
  database.ref('orders').on('value', (snap) => {
    const orders = snap.val() ? Object.values(snap.val()).reverse() : [];
    container.innerHTML = orders.length === 0 ? "<p>No orders yet.</p>" : orders.map(o => `
      <div class="order-card"><b>ID:</b> ${o.id}<br><b>Status:</b> ${o.status}<br>
      ${o.status==='Pending' ? `<button onclick="database.ref('orders/${o.id}').update({status:'Cancelled'})">Cancel</button>`:''}</div>`).join('');
  });
}

function renderWishlist() {
  const c = document.getElementById('wishlist-container');
  if(c) {
    const items = menu.filter(m => wishlist.includes(m.id));
    c.innerHTML = items.length === 0 ? "<p>Empty.</p>" : items.map(i => `<div>${i.name}</div>`).join('');
  }
}

function renderCart() { /* add standard cart render here */ }
function updateCartCount() { if(document.getElementById('cart-count')) document.getElementById('cart-count').innerText = cart.reduce((s,i)=>s+i.qty,0); }
function showPage(p) { document.querySelectorAll('.page').forEach(e=>e.classList.remove('active')); if(document.getElementById(p)) document.getElementById(p).classList.add('active'); if(p==='orders') renderOrders(); }
function renderCategories() { /* Categories logic */ }
window.onload = () => { renderMenu(); renderWishlist(); renderCart(); updateCartCount(); };
