import bcrypt from "bcryptjs";

const users = [
  {
    name: "Admin User",
    email: "admin@admin.com",
    password: bcrypt.hashSync("123123", 10),
    isShop: true,
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "John Doe",
    email: "jDoe@email.com",
    password: bcrypt.hashSync("123123", 10),
    avatarUrl: "/uploads/defaultAvatar.png",
  },
  {
    name: "Dummy Acc",
    email: "dummy@email.com",
    password: bcrypt.hashSync("12345", 10),
    avatarUrl: "/uploads/defaultAvatar.png",
  },
];

export default users;
