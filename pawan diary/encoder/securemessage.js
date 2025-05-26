const crypto = require('crypto');

// Function to encrypt message with a password
function encryptMessage(message, password) {
  // Generate a random salt
  const salt = crypto.randomBytes(16);
  // Derive a key using PBKDF2
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');
  // Generate a random IV
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-256-cbc', key, iv);
  let encrypted = cipher.update(message, 'utf8', 'hex');
  encrypted += cipher.final('hex');

  // Return salt + iv + encrypted data (all needed for decryption)
  return salt.toString('hex') + ':' + iv.toString('hex') + ':' + encrypted;
}

// Function to decrypt message with a password
function decryptMessage(encryptedData, password) {
  const parts = encryptedData.split(':');
  if (parts.length !== 3) {
    throw new Error('Invalid encrypted data');
  }

  const salt = Buffer.from(parts[0], 'hex');
  const iv = Buffer.from(parts[1], 'hex');
  const encrypted = parts[2];

  // Derive the same key using PBKDF2
  const key = crypto.pbkdf2Sync(password, salt, 100000, 32, 'sha256');

  const decipher = crypto.createDecipheriv('aes-256-cbc', key, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');

  return decrypted;
}

// Example usage:
const message = "Hello, this is a secret message!";
const password = "userPassword123";

const encrypted = encryptMessage(message, password);
console.log('Encrypted:', encrypted);

const decrypted = decryptMessage(encrypted, password);
console.log('Decrypted:', decrypted);