import bcrypt from "bcrypt";
import { randomString } from "./stringHelpers";

/**
 * Generates a random salt for a password
 *
 * @return The random salt
 */
export function generateSalt() {
	return bcrypt.genSaltSync(10);
}

/**
 * Generates a random password
 *
 * @return The password
 */
export function generateRandomPassword() {
	return randomString(16);
}

/**
 * Hashes the password ready for use in the database
 *
 * @param {string} salt The salt
 * @param {string} password The password that the user gave
 * @return The hashed password
 */
export function hashPassword(salt, password) {
	return bcrypt.hashSync(password, salt);
}

/**
 * Checks if the password is valid with the salt
 *
 * @param {string} password The password that the user gave
 * @param {string} hashedPassword The password in the users account
 * @return If the password is valid or not
 */
export function isValidPassword(password, hashedPassword) {
	return bcrypt.compareSync(password, hashedPassword);
}
