const express = require("express");
const { MessModel } = require("../models/mess");
const router = express();

//// meal add ////
router.post("/add", async (req, res) => {
  const { userId } = req.user;
  const { amount } = req.body;
  try {
    const mess = await MessModel.findOne({ id: 200361 });
    if (mess) {
      let members = mess.members.filter((user) => user.id === userId);
      if (members.length > 0) {
        let userData = {
          ...members[0].data[
            `M-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
          ],
        };

        userData.meal.push({
          id: Date.now(),
          amount,
          date: new Date().getDate(),
        });

        mess.members.forEach((user) => {
          if (user.id === userId) {
            user.data[
              `M-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
            ] = { ...userData };
          }
        });

        await MessModel.findOneAndUpdate(
          { id: 200361 },
          { $set: { members: [...mess.members] } }
        );

        res.json({ success: true, msg: "Meal added successfully" });
      } else {
        res.json({ success: false, msg: "no user found" });
        console.log("no user found");
      }
    } else {
      console.log("no mess found");
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: "Currently not possible" });
  }
});

//// shop add ////
router.post("/shop", async (req, res) => {
  const { userId } = req.user;
  const { amount, description } = req.body;
  try {
    const mess = await MessModel.findOne({ id: 200361 });
    if (mess) {
      let members = mess.members.filter((user) => user.id === userId);
      if (members.length > 0) {
        let userData = {
          ...amountmembers[0].data[
            `M-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
          ],
        };

        userData.shop.push({
          id: Date.now(),
          amount,
          description,
          date: new Date().getDate(),
        });

        mess.members.forEach((user) => {
          if (user.id === userId) {
            user.data = { ...userData };
          }
        });

        await MessModel.findOneAndUpdate(
          { id: 200361 },
          { $set: { members: [...mess.members] } }
        );
        res.json({ success: true, msg: "Shop added successfully" });
      }
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: "Currently not possible" });
  }
});

router.get("/data", async (req, res) => {
  const { userId } = req.user;
  try {
    const mess = await MessModel.findOne({ id: 200361 });

    let member = mess.members.filter((user) => user.id === userId);
    if (member && member.length > 0) {
      res.json({ success: true, user: member[0] });
    } else {
      res.json({ success: false, msg: "No User Found" });
      console.log("no user found");
    }
  } catch (e) {
    console.log(e);
    res.json({ success: false, msg: "Currently not possible" });
  }
});

router.get("/cost", async (req, res) => {
  const mess = await MessModel.findOne({ id: 200361 });
  let totalMealCount = 0;
  let totalShopCost = 0;
  let userData = [];

  mess.members.forEach((user) => {
    let personalMealCount = 0;
    let personalShop = 0;
    let meals = user.data[
      `M-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
    ]
      ? user.data[`M-${new Date().getMonth() + 1}-${new Date().getFullYear()}`]
          .meal
      : [];
    let shops = user.data[
      `M-${new Date().getMonth() + 1}-${new Date().getFullYear()}`
    ]
      ? user.data[`M-${new Date().getMonth() + 1}-${new Date().getFullYear()}`]
          .shop
      : [];

    if (meals.length > 0) {
      meals.forEach((d) => {
        personalMealCount += Number(d.amount);
        totalMealCount += Number(d.amount);
      });
    }

    if (shops.length > 0) {
      shops.forEach((d) => {
        personalShop += Number(d.amount);
        totalShopCost += Number(d.amount);
      });
    }

    userData.push({
      name: user.name,
      avatar: user.avatar,
      personalMealCount,
      personalShop,
      totalCost: 0,
      return: 0,
      record: {
        meals,
        shops,
      },
    });
  });

  const perMeal = (totalShopCost / totalMealCount).toFixed(2);

  userData.forEach((data) => {
    data.totalCost = (data.personalMealCount * perMeal).toFixed(2);
    data.return = data.personalShop - data.totalCost;
  });

  res.json({
    success: true,
    data: { totalMealCount, totalShopCost, perMeal, userData },
  });
});

module.exports = router;
