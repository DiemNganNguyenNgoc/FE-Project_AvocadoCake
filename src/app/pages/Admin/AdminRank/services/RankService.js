import { Rank } from "../models/Rank";
import {
  createRank,
  getAllRanks,
  getRankDetails,
  updateRank,
  deleteRank,
  getRankStatistics,
} from "../../../../api/services/RankService";

export class RankService {
  static async fetchAllRanks() {
    try {
      const response = await getAllRanks();
      if (response.status === "OK" && Array.isArray(response.data)) {
        return response.data.map((rank) => Rank.fromApiResponse(rank));
      }
      return [];
    } catch (error) {
      console.error("Error fetching ranks:", error);
      throw error;
    }
  }

  static async fetchRankById(id) {
    try {
      const accessToken = localStorage.getItem("access_token");
      const response = await getRankDetails(id, accessToken);
      if (response.status === "OK") {
        return Rank.fromApiResponse(response.data);
      }
      throw new Error(response.message || "Failed to fetch rank");
    } catch (error) {
      console.error("Error fetching rank:", error);
      throw error;
    }
  }

  static async createNewRank(rankData) {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await createRank(rankData, accessToken);
      if (response.status === "OK") {
        return Rank.fromApiResponse(response.data);
      }
      throw new Error(response.message || "Failed to create rank");
    } catch (error) {
      console.error("Error creating rank:", error);
      throw error;
    }
  }

  static async updateExistingRank(id, rankData) {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await updateRank(id, accessToken, rankData);
      if (response.status === "OK") {
        return Rank.fromApiResponse(response.data);
      }
      throw new Error(response.message || "Failed to update rank");
    } catch (error) {
      console.error("Error updating rank:", error);
      throw error;
    }
  }

  static async removeRank(id) {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await deleteRank(id, accessToken);
      if (response.status === "OK") {
        return true;
      }
      throw new Error(response.message || "Failed to delete rank");
    } catch (error) {
      console.error("Error deleting rank:", error);
      throw error;
    }
  }

  static async fetchRankStatistics() {
    try {
      const accessToken = localStorage.getItem("access_token");
      if (!accessToken) {
        throw new Error("Access token not found");
      }

      const response = await getRankStatistics(accessToken);
      if (response.status === "OK") {
        return response.data;
      }
      throw new Error(response.message || "Failed to fetch rank statistics");
    } catch (error) {
      console.error("Error fetching rank statistics:", error);
      throw error;
    }
  }
}
