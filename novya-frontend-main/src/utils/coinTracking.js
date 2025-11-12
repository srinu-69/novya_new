import { djangoAPI, API_CONFIG } from '../config/api';

/**
 * Coin/Rewards Tracking Utility
 * Handles all coin transactions (earn/spend) and balance operations
 */

/**
 * Add coins to user's balance
 * @param {number} coins - Number of coins to add
 * @param {string} source - Source of coins ('login', 'quiz', 'mock_test', 'spin_wheel', etc.)
 * @param {string} reason - Optional reason/description
 * @param {number} referenceId - Optional reference ID (e.g., quiz_attempt_id)
 * @param {string} referenceType - Optional reference type (e.g., 'quiz_attempt')
 * @param {object} metadata - Optional metadata (e.g., quiz score, spin wheel result)
 */
export const addCoins = async (coins, source, reason = '', referenceId = null, referenceType = null, metadata = null) => {
  try {
    console.log(`💰 Adding ${coins} coins from source: ${source}`);
    console.log(`📊 Coin value type: ${typeof coins}, value: ${coins}`);
    
    // Ensure coins is a number (not string)
    const coinsValue = typeof coins === 'string' ? parseInt(coins) : coins;
    
    // Check if token exists
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.error('❌ No authentication token found! Cannot add coins.');
      throw new Error('Authentication required. Please log in again.');
    }
    console.log('🔑 Token found:', token.substring(0, 20) + '...');
    
    // Prepare request data - build object conditionally
    const requestData = {
      coins: coinsValue,  // Use parsed number
      source
    };
    
    // Add optional fields only if they have values
    if (reason) {
      requestData.reason = reason;
    }
    if (referenceId !== null && referenceId !== undefined) {
      requestData.reference_id = referenceId;
    }
    if (referenceType !== null && referenceType !== undefined && referenceType !== '') {
      requestData.reference_type = referenceType;
    }
    if (metadata !== null && metadata !== undefined) {
      requestData.metadata = metadata;
    }
    
    console.log(`📋 Request data (before sending):`, requestData);
    console.log(`📋 Coins value in request: ${requestData.coins} (type: ${typeof requestData.coins})`);
    
    const response = await djangoAPI.post(API_CONFIG.DJANGO.AUTH.ADD_COINS, requestData);
    
    console.log('✅ Coins added successfully:', response);
    
    // Verify response structure
    if (!response || !response.balance) {
      console.error('❌ Invalid response structure:', response);
      throw new Error('Invalid response from server');
    }
    
    // Save to reward history in localStorage
    try {
      const historyEntry = {
        id: `reward_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        points: coins,
        totalPoints: response.balance.total_coins || 0,
        reason: reason || `${source} reward`,
        source: source,
        timestamp: new Date().toISOString()
      };
      
      const existingHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
      const updatedHistory = [historyEntry, ...existingHistory];
      // Keep only last 100 entries to avoid localStorage bloat
      const trimmedHistory = updatedHistory.slice(0, 100);
      localStorage.setItem('rewardsHistory', JSON.stringify(trimmedHistory));
      
      // Dispatch event to update Navbarrr
      window.dispatchEvent(new StorageEvent('storage', {
        key: 'rewardsHistory',
        newValue: JSON.stringify(trimmedHistory),
        oldValue: JSON.stringify(existingHistory)
      }));
      
      console.log('✅ Reward history saved:', historyEntry);
    } catch (historyError) {
      console.error('❌ Error saving reward history:', historyError);
      // Don't throw - history is optional, coins are already added
    }
    
    return response;
  } catch (error) {
    console.error('❌ Error adding coins:', error);
    console.error('❌ Error details:', {
      message: error.message,
      stack: error.stack,
      response: error.response
    });
    throw error;
  }
};

/**
 * Get current coin balance for the authenticated user (USER-SPECIFIC)
 */
export const getCoinBalance = async () => {
  try {
    console.log('🔍 Fetching coin balance from database (user-specific)...');
    // This API call is authenticated - returns balance for logged-in user only
    const response = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.GET_COIN_BALANCE);
    console.log('✅ Coin balance fetched (user-specific):', response);
    
    // Sync: If localStorage has coins but database shows 0, sync localStorage to database
    const databaseCoins = response?.balance?.total_coins ?? 0;
    const localStorageCoins = parseInt(localStorage.getItem('rewardPoints') || '0', 10);

    // Database is the source of truth: always mirror it locally
    if (Number.isFinite(databaseCoins)) {
      if (localStorageCoins !== databaseCoins) {
        localStorage.setItem('rewardPoints', Number(databaseCoins).toString());
        window.dispatchEvent(new CustomEvent('rewardPointsUpdated', {
          detail: { rewardPoints: Number(databaseCoins) }
        }));
        console.log(`✅ Synced local rewardPoints with database: ${localStorageCoins} → ${databaseCoins}`);
      }
    }

    return response;
  } catch (error) {
    console.error('❌ Error fetching coin balance (user-specific):', error);
    throw error;
  }
};

/**
 * Get coin transaction history for the authenticated user (USER-SPECIFIC)
 * @param {number} limit - Number of transactions to fetch (default: 50)
 * @param {number} offset - Offset for pagination (default: 0)
 */
export const getCoinTransactions = async (limit = 50, offset = 0) => {
  try {
    console.log('🔍 Fetching coin transactions from database (user-specific)...');
    // This API call is authenticated - returns transactions for logged-in user only
    const url = `${API_CONFIG.DJANGO.AUTH.GET_COIN_TRANSACTIONS}?limit=${limit}&offset=${offset}`;
    const response = await djangoAPI.get(url);
    console.log('✅ Coin transactions fetched (user-specific):', response);
    return response;
  } catch (error) {
    console.error('❌ Error fetching coin transactions (user-specific):', error);
    throw error;
  }
};

/**
 * Helper function to add coins for quiz completion
 * @param {number} score - Quiz score
 * @param {number} totalQuestions - Total questions in quiz
 * @param {object} quizData - Quiz data object (optional, for reference)
 */
export const addCoinsForQuiz = async (score, totalQuestions, quizData = null) => {
  const coinsToAdd = Math.floor(score * 2); // 2 coins per correct answer
  const reason = `Quiz completed: ${score}/${totalQuestions} correct answers`;
  
  try {
    return await addCoins(
      coinsToAdd,
      'quiz',
      reason,
      quizData?.id || null,
      'quiz_attempt',
      {
        score,
        totalQuestions,
        correctAnswers: score,
        class: quizData?.className || quizData?.class_name,
        subject: quizData?.subject,
        topic: quizData?.subtopic || quizData?.topic
      }
    );
  } catch (error) {
    console.error('❌ Error adding coins for quiz:', error);
    return null;
  }
};

/**
 * Helper function to add coins for mock test completion
 * Uses the same logic as MockTest.jsx:
 * - Below 20: 0 coins
 * - 20-39: 1 coin per mark
 * - 40-50: 1 coin per mark + 10 bonus
 * @param {number} score - Mock test score
 * @param {number} totalQuestions - Total questions in mock test
 * @param {object} mockTestData - Mock test data object (optional, for reference)
 */
export const addCoinsForMockTest = async (score, totalQuestions, mockTestData = null) => {
  let basePoints = 0;
  let bonusPoints = 0;
  let coinsToAdd = 0;
  
  // Calculate coins based on new logic (same as MockTest.jsx)
  if (score < 20) {
    // Below 20: 0 coins
    coinsToAdd = 0;
  } else if (score >= 20 && score <= 39) {
    // 20-39: 1 coin per mark
    basePoints = score;
    coinsToAdd = score;
  } else if (score >= 40 && score <= 50) {
    // 40-50: 1 coin per mark + 10 bonus
    basePoints = score;
    bonusPoints = 10;
    coinsToAdd = score + 10;
  }
  
  const reason = `Mock test completed: ${score}/${totalQuestions} correct answers`;
  
  // Only add coins if score qualifies (coinsToAdd > 0)
  if (coinsToAdd === 0) {
    console.log(`ℹ️ Mock test score ${score}/${totalQuestions} is below 20, no coins awarded`);
    return null;
  }
  
  try {
    return await addCoins(
      coinsToAdd,
      'mock_test',
      reason,
      mockTestData?.id || null,
      'mock_test_attempt',
      {
        score,
        totalQuestions,
        correctAnswers: score,
        basePoints,
        bonusPoints,
        totalPoints: coinsToAdd,
        class: mockTestData?.className || mockTestData?.class_name,
        subject: mockTestData?.subject,
        chapter: mockTestData?.chapter
      }
    );
  } catch (error) {
    console.error('❌ Error adding coins for mock test:', error);
    return null;
  }
};

/**
 * Check if daily login reward was already given today (from database)
 */
export const checkDailyLoginReward = async () => {
  try {
    console.log('🔍 Checking if daily login reward was already given today...');
    const response = await djangoAPI.get(API_CONFIG.DJANGO.AUTH.CHECK_DAILY_LOGIN_REWARD);
    console.log('✅ Daily login reward check result:', response);
    return response.has_reward_today || false;
  } catch (error) {
    console.error('❌ Error checking daily login reward:', error);
    // If check fails, return false to allow reward (safer than blocking)
    return false;
  }
};

/**
 * Helper function to add coins for daily login
 * NOTE: This should only be called if checkDailyLoginReward() returns false
 */
export const addCoinsForLogin = async () => {
  try {
    return await addCoins(5, 'login', 'Daily login reward', null, null, {
      date: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('❌ Error adding coins for login:', error);
    return null;
  }
};

/**
 * Helper function to add coins for spin wheel
 * @param {number} coinsWon - Coins won from spin wheel
 * @param {object} spinResult - Spin wheel result data
 */
export const addCoinsForSpinWheel = async (coinsWon, spinResult = null) => {
  try {
    return await addCoins(
      coinsWon,
      'spin_wheel',
      `Spin wheel reward: ${coinsWon} coins`,
      null,  // reference_id - null for spin wheel
      null,  // reference_type - null for spin wheel (explicitly null, not empty string)
      spinResult  // metadata
    );
  } catch (error) {
    console.error('❌ Error adding coins for spin wheel:', error);
    return null;
  }
};

/**
 * Check if video watching reward was already given for a specific video (from database)
 */
export const checkVideoWatchingReward = async (className, subject, chapter, subtopic = '') => {
  try {
    console.log('🔍 Checking if video watching reward was already given...');
    const videoIdentifier = `${className}_${subject}_${chapter}_${subtopic || 'main'}`;
    const params = new URLSearchParams({
      class_name: className,
      subject: subject,
      chapter: chapter,
      ...(subtopic && { subtopic: subtopic })
    });
    const response = await djangoAPI.get(`${API_CONFIG.DJANGO.AUTH.CHECK_VIDEO_REWARD}?${params.toString()}`);
    console.log('✅ Video watching reward check result:', response);
    return response.has_reward || false;
  } catch (error) {
    console.error('❌ Error checking video watching reward:', error);
    // If check fails, return false to allow reward (safer than blocking)
    return false;
  }
};

/**
 * Helper function to add coins for video watching (without skipping)
 * NOTE: This should only be called if checkVideoWatchingReward() returns false
 */
export const addCoinsForVideoWatching = async (className, subject, chapter, subtopic = '') => {
  try {
    const videoIdentifier = `${className}_${subject}_${chapter}_${subtopic || 'main'}`;
    const reason = `Video watched without skipping: ${videoIdentifier}`;
    return await addCoins(10, 'video_watching', reason, null, 'video_watching', {
      class_name: className,
      subject: subject,
      chapter: chapter,
      subtopic: subtopic || 'main',
      video_identifier: videoIdentifier,
      date: new Date().toISOString().split('T')[0]
    });
  } catch (error) {
    console.error('❌ Error adding coins for video watching:', error);
    return null;
  }
};

/**
 * Sync existing localStorage coins to database (migration function)
 * This function checks if localStorage has more coins than database and syncs them
 * @returns {Promise<object|null>} - Returns sync result or null if not needed
 */
export const syncLocalStorageCoinsToDatabase = async () => {
  try {
    // Check if user is authenticated
    const token = localStorage.getItem('userToken');
    if (!token) {
      console.log('ℹ️ User not authenticated, skipping coin sync');
      return null;
    }

    // Get localStorage coins
    const localStorageCoins = parseInt(localStorage.getItem('rewardPoints') || '0');
    if (localStorageCoins <= 0) {
      console.log('ℹ️ No coins in localStorage to sync');
      return null;
    }

    // Get database balance
    let databaseCoins = 0;
    try {
      const balanceResponse = await getCoinBalance();
      if (balanceResponse && balanceResponse.balance) {
        databaseCoins = balanceResponse.balance.total_coins || 0;
      }
    } catch (error) {
      console.error('❌ Error getting database balance for sync:', error);
      return null;
    }

    // Calculate difference
    const coinsToSync = localStorageCoins - databaseCoins;
    if (coinsToSync <= 0) {
      console.log('ℹ️ Database already has equal or more coins. No sync needed.');
      return null;
    }

    console.log(`🔄 Syncing ${coinsToSync} coins from localStorage to database...`);
    console.log(`   LocalStorage: ${localStorageCoins}, Database: ${databaseCoins}, Difference: ${coinsToSync}`);

    // Try to get coin history from localStorage to create proper transactions
    const rewardsHistory = JSON.parse(localStorage.getItem('rewardsHistory') || '[]');
    
    // If we have history, sync each transaction
    if (rewardsHistory.length > 0) {
      let syncedTotal = 0;
      // Sync transactions from history (most recent first)
      for (const reward of rewardsHistory.reverse()) {
        if (reward.points > 0 && reward.source) {
          try {
            // Check if this transaction already exists in database by checking recent transactions
            const transactions = await getCoinTransactions(100, 0);
            const exists = transactions.transactions?.some(t => 
              t.source === reward.source && 
              t.reason === reward.reason &&
              Math.abs(new Date(t.created_at) - new Date(reward.timestamp)) < 60000 // Within 1 minute
            );

            if (!exists) {
              await addCoins(
                reward.points,
                reward.source,
                reward.reason || `Migrated from localStorage: ${reward.source}`,
                null,
                null,
                {
                  migrated: true,
                  original_timestamp: reward.timestamp,
                  original_id: reward.id
                }
              );
              syncedTotal += reward.points;
              console.log(`✅ Synced transaction: ${reward.points} coins from ${reward.source}`);
            }
          } catch (error) {
            console.error(`❌ Error syncing transaction ${reward.id}:`, error);
          }
        }
      }

      // If still some coins left (history might not cover everything)
      const remainingCoins = coinsToSync - syncedTotal;
      if (remainingCoins > 0) {
        console.log(`📦 Syncing remaining ${remainingCoins} coins as bulk migration...`);
        await addCoins(
          remainingCoins,
          'migration',
          'Migrated from localStorage (bulk sync)',
          null,
          null,
          {
            migrated: true,
            migration_date: new Date().toISOString(),
            original_localStorage_balance: localStorageCoins
          }
        );
      }
    } else {
      // No history, just sync the difference as a single migration transaction
      console.log(`📦 Syncing ${coinsToSync} coins as bulk migration (no history available)...`);
      await addCoins(
        coinsToSync,
        'migration',
        'Migrated from localStorage (initial sync)',
        null,
        null,
        {
          migrated: true,
          migration_date: new Date().toISOString(),
          original_localStorage_balance: localStorageCoins
        }
      );
    }

    // Get updated balance
    const updatedBalance = await getCoinBalance();
    if (updatedBalance && updatedBalance.balance) {
      const newBalance = updatedBalance.balance.total_coins || 0;
      // Update localStorage with database balance (source of truth)
      localStorage.setItem('rewardPoints', newBalance.toString());
      console.log(`✅ Coin sync complete! New database balance: ${newBalance}`);
      return {
        synced: true,
        coinsSynced: coinsToSync,
        newBalance: newBalance
      };
    }

    return null;
  } catch (error) {
    console.error('❌ Error syncing localStorage coins to database:', error);
    return null;
  }
};

