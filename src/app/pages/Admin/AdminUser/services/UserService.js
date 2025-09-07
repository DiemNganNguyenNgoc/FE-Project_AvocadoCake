import * as BaseUserService from "../../../../api/services/UserService";

class UserService {
  // Get all users
  static async getAllUsers() {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await BaseUserService.getAllUser(accessToken);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch users: ${error.message}`);
    }
  }

  // Get user by ID
  static async getUserById(id) {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await BaseUserService.getDetailsUser(id, accessToken);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch user: ${error.message}`);
    }
  }

  // Create new user
  static async createUser(userData) {
    try {
      const response = await BaseUserService.signupUser(userData);
      return response;
    } catch (error) {
      throw new Error(`Failed to create user: ${error.message}`);
    }
  }

  // Update user
  static async updateUser(id, userData) {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await BaseUserService.updateUserInfo(
        id,
        userData,
        accessToken
      );
      return response;
    } catch (error) {
      throw new Error(`Failed to update user: ${error.message}`);
    }
  }

  // Delete user
  static async deleteUser(id) {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await BaseUserService.deleteUser(id, accessToken);
      return response;
    } catch (error) {
      throw new Error(`Failed to delete user: ${error.message}`);
    }
  }

  // Delete multiple users
  static async deleteMultipleUsers(ids) {
    try {
      const accessToken = localStorage.getItem("access_token");
      const deletePromises = ids.map((id) =>
        BaseUserService.deleteUser(id, accessToken)
      );
      await Promise.all(deletePromises);
      return { success: true, message: "Users deleted successfully" };
    } catch (error) {
      throw new Error(`Failed to delete users: ${error.message}`);
    }
  }

  // Get user assets (coins)
  static async getUserAssets() {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await BaseUserService.getUserAssets(accessToken);
      return response;
    } catch (error) {
      throw new Error(`Failed to fetch user assets: ${error.message}`);
    }
  }

  // Check user coins
  static async checkUserCoins() {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await BaseUserService.checkUserCoins(accessToken);
      return response;
    } catch (error) {
      throw new Error(`Failed to check user coins: ${error.message}`);
    }
  }
}

export default UserService;
