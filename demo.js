const { createHash } = require("node:crypto")

const input = "Hello Node.js crypto!"



// sha-256 digest in hexadecimal
const sha256Hex = createHash("sha256")
    .update(input)
    .digest("hex");
console.log("SHA-256 (HEX): ", sha256Hex)

// sha-256 digest in base64
const sha256Base64 = createHash("sha256")
    .update(input)
    .digest("base64");
console.log("SHA-256 (base64):", sha256Base64)



const md5Hex = createHash('md5')
    .update(input)
    .digest('hex');

console.log("MD5 (hex):",md5Hex);

