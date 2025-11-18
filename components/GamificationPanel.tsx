import React, { useState, useMemo } from 'react';
import { AwardIcon, CheckIcon } from './Icons';
import { Button } from './common/FormElements';

interface GamificationPanelProps {
  content: string;
}

interface BadgeInfo {
    name: string;
    description: string;
}

interface ScoringCriterion {
    category: string;
    points: number;
}

const GamificationPanel: React.FC<GamificationPanelProps> = ({ content }) => {
  const [awardedCriteria, setAwardedCriteria] = useState<Set<string>>(new Set());
  const [isComplete, setIsComplete] = useState(false);

  const { totalPossiblePoints, badge, scoringCriteria } = useMemo(() => {
    const pointsMatch = content.match(/(?:totaling|total of|Total:)\s*(\d+)\s*points/i);
    const totalPoints = pointsMatch ? parseInt(pointsMatch[1], 10) : 0;

    const badgeNameMatch = content.match(/\*\*Badge Unlocked:\*\* \*\*(.*?)\*\*/);
    let badgeInfo: BadgeInfo | null = null;
    if (badgeNameMatch) {
        const name = badgeNameMatch[1];
        const descriptionMatch = content.split(badgeNameMatch[0])[1];
        const description = descriptionMatch ? descriptionMatch.trim().replace(/^- /,'').split('\n')[0] : "Great work on this exercise!";
        badgeInfo = { name, description };
    }
    
    const newScoringCriteria: ScoringCriterion[] = [];
    const pointSystemMatch = content.match(/\*\*Point System:\*\*(.*)/i);
    if (pointSystemMatch) {
        let criteriaText = pointSystemMatch[1]
            .replace(/\(e\.g\.,(.*?)\)/i, '$1')
            .replace(/,?\s*totaling.*$/i, '')
            .replace(/etc\./i, '')
            .trim();

        const criteriaParts = criteriaText.split(/,|\sand\s/);

        for (const part of criteriaParts) {
            if (!part) continue;
            const criterionMatch = part.match(/(.*?)(?:\s*\(|\s*:)?\s*(\d+)\s*p(?:oin)?ts?/i);
            if (criterionMatch) {
                newScoringCriteria.push({
                    category: criterionMatch[1].trim(),
                    points: parseInt(criterionMatch[2], 10),
                });
            }
        }
    }

    if (newScoringCriteria.length === 0 && totalPoints > 0) {
        newScoringCriteria.push({ category: 'Exercise Completion', points: totalPoints });
    }

    const calculatedTotal = newScoringCriteria.reduce((sum, item) => sum + item.points, 0);

    return { 
        totalPossiblePoints: calculatedTotal > 0 ? calculatedTotal : totalPoints, 
        badge: badgeInfo, 
        scoringCriteria: newScoringCriteria 
    };
  }, [content]);

  const totalAwardedPoints = useMemo(() => {
    return scoringCriteria.reduce((total, criterion) => {
        if (awardedCriteria.has(criterion.category)) {
            return total + criterion.points;
        }
        return total;
    }, 0);
  }, [awardedCriteria, scoringCriteria]);
  
  const handleToggleCriterion = (category: string) => {
    if (isComplete) return;
    const newAwarded = new Set(awardedCriteria);
    if (newAwarded.has(category)) {
        newAwarded.delete(category);
    } else {
        newAwarded.add(category);
    }
    setAwardedCriteria(newAwarded);
  };

  const handleFinalizeAwards = () => {
    setIsComplete(true);
  };

  const badgeUnlocked = isComplete && totalAwardedPoints >= totalPossiblePoints * 0.8 && totalPossiblePoints > 0;

  if (scoringCriteria.length === 0 && !badge) {
    return null;
  }

  return (
    <div className="mt-6 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md">
      <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Rewards & Scoring</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Scoring Rubric */}
        {scoringCriteria.length > 0 && (
            <fieldset>
                <legend className="text-lg font-medium text-gray-900 dark:text-white mb-2">Interactive Rubric</legend>
                <div className="space-y-3 rounded-lg bg-gray-50 dark:bg-gray-900/50 p-4 border border-gray-200 dark:border-gray-700">
                    {scoringCriteria.map((criterion) => (
                        <div key={criterion.category} className="relative flex items-start">
                            <div className="flex items-center h-5">
                                <input
                                    id={criterion.category}
                                    name="scoring"
                                    type="checkbox"
                                    checked={awardedCriteria.has(criterion.category)}
                                    onChange={() => handleToggleCriterion(criterion.category)}
                                    disabled={isComplete}
                                    className="focus:ring-indigo-500 h-4 w-4 text-indigo-600 border-gray-300 dark:border-gray-600 rounded disabled:opacity-70"
                                />
                            </div>
                            <div className="ml-3 text-sm flex-grow">
                                <label htmlFor={criterion.category} className={`font-medium text-gray-700 dark:text-gray-300 ${isComplete ? 'cursor-default' : 'cursor-pointer'}`}>
                                    {criterion.category}
                                </label>
                            </div>
                            <div className="text-sm font-semibold text-indigo-600 dark:text-indigo-400">
                                {criterion.points} pts
                            </div>
                        </div>
                    ))}
                </div>
            </fieldset>
        )}

        {/* Results & Badge */}
        <div>
            <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Results</h4>
            <div className="space-y-4">
                {totalPossiblePoints > 0 && (
                     <div className={`p-4 rounded-lg flex items-center transition-all duration-300 ${isComplete ? 'bg-indigo-50 dark:bg-indigo-900/30' : 'bg-gray-100 dark:bg-gray-900/50'}`}>
                        <div className="flex-shrink-0">
                            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Score</p>
                            <p className="text-2xl font-bold text-gray-900 dark:text-white">
                                {totalAwardedPoints} <span className="text-lg font-medium text-gray-500 dark:text-gray-400">/ {totalPossiblePoints}</span>
                            </p>
                        </div>
                     </div>
                )}
                {badge && (
                    <div className="p-4 bg-gray-100 dark:bg-gray-900/50 rounded-lg flex items-start">
                        <div className={`flex-shrink-0 transition-all duration-500 ${!badgeUnlocked ? 'grayscale opacity-60' : ''}`}>
                            <AwardIcon className="h-12 w-12 text-yellow-500" />
                        </div>
                        <div className="ml-4">
                            <p className={`font-bold ${badgeUnlocked ? 'text-yellow-600 dark:text-yellow-400' : 'text-gray-800 dark:text-gray-200'}`}>
                                {badgeUnlocked ? 'Badge Unlocked!' : badge.name}
                            </p>
                            <p className="text-sm text-gray-600 dark:text-gray-400">
                                {badgeUnlocked ? badge.name : badge.description}
                            </p>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700 flex justify-end">
        {!isComplete ? (
          <Button onClick={handleFinalizeAwards} disabled={scoringCriteria.length === 0}>
            Finalize Awards
          </Button>
        ) : (
          <div className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-green-700 bg-green-100 dark:bg-green-900 dark:text-green-200">
            <CheckIcon className="h-5 w-5 mr-2" />
            <span>Awards Granted!</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default GamificationPanel;
