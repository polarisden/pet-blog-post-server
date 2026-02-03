import express from "express";
import cors from "cors";
import "dotenv/config";
import connectionPool from "./utils/db.mjs";

const app = express();
const port = process.env.PORT || 4000;

app.use(cors());
app.use(express.json());

app.post("/posts", async (req, res) => {
  const newPost = {
    ...req.body
  }
  try {
    await connectionPool.query(`
      insert into posts (title, image, category_id, description, content, status_id)
      values ($1, $2, $3, $4, $5, $6)
      `,[
        newPost.title,
        newPost.image,
        newPost.category_id,
        newPost.description,
        newPost.content,
        newPost.status_id
      ])

    return res.status(200).json({
      message: "Created post sucessfully"
    })
  } catch (e) {
    res.status(500).json({ 
      message: "Server could not create post because database connection" 
    })
    console.log("error =",e)
  }  
});

app.get("/test", async (req, res) => {
  try {
    const result = await connectionPool.query("SELECT * FROM posts");
    res.status(200).json(result.rows);
  } catch (e) {
    res.status(500).json({ message: "Server could not fetch posts because of database connection" });
    console.log("error =", e);
  }
});



app.listen(port, () => {
  console.log(`Server is running at ${port}`);
});
