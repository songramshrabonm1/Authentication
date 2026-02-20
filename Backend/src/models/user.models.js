const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const UserSchema = new mongoose.Schema(
  {
    userName: {
      type: String,
      lowercase: [true, "UserName Must Be Lowercase"],
      trim: true,
      maxlength: [18, "UserName Must Be Less than 18 character"],
      unique: [true, "UserName Must Be Unique"],
      required: [true, "UserName Must Be Required"],
    },
    email: {
      type: String,
      unique: [true, "Email Must Be Unique"],
      lowercase: true,
      match: [/^\S+@\S+\.\S+$/, "Provide Authentic Email"],
      required: true,
    },
    password: {
      type: String,
      select: false,
      required: true,
    },
    image: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ["user", "Admin", "Rider"],
      required: true,
    },
    mobile: {
      type: String,
      minlength: [
        11,
        "Mobile Number Must be 11 character And Startwith 01....",
      ],
      maxlength: [
        11,
        "Mobile Number Must be 11 Character Present and startwith 01...",
      ],
      required: true,
    },
    otp: {
      type: String,
      default: null,
      minlength: 6,
      maxlength: 6,
    },
    isExpired: {
      type: Boolean,
      default: true,
    },
    otpVerified: {
      type: Boolean,
      default: false,
    },
    otpTime: {
      type: Date,
      default : ()=> new Date(Date.now() + 5 * 60 * 1000)  //timeime calculate / custom logicdefault: () => Date.now() + ...
      // default: null,
    },
    RefreshToken: [
      {
        token: {
          type: String,
          required: true,
        },
        createAt: {
          type: Date,
          default: Date.now, //শুধু current time দরকার	default: Date.now
        },
        expireAt: {
          type: Date,
          default: null,
        },
      },
    ],
  },
  { timestamps: true },
);

/*
এই middleware টা কাজ করবে যখন user signup করবে আর সে যখন একটা password দিবে
তখন যেন password টা Database এ plaintext হিসেবে না save হয়ে hashpassword হিসেবে save হয় । 
*/
UserSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next;
  }
  const salt = await bcrypt.genSalt(Number(process.env.SaltNumber));
  /* 
  এখানে Saltnumber টাকে Number এ convert করে দিতে হবে। 
  কারণ এইটা .env file থেকে string আকারে আসে।
  */
  const hashPassword = await bcrypt.hash(this.password, salt);
  this.password = hashPassword;
});

/* 
এই method টা আমরা use করব login করার সময়। যখন hash password 
আর user এর দেওয়া password টা same কিনা তা check করব। 
*/
UserSchema.methods.comparePassword = async function(enterPassword){
    return await bcrypt.compare(enterPassword, this.password); 
}
const UserModel = mongoose.model("users", UserSchema);
module.exports = UserModel;
