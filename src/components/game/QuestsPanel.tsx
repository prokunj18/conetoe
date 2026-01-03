import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useQuests } from "@/hooks/useQuests";
import { QUESTS, Quest, getTierColor, getTierLabel, getTierIcon } from "@/data/quests";
import { Coins, Zap, Gift, CheckCircle2, Clock, Trophy } from "lucide-react";

interface QuestCardProps {
  quest: Quest;
  progress: { current: number; completed: boolean; claimed: boolean };
  onClaim: () => void;
}

const QuestCard = ({ quest, progress, onClaim }: QuestCardProps) => {
  const percentage = Math.min((progress.current / quest.target) * 100, 100);
  
  return (
    <div className={`relative p-4 rounded-xl border transition-all duration-300 ${
      progress.claimed 
        ? 'bg-slate-800/30 border-slate-700/30 opacity-60' 
        : progress.completed 
          ? 'bg-gradient-to-br from-emerald-500/10 to-green-600/10 border-emerald-500/40 shadow-[0_0_15px_rgba(16,185,129,0.2)]' 
          : 'bg-card/50 border-border/50 hover:border-primary/30'
    }`}>
      {/* Tier Badge */}
      <div className="flex items-center justify-between mb-3">
        <Badge className={`bg-gradient-to-r ${getTierColor(quest.tier)} text-white text-xs`}>
          <span className="mr-1">{getTierIcon(quest.tier)}</span>
          {getTierLabel(quest.tier)}
        </Badge>
        
        {progress.claimed ? (
          <Badge variant="outline" className="border-slate-600 text-slate-400">
            <CheckCircle2 className="w-3 h-3 mr-1" />
            Claimed
          </Badge>
        ) : progress.completed ? (
          <Badge className="bg-gradient-to-r from-emerald-500 to-green-500 animate-pulse">
            <Gift className="w-3 h-3 mr-1" />
            Ready!
          </Badge>
        ) : null}
      </div>
      
      {/* Quest Info */}
      <h4 className="font-bold text-foreground mb-1">{quest.title}</h4>
      <p className="text-sm text-muted-foreground mb-3">{quest.description}</p>
      
      {/* Progress Bar */}
      <div className="space-y-1.5 mb-3">
        <div className="flex justify-between text-xs">
          <span className="text-muted-foreground">Progress</span>
          <span className={progress.completed ? 'text-emerald-400 font-bold' : 'text-foreground'}>
            {progress.current}/{quest.target}
          </span>
        </div>
        <Progress value={percentage} className="h-2" />
      </div>
      
      {/* Rewards */}
      <div className="flex items-center justify-between">
        <div className="flex gap-3 text-xs">
          <span className="flex items-center gap-1 text-amber-400">
            <Coins className="w-3.5 h-3.5" />
            {quest.reward.bling}
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <Zap className="w-3.5 h-3.5" />
            {quest.reward.exp} XP
          </span>
        </div>
        
        {progress.completed && !progress.claimed && (
          <Button 
            size="sm" 
            onClick={onClaim}
            className="bg-gradient-to-r from-emerald-500 to-green-500 hover:from-emerald-400 hover:to-green-400 text-xs h-7 px-3"
          >
            <Gift className="w-3 h-3 mr-1" />
            Claim
          </Button>
        )}
      </div>
    </div>
  );
};

export const QuestsPanel = () => {
  const { quests, getQuestProgress, claimReward, getActiveQuests, loading } = useQuests();

  if (loading) {
    return (
      <Card className="bg-card/80 backdrop-blur-xl border-primary/20">
        <CardContent className="p-6">
          <div className="flex items-center gap-2 mb-4 animate-pulse">
            <div className="w-8 h-8 bg-muted rounded-lg" />
            <div className="h-6 w-32 bg-muted rounded" />
          </div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  const activeCount = getActiveQuests().length;

  return (
    <Card className="bg-card/80 backdrop-blur-xl border-accent/20 overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-primary/20 via-accent/20 to-secondary/20 p-4 border-b border-border/30">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <div className="p-2 bg-gradient-to-r from-amber-500 to-orange-500 rounded-lg">
              <Trophy className="w-5 h-5 text-white" />
            </div>
            <div>
              <h3 className="font-bold text-lg">Quests</h3>
              <p className="text-xs text-muted-foreground">
                {activeCount} active quest{activeCount !== 1 ? 's' : ''}
              </p>
            </div>
          </div>
          <div className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3.5 h-3.5" />
            <span>Resets daily/weekly</span>
          </div>
        </div>
      </div>
      
      <CardContent className="p-4 space-y-6 max-h-[600px] overflow-y-auto">
        {/* Daily Quests */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-emerald-400 flex items-center gap-2">
            <span>⚡</span> Daily Quests
          </h4>
          {quests.daily.map(quest => (
            <QuestCard 
              key={quest.id}
              quest={quest}
              progress={getQuestProgress(quest.id)}
              onClaim={() => claimReward(quest.id)}
            />
          ))}
        </div>
        
        {/* Weekly Quests */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-blue-400 flex items-center gap-2">
            <span>📅</span> Weekly Quests
          </h4>
          {quests.weekly.map(quest => (
            <QuestCard 
              key={quest.id}
              quest={quest}
              progress={getQuestProgress(quest.id)}
              onClaim={() => claimReward(quest.id)}
            />
          ))}
        </div>
        
        {/* Epic Quests */}
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-amber-400 flex items-center gap-2">
            <span>🏆</span> Epic Quests
          </h4>
          {quests.epic.map(quest => (
            <QuestCard 
              key={quest.id}
              quest={quest}
              progress={getQuestProgress(quest.id)}
              onClaim={() => claimReward(quest.id)}
            />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};
