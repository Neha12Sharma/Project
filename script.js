const API_URL = 'http://localhost:3000/api';
let selectedItems = [];

async function loadMenu() {
  const res = await fetch(`${API_URL}/menu`);
  const menu = await res.json();
  const container = document.getElementById('menu');

  menu.forEach(item => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <p><strong>${item.name}</strong></p>
      <p>₹${item.price}</p>
      <button onclick='addToOrder(${JSON.stringify(item)})'>Add</button>
    `;
    container.appendChild(div);
  });
}

function addToOrder(item) {
  selectedItems.push(item);
  alert(`${item.name} added to order.`);
}

async function submitOrder() {
  const user = prompt("Enter your name:");
  if (!user || selectedItems.length === 0) {
    alert("Order cannot be submitted.");
    return;
  }

  const total = selectedItems.reduce((sum, item) => sum + item.price, 0);
  const res = await fetch(`${API_URL}/order`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ user, items: selectedItems, total })
  });

  const data = await res.json();
  window.location.href = `order.html?id=${data.orderId}`;
}

async function loadHistory() {
  const user = document.getElementById('userName').value.trim();
  if (!user) return alert("Enter your name.");

  const res = await fetch(`${API_URL}/orders/${user}`);
  const orders = await res.json();
  const container = document.getElementById('orders');
  container.innerHTML = '';

  if (orders.length === 0) {
    container.textContent = "No orders found.";
    return;
  }

  orders.forEach(order => {
    const div = document.createElement('div');
    div.className = 'card';
    div.innerHTML = `
      <p><strong>Order #${order.id}</strong></p>
      <p>${order.timestamp}</p>
      <p>Total: ₹${order.total}</p>
      <p>Items: ${JSON.parse(order.items).map(i => i.name).join(', ')}</p>
    `;
    container.appendChild(div);
  });
}

if (document.getElementById('menu')) loadMenu();
