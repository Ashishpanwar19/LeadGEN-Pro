import React from 'react';

interface ScoreIndicatorProps {
  score: number;
}

export const ScoreIndicator: React.FC<ScoreIndicatorProps> = ({ score }) => {
  const getScoreClass = (score: number) => {
    if (score >= 80) return 'score-excellent';
    if (score >= 60) return 'score-good';
    if (score >= 40) return 'score-fair';
    return 'score-poor';
  };

  const getScoreText = (score: number) => {
    if (score >= 80) return 'Excellent';
    if (score >= 60) return 'Good';
    if (score >= 40) return 'Fair';
    return 'Poor';
  };

  return (
    <div className="flex items-center space-x-2">
      <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden shadow-inner">
        <div
          className={`h-full ${getScoreClass(score)} transition-all duration-500 ease-out`}
          style={{ width: `${score}%` }}
        />
      </div>
      <span className="text-xs text-gray-600">{getScoreText(score)}</span>
    </div>
  );
};