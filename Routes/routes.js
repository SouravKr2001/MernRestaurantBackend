const router = require("express").Router();


router.get("/",(req,res)=>{
    res.send("running server")
})

router.post("/signup", async (req, res) => {
    try {
     console.log(req.body)
    } catch (err) {
      res.json(err);
    }
  });
  

module.exports=router;