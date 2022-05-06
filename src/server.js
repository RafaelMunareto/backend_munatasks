const app = require('./app');

app.listen(process.env.PORT || 3333, () => console.log('Server is running...'));
// app.listen(3000, () => console.log('Server is running...'));
