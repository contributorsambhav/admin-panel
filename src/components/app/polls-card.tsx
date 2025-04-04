import { Check, Info, Award, FilePlus, Activity } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import React, { useState } from "react";
import firebase_app from "@/firebaseConfig";
import {
  getFirestore,
  addDoc,
  collection,
  doc,
  updateDoc,
  getDoc,
  where,
  getDocs,
  query,
} from "firebase/firestore";
import { toast } from "react-toastify";
import TaskModal from "./task-modal";
import { ScoreCard } from "./score-card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  HoverCard,
  HoverCardContent,
  HoverCardTrigger,
} from "@/components/ui/hover-card";

type CardProps = React.ComponentProps<typeof Card>;

interface TeamData {
  TeamName: string;
  isAlive: boolean;
  score: number;
  tasks: string[];
}

interface PollsCardProps extends CardProps {
  team: TeamData;
  index: number;
  fetchDataFromFirestore: () => Promise<void>;
}

export function PollsCard({ 
  className, 
  team, 
  index, 
  fetchDataFromFirestore,
  ...props 
}: PollsCardProps) {
  const [loading, setLoading] = useState(false);
  const [taskModalOpen, setTaskModalOpen] = useState(false);
  const [scoreModalOpen, setScoreModalOpen] = useState(false);
  const [taskDetails, setTaskDetails] = useState([]);

  const increaseTeamScore = async (
    teamName: string,
    taskId: string,
    scoreInc: string,
  ) => {
    try {
      setLoading(true);
      const db = getFirestore(firebase_app);
      const teamsRef = collection(db, "Teams");
      
      const teamQuery = query(teamsRef, where("TeamName", "==", teamName));
      const querySnapshot = await getDocs(teamQuery);

      if (querySnapshot.size === 1) {
        const teamDoc = querySnapshot.docs[0];
        const currentScore = teamDoc.data().score || 0;
        const currentTasks = teamDoc.data().tasks || [];
        const newScore = parseInt(currentScore) + parseInt(scoreInc);
        
        if (!currentTasks.includes(taskId)) {
          const updatedTasks = [...currentTasks, taskId];
          
          await updateDoc(teamDoc.ref, {
            tasks: updatedTasks,
            score: newScore,
          });

          toast.success(
            `Team ${teamName} gained ${scoreInc} points for completing task #${taskId}`,
            { position: "bottom-right" }
          );
          
          await fetchDataFromFirestore();
        } else {
          toast.error(`Task #${taskId} has already been recorded for this team`);
        }
      } else {
        toast.error(`Couldn't find team: ${teamName}`);
      }
    } catch (error) {
      console.error("Error updating team score:", error);
      toast.error("Failed to update team score");
    } finally {
      setLoading(false);
    }
  };

  const getTeamRankClass = (index: number) => {
    if (index === 0) return "bg-yellow-100 dark:bg-yellow-900";
    if (index === 1) return "bg-gray-100 dark:bg-gray-800";
    if (index === 2) return "bg-amber-100 dark:bg-amber-900";
    return "";
  };

  return (
    <Card 
      className={cn(
        "w-full max-w-3xl transition-all duration-300 hover:shadow-md", 
        getTeamRankClass(index),
        className
      )} 
      {...props}
    >
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Badge variant={index < 3 ? "default" : "outline"} className="h-6 w-6 rounded-full p-0 flex items-center justify-center">
              {index + 1}
            </Badge>
            <CardTitle className={cn(
              "text-xl flex items-center gap-2",
              !team.isAlive && "text-gray-500"
            )}>
              <span className={team.isAlive ? "" : "line-through"}>
                {team.TeamName}
              </span>
              {!team.isAlive && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Badge variant="destructive" className="text-xs">Eliminated</Badge>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>This team has been eliminated from the competition</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="flex items-center gap-4 mt-1">
          <HoverCard>
            <HoverCardTrigger asChild>
              <div className="flex items-center gap-1 cursor-help">
                <Award className="h-4 w-4" />
                <span>Score: {team.score}</span>
              </div>
            </HoverCardTrigger>
            <HoverCardContent className="w-80">
              <div className="flex justify-between space-y-1">
                <span className="text-sm font-medium">Score Breakdown</span>
                <span className="text-sm text-muted-foreground">Total: {team.score}</span>
              </div>
              <div className="text-sm text-muted-foreground">
                Points are awarded for each completed task based on difficulty level
              </div>
            </HoverCardContent>
          </HoverCard>

          <div className="flex items-center gap-1">
            <Activity className="h-4 w-4" />
            <span>Tasks: {team.tasks.length}</span>
          </div>
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setTaskModalOpen(true)}
            disabled={loading}
          >
            <Info className="h-4 w-4" />
            View Details
          </Button>
          
          <Button
            variant="default"
            size="sm"
            className="flex items-center gap-2"
            onClick={() => setScoreModalOpen(true)}
            disabled={loading || !team.isAlive}
          >
            {loading ? (
              <>
                <Skeleton className="h-4 w-4 rounded-full" />
                Processing...
              </>
            ) : (
              <>
                <FilePlus className="h-4 w-4" />
                Add Score
              </>
            )}
          </Button>
        </div>
      </CardContent>

      {/* Modals */}
      <TaskModal
        open={taskModalOpen}
        setOpen={setTaskModalOpen}
        team={team}
        setP={setTaskDetails}
      />

      <ScoreCard
        scoreModal={scoreModalOpen}
        setScoreModal={setScoreModalOpen}
        increaseTeamScore={increaseTeamScore}
        team={team}
      />
    </Card>
  );
}