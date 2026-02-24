const formData = new FormData();
formData.append('orderData', JSON.stringify({
  customer: { fullName: 'No PageCount Test', email: 'test@nopagecount.com', phone: '1234567', address: 'Test Addr' },
  story: { longText: 'Short.', themes: ['Aksiyon'], isFiction: true },
  characters: [],
  paymentStatus: 'unpaid'
}));

fetch('http://localhost:3000/api/orders', { method: 'POST', body: formData })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
