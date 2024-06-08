import { OAuth2Client } from "google-auth-library";
import User from "../models/user.model.js";
import userCtrl from "../controllers/user.controller.js";
import jwt from "jsonwebtoken";
import { expressjwt } from "express-jwt";
//import config from "./../../config/config.js";
import sgMail from "@sendgrid/mail";

const jwtSecret = process.env.JWT_SECRET || "YOUR_secret_key"
const signin = async (req, res) => {
  // The POST request object receives the email and password in req.body. This email is
  // used to retrieve a matching user from the database. Then, the password
  // authentication method defined in UserSchema is used to verify the password that's
  // received in req.body from the client.
  try {
    let user = await User.findOne({ email: req.body.email });
    if (!user) return res.status(401).json({ error: "User not found" });
    if (!user.authenticate(req.body.password)) {
      return res.status(401).send({ error: "Email and password don't match." });
    }
    //  If the password is successfully verified, the JWT module is used to generate a signed
    // JWT using a secret key and the user's _id value.
    const token = jwt.sign({ _id: user._id }, jwtSecret);
    res.cookie("t", token, { expire: new Date() + 9999 });

    return res.json({
      token,
      user: {
        _id: user._id,
        name: user.name,
        lastname: user.lastname,
        email: user.email,
      },
    });
  } catch (err) {
    return res.status(401).json({ error: "Could not sign in" });
  }
};

async function verify(token) {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken: token,
    audience: process.env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  const userid = payload['sub'];
  return payload;
}
const signinGoogle = async (req, res, next) => {
  const { token } = req.body;
  try {
    if (!token) throw new Error("token is not specified");
    const response = await verify(token)
      .then(async (payload) => {
        if (!payload.email) throw new Error("No existe campo email en payload")
        const exists = await User.findOne({ email: payload.email, role: "user" })
        if (exists) return { message: "Successfully signed up!", token };
        const newUser = await User.create({ name: payload.given_name, lastname: payload.family_name, email: payload.email, password: payload.sub })
          .then((user) => {
            return user;
          });
        console.log("newUser", newUser);
        return { user: newUser, token };
      });
    res.status(200).json(response);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

const signout = (req, res) => {
  // The signout function clears the response cookie containing the signed JWT. This is
  // an optional endpoint and not really necessary for auth purposes if cookies are not
  // used at all in the frontend.
  res.clearCookie("t");
  return res.status(200).json({ message: "signed out" });
};

const requireSignin = expressjwt({
  // We can add requireSignin to any route that should be protected against
  // unauthenticated access.
  secret: jwtSecret,
  userProperty: "auth",
  algorithms: ["HS256"],
});

const hasAuthorization = async (req, res, next) => {
  const authorized = req.profile && req.auth && req.profile._id == req.auth._id;
  if (!authorized) {
    // here we check if the user trying to modify the profile is an Admin
    try {
      console.log(req.auth);
      const adminProfile = await User.findById(req.auth._id);

      const { role } = adminProfile;
      if (role !== "admin") {
        // if the modifier profile is not an admin then is not authorized
        return res.status(403).json({
          error: "User is not authorized",
        });
      }
    } catch (err) {
      return res
        .status(400)
        .json({ message: "HasAutorization: User not found" });
    }
  } else if (
    // this conditional is intended to increase the level of security
    // making sure that a simple user can't change its own role or isDeleted
    (req.body.role || "isDeleted" in req.body) &&
    req.profile.role === "user"
  ) {
    return res.status(403).json({
      error: "Nice try champ, but you are not an Admin",
    });
  }
  next();
};

const isAdmin = (req, res) => {
  const { role } = req.profile;
  if (!role.includes("admin"))
    return res
      .status(403)
      .json({ message: "Forbidden, you are not an Admin." });
  return res.status(200).json({ message: true });
};

export default {
  signin,
  signout,
  requireSignin,
  hasAuthorization,
  isAdmin,
  signinGoogle,
};
