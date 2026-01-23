import type { Task } from "./types";
import type {KimTask} from "@/api";

export default function rateAnswers(tasks: KimTask[]) {
  for (const item of tasks) {
    item.score = 0;

    // Tasks 1-25: exact match
    // TODO
    if (item.number % 100 <= 25 && item.userAnswer == item.answer[0]) {
      item.score = 1;
    }

    // Task 26 or 127: 2 points
    if (item.number === 26 || item.number === 127) {
      const answer = item.answer.split(" ");
      if (answer.length === 1) answer.push("");
      const key = item.key.split(" ");

      if (item.answer === item.key) {
        item.score = 2;
      } else if (answer.length === 2) {
        if (answer[0] === key[1] && answer[1] === key[0]) item.score = 1;
        if (answer[0] === key[0] || answer[1] === key[1]) item.score = 1;
      }
    }

    // Task 27: complex scoring
    if (item.number === 27) {
      try {
        let answer = item.answer.split("\\n");
        if (answer.length === 1) answer.push(" ");
        const answer0 = answer[0]?.split(" ");
        if (answer0 && answer0.length === 1) answer0.push("");
        const answer1 = answer[1]?.split(" ");

        const key = item.key.split("\\n");
        const key0 = key[0]?.split(" ");
        const key1 = key[1]?.split(" ");

        if (item.answer === item.key) {
          item.score = 2;
        } else if (answer0 && answer1 && key0 && key1) {
          const matches =
            Number(answer0[0] === key0[0]) +
            Number(answer0[1] === key0[1]) +
            Number(answer1[0] === key1[0]) +
            Number(answer1[1] === key1[1]);
          if (matches >= 2) {
            item.score = 1;
          }
        }
      } catch (e) {
        // ignore errors
      }
    }
  }
}
