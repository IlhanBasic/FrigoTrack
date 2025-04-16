import jwt from "jsonwebtoken";
const verifyAdmin = (req, res, next) => {
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ message: "Pristup odbijen, admin uloga potrebna." });
  }
  next();
};
const verifyToken = (req, res, next) => {
  const token = req.header("Authorization")?.replace("Bearer ", "");
  if (!token) {
    return res
      .status(401)
      .json({ message: "Pristup odbijen, token nije prosledjen." });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    req.user = decoded;
    next();
  } catch (error) {
    console.log(error)
    res.status(401).json({ message: "Nevalidan ili istekao token." });
  }
};
export { verifyAdmin, verifyToken };
