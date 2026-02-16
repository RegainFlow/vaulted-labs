import { useState } from "react";
import { useGame } from "../../context/GameContext";
import { QUESTS } from "../../data/quests";
import { QuestCard } from "./QuestCard";

export function QuestList() {
  const { questProgress } = useGame();
  const [showCompleted, setShowCompleted] = useState(false);

  const activeQuests = QUESTS.filter((q) => {
    const p = questProgress.find((qp) => qp.questId === q.id);
    return p && p.status === "active";
  });

  const completedQuests = QUESTS.filter((q) => {
    const p = questProgress.find((qp) => qp.questId === q.id);
    return p && p.status === "completed";
  });

  const lockedQuests = QUESTS.filter((q) => {
    const p = questProgress.find((qp) => qp.questId === q.id);
    return !p || p.status === "locked";
  });

  const getProgress = (questId: string) => {
    return (
      questProgress.find((qp) => qp.questId === questId) || {
        questId,
        status: "locked" as const,
        progress: 0
      }
    );
  };

  return (
    <div className="space-y-6" data-tutorial="profile-quests">
      {/* Active Quests */}
      {activeQuests.length > 0 && (
        <div>
          <h3 className="text-base sm:text-lg font-black text-white uppercase tracking-tight mb-3 sm:mb-4">
            Active <span className="text-neon-cyan">Quests</span>
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {activeQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                progress={getProgress(quest.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Locked Quests */}
      {lockedQuests.length > 0 && (
        <div>
          <h3 className="text-sm font-black text-text-dim uppercase tracking-tight mb-3">
            Locked Quests
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {lockedQuests.map((quest) => (
              <QuestCard
                key={quest.id}
                quest={quest}
                progress={getProgress(quest.id)}
              />
            ))}
          </div>
        </div>
      )}

      {/* Completed Quests */}
      {completedQuests.length > 0 && (
        <div>
          <button
            onClick={() => setShowCompleted(!showCompleted)}
            className="flex items-center gap-2 text-sm font-black text-text-dim uppercase tracking-tight mb-3 hover:text-text-muted transition-colors cursor-pointer"
          >
            Completed ({completedQuests.length})
            <svg
              width="12"
              height="12"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              className={`transition-transform ${showCompleted ? "rotate-180" : ""}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>
          {showCompleted && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {completedQuests.map((quest) => (
                <QuestCard
                  key={quest.id}
                  quest={quest}
                  progress={getProgress(quest.id)}
                />
              ))}
            </div>
          )}
        </div>
      )}

      {/* Empty state */}
      {activeQuests.length === 0 &&
        completedQuests.length === 0 &&
        lockedQuests.length === 0 && (
          <p className="text-center text-text-dim text-sm py-8">
            No quests available yet.
          </p>
        )}
    </div>
  );
}
