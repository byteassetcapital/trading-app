-- Add tier_code column to user_profiles table
-- This column stores the selected subscription tier (A1, A2, A3, or A4)

ALTER TABLE user_profiles 
ADD COLUMN IF NOT EXISTS tier_code VARCHAR(10);

-- Add comment for documentation
COMMENT ON COLUMN user_profiles.tier_code IS 'Autonomous plan tier code (A1, A2, A3, or A4)';

-- Create index for faster queries on tier_code
CREATE INDEX IF NOT EXISTS idx_user_profiles_tier_code ON user_profiles(tier_code);
