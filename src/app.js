require("dotenv").config();
const express = require("express");
const app = express();
const path = require("path");
const port = process.env.PORT || 3000;
const dbutil = require("./dbutil");

const static_path = path.join(__dirname,"../public");
const view_path = path.join(__dirname,"../views");

app.use(express.static(static_path));
app.set("view engine", "hbs");
app.set("views", view_path);

app.use(express.json());
app.use(express.urlencoded({extended:false})); // This allows to access form data

app.get("/", (req, res) => {
    res.render("index");
})

app.get("/home", (req, res) => {
    res.render("home");
})

app.get("/login", (req, res) => {
  res.render("login");
})

app.post("/login", async (req, res) => {
  try{
      const email = req.body.email;
      const password = req.body.password;

      const resp = await dbutil.verifyUser(email, password);
      if(resp.status == "success" && resp.data == 1){
        res.render("home");
      }
      else{
        res.status(400).send("Invalid login details");
      }
  }
  catch(err){
    console.log(err)
    res.status(400).send("Invalid login details");
  }
})

app.post("/register", async (req, res) => {
  try{
      const validationResp = await validation(req.body);
      if(validationResp.status == "success"){
        const resp = await dbutil.registerUser(req.body);
        if(resp.status == "success"){
          res.render("login");
        }
        else{
          res.status(400).send(resp.msg);
        }
      }
      else{
        res.status(400).send(validationResp.msg);
      }
  }
  catch(err){
    console.log(err)
    res.status(400).send("Not able register user");
  }
})

async function validation(o){
  if(!o.first || !o.last || !o.email || !o.mobile || !o.password || !o.confirm_password){
    return {"status":"unsuccess","msg":"Please fill all the details"}; 
  }

  if(o.password != o.confirm_password){
    return {"status":"unsuccess","msg":"Confirm password not matched"}; 
  }

  return {"status":"success","msg":""}; 
}

app.get("/register", (req, res) => {
    res.render("registration");
})

app.listen(port, () => {
    console.log(`Server is listing at port ${port}`);
})