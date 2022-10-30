const crypto = require("crypto");

const randomId = () => {
  return crypto.randomBytes(8).toString("hex");
};

//Checking the crypto module
const algorithm = "aes-256-cbc"; //Using AES encryption
const key = crypto.randomBytes(32);
const iv = crypto.randomBytes(16);

//Encrypting text
function encrypt(text) {
  try {
    let cipher = crypto.createCipheriv("aes-256-cbc", Buffer.from(key), iv);
    let encrypted = cipher.update(text);
    encrypted = Buffer.concat([encrypted, cipher.final()]);
    console.log(encrypted.toString("hex"));
    // console.log(cipher.final().toString("hex"));
    return encrypted.toString("hex");
  } catch (err) {
    console.log(err);
    return "error";
  }
}

// Decrypting text
function decrypt(text) {
  // encrypt("3");
  try {
    let encryptedText = Buffer.from(text, "hex");
    let decipher = crypto.createDecipheriv("aes-256-cbc", Buffer.from(key), iv);
    let decrypted = decipher.update(encryptedText);
    decrypted = Buffer.concat([decrypted, decipher.final()]);
    return decrypted.toString();
  } catch (err) {
    console.log(err);
    return "error";
  }
}

// Text send to encrypt function
// var hw = encrypt("1");

module.exports = { randomId, encrypt, decrypt };
