import Equipment from '../models/Equipment.js';
import RentalRequest from '../models/RentalRequest.js';

/**
 * FarmShare AI Smart Recommendation Engine
 * Analyzes user location, past rental history, machine ratings, pricing, and search context
 * Provides explainable recommendation reasons for full AI UI transparency.
 */
export const getSmartRecommendations = async (userId, userLocation = {}, searchContext = '') => {
  try {
    // 1. Fetch user's previous rental categories to understand preference
    let preferredCategories = [];
    if (userId) {
      const pastRentals = await RentalRequest.find({ renter: userId })
        .populate('equipment', 'category')
        .limit(10);
      
      const categoryCounts = {};
      pastRentals.forEach((r) => {
        if (r.equipment && r.equipment.category) {
          categoryCounts[r.equipment.category] = (categoryCounts[r.equipment.category] || 0) + 1;
        }
      });
      preferredCategories = Object.keys(categoryCounts).sort(
        (a, b) => categoryCounts[b] - categoryCounts[a]
      );
    }

    // 2. Query available equipment
    const allEquipment = await Equipment.find({ isAvailable: true })
      .populate('owner', 'name phone location profileImage')
      .sort({ createdAt: -1 })
      .limit(30);

    if (!allEquipment.length) {
      return [];
    }

    // 3. Score equipment based on multi-factor heuristics
    const scoredList = allEquipment.map((eq) => {
      let score = 50; // base score
      let matchReason = 'Popular high-demand machine on FarmShare AI';

      // Location match
      const userCity = (userLocation.city || '').toLowerCase();
      const eqCity = (eq.city || '').toLowerCase();
      const userState = (userLocation.state || '').toLowerCase();
      const eqState = (eq.state || '').toLowerCase();

      if (userCity && eqCity && userCity === eqCity) {
        score += 35;
        matchReason = `Available nearby in your city (${eq.city})`;
      } else if (userState && eqState && userState === eqState) {
        score += 15;
        matchReason = `Located in your state (${eq.state})`;
      }

      // Past category match
      if (preferredCategories.includes(eq.category)) {
        score += 25;
        matchReason = `Matches your frequently rented category (${eq.category})`;
      }

      // Search context match
      if (searchContext) {
        const query = searchContext.toLowerCase();
        if (
          eq.equipmentName.toLowerCase().includes(query) ||
          eq.category.toLowerCase().includes(query) ||
          eq.brand.toLowerCase().includes(query)
        ) {
          score += 40;
          matchReason = `Direct match for your search for "${searchContext}"`;
        }
      }

      // Rating bonus
      if (eq.rating >= 4.5) {
        score += 10;
        if (!matchReason.includes('nearby') && !matchReason.includes('search')) {
          matchReason = `Top rated machinery (${eq.rating} ★) with high reliability`;
        }
      }

      // Rental velocity bonus
      if (eq.totalRentals > 3) {
        score += 8;
      }

      return {
        ...eq.toObject(),
        aiScore: score,
        aiReason: matchReason
      };
    });

    // Sort by AI score descending
    scoredList.sort((a, b) => b.aiScore - a.aiScore);

    // Return top 6 recommendations
    return scoredList.slice(0, 6);
  } catch (error) {
    console.error('AI Recommendation Engine Error:', error.message);
    return [];
  }
};
