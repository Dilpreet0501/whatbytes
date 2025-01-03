require('dotenv').config();
const express = require('express');
const prisma = require('./models/prismaClient'); 
const userRoutes = require('./routes/userRoutes');
const projectRoutes = require('./routes/projectRoutes');
const taskRoutes = require('./routes/taskRoutes');
const authMiddleware = require('./middleware/authMiddleware');

const PORT = process.env.PORT || 3000;

const app = express();
app.get('/',(req,res)=>{
  res.send({message:'you are live'})
})
app.use(express.json());
app.use('/users', userRoutes);
app.use('/projects', projectRoutes);
app.use('/tasks', taskRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
