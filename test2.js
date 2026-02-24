const formData = new FormData();
formData.append('orderData', JSON.stringify({
  customer: { fullName: 'Shopier Test', email: 'shopier@test.com', phone: '555', address: 'Test' },
  pageCount: 30,
  story: { longText: 'Kisa bi hikaye.', themes: ['Dram'], isFiction: false },
  characters: [],
  paymentStatus: 'unpaid'
}));

fetch('http://localhost:3000/api/orders', { method: 'POST', body: formData })
  .then(r => r.json())
  .then(data => {
    console.log("Order Created:", data.id);
    return fetch('http://localhost:3000/api/admin/mark-paid?id=' + data.id + '&password=admin');
  })
  .then(r => r.json())
  .then(data => console.log("Mark Paid Result:", data))
  .catch(console.error);
