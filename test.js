const formData = new FormData();
formData.append('orderData', JSON.stringify({
  customer: { fullName: 'Test Node', email: 'test@node.com', phone: '12345', address: 'Test address' },
  pageCount: 30,
  story: { longText: 'Bu bir test hikayesidir. '.repeat(100), themes: ['Aksiyon'], isFiction: true },
  characters: [],
  paymentStatus: 'unpaid'
}));
const blob = new Blob(['dummy image data']);
formData.append('photos', blob, 'test.jpg');

fetch('http://localhost:3000/api/orders', { method: 'POST', body: formData })
  .then(r => r.json())
  .then(console.log)
  .catch(console.error);
