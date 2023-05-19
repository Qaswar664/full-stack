const express = require('express')
const cors = require('cors')
require('./db/config')
const User = require('./db/User')
const Product = require('./db/Product')
const bcrypt = require('bcrypt');

 
const app = express()

app.use(express.json())
app.use(cors())

app.post('/register', async (req, resp) => {
    const user = await new User(req.body)
    let result = await user.save()
    result = result.toObject()
    delete result.password
    resp.send(result)
})

app.post('/login', async (req, resp) => {
  const { email, password } = req.body;

  try {
    // Find the user by email
    const user = await User.findOne({ email });

    // If no user found
    if (!user) {
      return resp.status(404).json({ error: 'User not found' });
    }

    // Compare the provided password with the hashed password stored in the database
    const isPasswordValid = await bcrypt.compare(password, user.password);

    // If the passwords do not match
    if (!isPasswordValid) {
      return resp.status(401).json({ error: 'Invalid credentials' });
    }

    // Generate an authentication token
    const token = jwt.sign({ userId: user._id }, 'your-secret-key', {
      expiresIn: '1h',
    });

    // Send the authentication token as the response
    resp.json({ token });
  } catch (error) {
    console.error('Error during login:', error);
    resp.status(500).json({ error: 'Internal server error' });
  }
});


app.post('/add-product', async (req,resp)=>{
      let product = new Product(req.body)
      let result = await product.save()
      resp.send(result)

})

app.get('/products',async(req,resp)=>{
    let products = await Product.find()
    if(products.length>0){
        resp.send(products)
    }else{
        resp.send({result:"No Products found"})
    }
})

app.delete('/product/:id',async(req,resp)=>{
    const result =await Product.deleteOne({_id:req.params.id})
    resp.send(result)
})

app.get('/product/:id',async(req,resp)=>{
    const result = await Product.findOne({_id:req.params.id})
    if(result){
        resp.send(result)
    }else{
        resp.send({result:"No Record Found"})
    }
    app.put('/product/:id',async(req,resp)=>{
        let result = await Product.updateOne(
            {_id:req.params.id},
            {
                $set:req.body
            }
        )
       resp.send(result)
    })

    app.get('/search', async (req, resp) => {
        try {
          const { key } = req.query;
          const result = await Product.find({
            $or: [
              { name: { $regex: key, $options: 'i' } },
              { company: { $regex: key, $options: 'i' } },
              { category: { $regex: key, $options: 'i' } },
            ],
          });
          resp.json(result);
        } catch (err) {
          console.error(err);
          resp.status(500).json({ message: 'Internal server error' });
        }
      });
      
      
    

})

app.listen(5000)