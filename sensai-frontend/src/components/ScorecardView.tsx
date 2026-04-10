import React, { useState } from 'react';
import { ChevronLeft, ChevronDown, ChevronUp } from 'lucide-react';
import { ChatMessage, ScorecardItem } from '../types/quiz';
import LearnerScorecard from './LearnerScorecard';

interface ScorecardViewProps {
    activeScorecard: ScorecardItem[];
    historicalScorecards?: ScorecardItem[][];
    handleBackToChat: () => void;
    lastUserMessage: ChatMessage | null;
}

const ScorecardView: React.FC<ScorecardViewProps> = ({
    activeScorecard,
    historicalScorecards = [],
    handleBackToChat,
    lastUserMessage,
}) => {
    const [isTextExpanded, setIsTextExpanded] = useState(false);
    
    // Default to the last submission (most recent) if available
    const [selectedVersion, setSelectedVersion] = useState<number>(
        historicalScorecards && historicalScorecards.length > 0 ? historicalScorecards.length - 1 : 0
    );

    const toggleTextExpansion = () => {
        setIsTextExpanded(!isTextExpanded);
    };

    // Determine which scorecard to show
    const displayScorecard = historicalScorecards && historicalScorecards.length > 0 && selectedVersion >= 0 && selectedVersion < historicalScorecards.length
        ? historicalScorecards[selectedVersion]
        : activeScorecard;

    return (
        <div className="flex flex-col h-full px-6 py-6 overflow-auto relative">
            <button
                onClick={handleBackToChat}
                className="inline-flex cursor-pointer justify-center items-center rounded-full w-10 h-10 focus:outline-none mb-4 bg-gray-100 text-gray-700 hover:bg-gray-200 dark:bg-[#1D1D1D] dark:text-white dark:hover:bg-[#2A2A2A]"
            >
                <ChevronLeft size={24} />
            </button>

            <div className="overflow-y-auto hide-scrollbar h-full pt-2">
                <div className="flex flex-col mb-6">
                    <div className="text-center">
                        {lastUserMessage ? (
                            lastUserMessage.messageType === 'audio' && lastUserMessage.audioData ? (
                                <div className="flex flex-col items-center">
                                    <audio
                                        controls
                                        className="w-full sm:w-3/4 mt-2"
                                        src={`data:audio/wav;base64,${lastUserMessage.audioData}`}
                                    />
                                </div>
                            ) : (
                                <div className="relative">
                                    <div className="max-w-lg mx-auto">
                                        <p className={`text-sm text-left ${!isTextExpanded ? 'line-clamp-2' : ''} text-gray-700 dark:text-gray-300`}>
                                            {lastUserMessage.content}
                                        </p>
                                        {lastUserMessage.content && lastUserMessage.content.length > 80 && (
                                            <button
                                                onClick={toggleTextExpansion}
                                                className="mt-4 px-3 py-1.5 text-sm rounded-full transition-colors flex items-center cursor-pointer mx-auto bg-gray-100 text-gray-800 hover:bg-gray-200 dark:bg-[#222222] dark:text-white dark:hover:bg-[#333333]"
                                            >
                                                {isTextExpanded ? (
                                                    <>
                                                        <ChevronUp size={14} className="mr-1" />
                                                        View less
                                                    </>
                                                ) : (
                                                    <>
                                                        <ChevronDown size={14} className="mr-1" />
                                                        View more
                                                    </>
                                                )}
                                            </button>
                                        )}
                                    </div>
                                </div>
                            )
                        ) : (
                            <h2 className="text-xl font-light text-slate-900 dark:text-white">Detailed Report</h2>
                        )}
                    </div>
                </div>

                {historicalScorecards && historicalScorecards.length > 1 && (
                    <div className="mb-6">
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-3 uppercase tracking-wider">Evaluation History</h3>
                        <div className="flex flex-wrap gap-2">
                            {historicalScorecards.map((_, index) => (
                                <button
                                    key={index}
                                    onClick={() => setSelectedVersion(index)}
                                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors cursor-pointer border ${
                                        selectedVersion === index
                                            ? 'bg-purple-600 text-white border-purple-600 shadow-md'
                                            : 'bg-white text-gray-700 border-gray-200 hover:bg-gray-50 dark:bg-[#222222] dark:text-gray-300 dark:border-[#333333] dark:hover:bg-[#2a2a2a]'
                                    }`}
                                >
                                    Attempt {index + 1}
                                    {index === historicalScorecards.length - 1 && ' (Latest)'}
                                </button>
                            ))}
                        </div>
                    </div>
                )}

                <LearnerScorecard scorecard={displayScorecard} className="mt-0" />
            </div>
        </div>
    );
};

export default ScorecardView; 