import { Issue } from "./store";

export interface RoadmapStep {
  id: string;
  task: string;
  priority: "High" | "Medium" | "Low";
  impact: number;
  description: string;
  status: "pending" | "completed";
}

export function generateRoadmap(issues: Issue[]): RoadmapStep[] {
  return issues
    .filter(issue => issue.type !== "ok")
    .map((issue, index) => {
      let impactValue = 0;
      switch (issue.impact) {
        case "high": impactValue = 15; break;
        case "medium": impactValue = 8; break;
        case "low": impactValue = 3; break;
        default: impactValue = 5;
      }

      return {
        id: `step-${index}`,
        task: issue.label,
        priority: issue.impact === "high" ? "High" : issue.impact === "medium" ? "Medium" : "Low",
        impact: impactValue,
        description: issue.detail || "Fix this issue to improve your SEO score.",
        status: "pending"
      };
    })
    .sort((a, b) => {
      const priorityMap = { "High": 3, "Medium": 2, "Low": 1 };
      return priorityMap[b.priority] - priorityMap[a.priority];
    });
}

export function calculatePotentialScore(currentScore: number, roadmap: RoadmapStep[]): number {
  const totalImpact = roadmap.reduce((acc, step) => acc + step.impact, 0);
  return Math.min(100, currentScore + totalImpact);
}
