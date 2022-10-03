const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { MessModel } = require("../models/mess");
const router = express();

router.post("/login", async (req, res) => {
  const { username, password } = req.body;
  const mess = await MessModel.findOne({ id: 200361 });
  const members = mess.members.filter((user) => user.username === username);
  if (members.length > 0) {
    if (bcrypt.compare(members[0].password, password)) {
      const token = jwt.sign(
        { userName: members[0].username, userId: members[0].id },
        process.env.TOKEN_KEY
      );
      const userData = {
        token,
        mess: {
          name: mess.name,
          id: mess.id,
          members: mess.members.length,
        },
        user: members[0],
      };
      res.json({ user: userData, msg: "Login Successful", success: true });
    } else {
      res.json({ msg: "Wrong Password.", success: false });
    }
  } else {
    res.json({ msg: "Username not found.", success: false });
  }
});

router.post("/add", async (req, res) => {
  const { uname, name, password, phoneNumber } = req.body;
  const encryptedPassword = await bcrypt.hash(password, 10);
  let defaultDataArray = {};
  const currentMonth =
    (await "M-") + (new Date().getMonth() + 1 + "-" + new Date().getFullYear());
  defaultDataArray[currentMonth] = {
    meal: [],
    shop: [],
  };
  const member = {
    id: Date.now(),
    name,
    username: uname,
    password: encryptedPassword,
    phoneNumber,
    data: { ...defaultDataArray },
  };
  try {
    const mess = await MessModel.findOne({ id: 200361 });
    if (!mess) {
      let newMess = await MessModel.create({
        members: [{ ...member }],
      });

      if (newMess) {
        res.json({ success: true, mess: newMess });
      }
    } else {
      mess.members.push({ ...member });
      await mess.save();
      res.json({ success: true, mess });
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: "currently not available" });
  }
});

module.exports = router;
