const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors({
  origin: 'http://localhost:3000'
}));
app.options('*', cors());
app.use(bodyParser.json());

// Connect to MongoDB
mongoose.connect('mongodb+srv://zandrodiocampo:1234@cluster1.boa2m2z.mongodb.net/?retryWrites=true&w=majority&appName=Cluster1', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Define a schema and model for comments
const CommentSchema = new mongoose.Schema({
  name: String,
  comment: String,
  date: { type: Date, default: Date.now },
});

const Comment = mongoose.model('Comment', CommentSchema);

// Define routes
app.post('/api/comments', async (req, res) => {
  // Create a new comment
  const { name, comment } = req.body;

  if (!name || !comment) {
    return res.status(400).json({ error: 'Name and comment are required' });
  }

  try {
    const newComment = new Comment({ name, comment });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.get('/api/comments', async (req, res) => {
  // Fetch all comments
  try {
    const comments = await Comment.find();
    res.status(200).json(comments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'Server error' });
  }
});

app.delete('/api/comments/:id', async (req, res) => {
    const { id } = req.params;
  
    try {
      const deletedComment = await Comment.findByIdAndDelete(id);
      if (!deletedComment) {
        return res.status(404).json({ error: 'Comment not found' });
      }
      res.status(200).json({ message: 'Comment deleted successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Server error' });
    }
  });

const PORT = process.env.PORT || 10000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
