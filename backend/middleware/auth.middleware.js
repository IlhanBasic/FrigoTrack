import jwt from "jsonwebtoken";
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Pristup odbijen, admin uloga potrebna." });
  }
  next();
};
const verifyAdministration = (req, res, next) => {
  if (!(
    (req.user.role === "admin") ||
    (req.user.role === "user" && req.user.department === "administracija")
  )) {
    return res
      .status(403)
      .json({ message: "Pristup odbijen, admin ili administracijska uloga potrebna." });
  }
  next();
};

const verifyStock = (req, res, next) => {
  if ((req.user.role !== "user" || req.user.role !== "admin") && (req.user.department !== "skladište" || req.user.department !== undefined)) {
    return res
      .status(403)
      .json({ message: "Pristup odbijen, admin ili magacioner uloga potrebna." });
  }
  next();
}
const verifyToken = (req, res, next) => {
  let token =
    req.cookies.token || req.header("Authorization")?.replace("Bearer ", "");

  if (!token) {
    return res
      .status(401)
      .json({ message: "Pristup odbijen, token nije prosleđen." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error);
    res.status(401).json({ message: "Nevalidan ili istekao token." });
  }
};

export { verifyAdmin, verifyToken, verifyAdministration, verifyStock };
