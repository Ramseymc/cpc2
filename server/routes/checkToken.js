const jwt =require("jsonwebtoken");
const chalk = require("chalk");


function jwtSignUser(user) {
  const ONE_WEEK = 60 * 60 * 24 * 7;
  return jwt.sign(user, process.env.JWT_SECRET, {
    expiresIn: ONE_WEEK,
  });
}


const checktoken = (req, res, next) => {

  let header = req.header("Authorization");

  let token = header
  console.log(token)
 
  if (token) {
    jwt.verify(token, process.env.JWT_SECRET, (err, decoded) => {
      if (err) {
        res.json({
          success: false,
          message: "Token is not valid",
        });

      } else {

        next();
      }
    });
  } else {
    res.json({
      success: false,
      message: "There is no Token",
    });
    console.log(chalk.yellow("NO JWT"));
  }
};

module.exports = { checktoken, jwtSignUser };
// export default  { checktoken, jwtSignUser };
