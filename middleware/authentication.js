const CustomErr = require("../errors/");
const { isTokenValid } = require("../utils");

const authenticateUser = async (req, res, next) => {
  const token = req.cookies.token;
  if (!token) {
    throw new CustomErr.UnauthenticatedError("Unauthenticated");
  }
  try {
    const { name, userId, role } = isTokenValid({ token });
    req.user = { name, userId, role };
    next();
  } catch (error) {
    throw new CustomErr.UnauthenticatedError("Unauthenticated");
  }
};

// const authorizePermisson = (req, res, next) => {
//   if (req.user.role !== "admin") {
//     throw new CustomErr.UnauthorizedError("Forbidden access");
//   }
//   next();
// };

const authorizePermisson = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user.role)) {
      throw new CustomErr.UnauthorizedError("Forbidden access");
    }
    next();
  };
};

module.exports = {
  authenticateUser,
  authorizePermisson,
};
