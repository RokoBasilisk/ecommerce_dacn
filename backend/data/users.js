import bcrypt from "bcryptjs";

const users = [
  {
    name: "Shop 1",
    password: bcrypt.hashSync("123123", 10),
    email: "shop1@admin.com",
    paypalEmail: "sb-br9gv27937100@personal.example.com",
    isShop: true,
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Shop 2",
    password: bcrypt.hashSync("123123", 10),
    email: "shop2@email.com",
    paypalEmail: "sb-hvkfj24521706@personal.example.com",
    isShop: true,
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Dummy Acc 1",
    password: bcrypt.hashSync("12345", 10),
    isShop: false,
    email: "dummy1@email.com",
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Dummy Acc2",
    password: bcrypt.hashSync("12345", 10),
    isShop: false,
    email: "dummy2@email.com",
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Dummy Acc3",
    password: bcrypt.hashSync("12345", 10),
    isShop: false,
    email: "dummy3@email.com",
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Dummy Acc4",
    password: bcrypt.hashSync("12345", 10),
    isShop: false,
    email: "dummy4@email.com",
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Dummy Acc5",
    password: bcrypt.hashSync("12345", 10),
    isShop: false,
    email: "dummy5@email.com",
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Dummy Acc6",
    password: bcrypt.hashSync("12345", 10),
    isShop: false,
    email: "dummy6@email.com",
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Dummy Acc7",
    password: bcrypt.hashSync("12345", 10),
    isShop: false,
    email: "dummy7@email.com",
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Dummy Acc8",
    password: bcrypt.hashSync("12345", 10),
    isShop: false,
    email: "dummy8@email.com",
    avatarUrl: "/uploads/defaultAvatar.png",
  },
];

export default users;
