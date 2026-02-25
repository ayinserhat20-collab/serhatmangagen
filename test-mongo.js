const formData = new FormData();
formData.append('orderData', JSON.stringify({
  customer: { fullName: 'Cloud DB Test', email: 'cloud@test.com', phone: '1234567', address: 'Cloud Addr' },
  story: { longText: 'Testing Mongo Connection.', themes: ['Aksiyon'], isFiction: true },
  characters: [],
  paymentStatus: 'unpaid'
}));

fetch('http://localhost:3000/api/orders', { method: 'POST', body: formData })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
