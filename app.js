const express = require("express");
const app = express();
const mongoose = require("mongoose");
const Listing = require("./database/model.js");
const path = require("path");
const methodOverride = require("method-override");
const ejsmate = require("ejs-mate");
const wrapasync = require("./utils/wrapasync.js");
const expresserror = require("./utils/expresserror.js");
const session = require("express-session");
// const { listingSchema, reviewSchema } = require("./schema.js");
const Review = require("./database/review.js");
const passport = require("passport");
const Localstrategy = require("passport-local");
const user = require("./database/user.js");
const flash = require("connect-flash");
const routes = require("./routes/user.js");

const mongo_url = "mongodb://localhost:27017/SekendHand";

main()
  .then(() => {
    console.log("connect to db");
  })
  .catch((err) => {
    console.log(err);
  });

async function main() {
  await mongoose.connect(mongo_url);
}

app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.engine("ejs", ejsmate);
app.use(express.static(path.join(__dirname, "/stylesheet")));
// app.use('/images', express.static('images'));

app.get("/home", (req, res) => {
  res.render("listings/home.ejs");
});

const sessionOptions = {
  secret: "mysupersecretcode",
  resave: false,
  saveUninitialized: true,
  cookie: {
    expires: Date.now() + 7 * 24 * 60 * 60 * 1000,
    maxAge: 7 * 24 * 60 * 60 * 1000,
    httpOnly: true,
  },
};

app.use(session(sessionOptions));
app.use(flash());

app.use(passport.initialize());
app.use(passport.session());
passport.use(new Localstrategy(user.authenticate()));
passport.serializeUser(user.serializeUser());
passport.deserializeUser(user.deserializeUser());

// app.all("*"(req, res, next)=>{
//   next(new expresserror(404,"not found!"));
// });

app.use((req, res, next) => {
  res.locals.success = req.flash("success");
  res.locals.error = req.flash("error");
  next();
});

app.get("/demouser", async (req, res) => {
  let fakeuser = new user({
    email: "student@123",
    username: "Om-Mohan-Gaur",
  });
  let registeruser = await user.register(fakeuser, "helloworld");
  res.send(registeruser);
});

app.get("/", (req, res) => {
  res.render("/user/login.ejs");
});
// const validateListing = (req, res, next) => {
//   let { error } = listingSchema.validate(req.body);
//   if (error) {
//     let errmsg = error.details.map((el) => el.messsage).join(",");
//     throw new expresserror(400, errmsg);
//   } else {
//     next();
//   }
// };
// const reviewSchema = (req, res, next) => {
//   let { error } = reviewSchema.validate(req.body);
//   if (error) {
//     let errmsg = error.details.map((el) => el.messsage).join(",");
//     throw new expresserror(400, errmsg);
//   } else {
//     next();
//   }
// };

// crud -> 1.create route // Index route
app.get("/listings", async (req, res) => {
  const allListings = await Listing.find({});
  res.render("listings/index.ejs", { allListings });
});

// crud -> 1.create New route // Index route
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

// crud-> 2.read route all means read and created by create route from db// show route
app.get(
  "/listings/:id",
  wrapasync(async (req, res) => {
    let { id } = req.params;
    const listing = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { listing });
  })
);

// create or show the posted or new created data in new route
app.post(
  "/listings",
  wrapasync(async (req, res, next) => {
    const newlisting = new Listing(req.body.listing);
    await newlisting.save();
    res.redirect("/listings");
  })
);

// edit.js...
app.get("/listings/:id/edit", async (req, res) => {
  let { id } = req.params;
  const listing = await Listing.findById(id);
  res.render("listings/edit.ejs", { listing });
});

// app.use((req, res, next) => {
//   res.locals.success = req.flash("success");
//   res.locals.error = req.flash("error");
//   res.locals.currUser = req.user;
//   next();
// });

//  update the ejs
// app.put(
//   "/listings/:id",
//   validateListing,
//   wrapasync(async (req, res) => {
//     let { id } = req.params;
//     await Listing.findByIdAndUpdate(id, { ...req.body.listing });
//     res.redirect(`/listings/${id}`);
//   })
// );
app.put(
  "/listings/:id",

  wrapasync(async (req, res) => {
    let { id } = req.params;
    await Listing.findByIdAndUpdate(id, { ...req.body.listing });
    res.redirect(`/listings/${id}`);
  })
);

//Delete the route
app.delete("/listings/:id", async (req, res) => {
  let { id } = req.params;
  let deletedListing = await Listing.findByIdAndDelete(id);
  console.log(deletedListing);
  res.redirect("/listings");
});

//Reviews ?? route
app.post("/listings/:id/reviews", async (req, res) => {
  let listing = await Listing.findById(req.params.id);
  let newreview = new Review(req.body.review);

  listing.reviews.push(newreview);
  await newreview.save();
  await listing.save();

  console.log("new review has been saved");
  res.send("new review saved");
});
// app.get("/testlisten", async (req, res)=>{
// 	let samplelisting = new listing ({
// 		tittle: "om_vns",
// 		description: "By th Ganga shore" ,
// 		price:"10000",
// 		location: "varanasi, up",
// 		country:"india",
// 	});
// 	await samplelisting.save();
// 	console.log("sample was saved") ;
// 	res.send("response send");
// });

app.post("/submit-property", async (req, res) => {
  // Process form data here
  // After saving to DB or other logic
  res.redirect("/home");
});

app.get("/booking", (req, res) => {
  res.render("listings/booking.ejs");
});

app.listen(8080, () => {
  console.log("server is listening to port 8080");
});
