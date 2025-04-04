import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

export function ScoreCard(props) {
  const { scoreModal, setScoreModal, increaseTeamScore, loading, team } = props;

  // State variables for form inputs
  const [name, setName] = useState("");
  const [volunteerId, setVolunteerId] = useState("");
  const [taskId, setTaskId] = useState("");
  const [score, setScore] = useState("");

  useEffect(() => {
    async function logSession() {
      try {
        const response = await fetch("/api/session", { method: "GET" });
        const data = await response.json();
        console.log("Session details:", data.session);
        if (data.session.email) {
          setVolunteerId(data.session.email);
        }
        if (data.session.name) {
          setName(data.session.name);

        }else{
          if (data.session.email) {
            setName(data.session.email.split("@")[0]);
          }
        }
      } catch (error) {
        console.error("Error fetching session:", error);
      }
    }
    logSession();
  }, []);

  // Handle form submission
  const handleSubmit = async (event) => {
    event.preventDefault();
    console.log("Form submitted with data:", {
      name,
      volunteerId,
      taskId,
      score,
    });
    await increaseTeamScore(team.TeamName, taskId, score);

    // Close the dialog modal after form submission
    setScoreModal(false);
    setTaskId("");
    setScore("");
  };

  return (
    <Dialog onOpenChange={setScoreModal} open={scoreModal}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add Score</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="grid gap-4 py-4">
            {/* Read-only display for Name */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Your Name</Label>
              <div className="col-span-3 py-2 px-3 border border-gray-300 rounded">
                {name || "Loading..."}
              </div>
            </div>
            {/* Read-only display for Volunteer Id */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label className="text-right">Volunteer Id</Label>
              <div className="col-span-3 py-2 px-3 border border-gray-300 rounded">
                {volunteerId || "Loading..."}
              </div>
            </div>
            {/* Editable input for Task Id */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="taskId" className="text-right">
                Task Id
              </Label>
              <Input
                id="taskId"
                placeholder="Enter the task id"
                value={taskId}
                onChange={(e) => setTaskId(e.target.value)}
                className="col-span-3"
                required
                type="text"
              />
            </div>
            {/* Editable input for Score */}
            <div className="grid grid-cols-4 items-center gap-4">
              <Label htmlFor="score" className="text-right">
                Score
              </Label>
              <Input
                id="score"
                placeholder="Enter the score"
                value={score}
                onChange={(e) => setScore(e.target.value)}
                className="col-span-3"
                required
                type="number"
                min={0}
              />
            </div>
          </div>
          <DialogFooter>
            {!loading && <Button type="submit">Add Score</Button>}
            {loading && <Button disabled>Loading...</Button>}
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
