await User.create({
  username,
  email,
  password: hashedPassword,
  roleId,
  active: true,
  banned: false,
});
