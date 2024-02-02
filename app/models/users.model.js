
module.exports = mongoose => {
    var schema = mongoose.Schema(
      {
        username: {
          type: String,
          unique: [true, "Username already exists"],
          required: [true, "Please provide a username"],
          trim: true,
        },
        phone_number: {
          type: Number,
          required: [true, 'please provide a phone number'],
          min: [10 , 'phonu number should be 10 digits'],
          trim:true
        },
        email: {
          type: String,
          unique: [true, 'Email already exist'],
          required: [true,'Please provide a email'],
          lowercase: true,
          trim: true,
        },
        password: {
          type: String,
          minlength: [6,'Password should be minimum 6 letter'],
          trim: true,
          required:[true , "Please provide password"]
        },
        profileImage:{
          type:String,
          required:true
        }
      },
      { timestamps: true }
    );
  
    const User = mongoose.model("User", schema);
    return User;
  };