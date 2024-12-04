import { ECS, ListTasksCommand, StopTaskCommand } from "@aws-sdk/client-ecs";
import { config } from "dotenv";
import mongoose from "mongoose";
config()

export const AWS_REGION = (process.env.AWS_REGION || "")
export const AWS_ACCESSKEY = (process.env.AWS_ACCESSKEY || "")
export const AWS_SECRETACCESSKEY = (process.env.AWS_SECRETACCESSKEY || "")
export const AWS_CLUSTER = (process.env.AWS_CLUSTER|| "")

const ecs = new ECS({
  region: AWS_REGION,
  credentials: {
    accessKeyId: AWS_ACCESSKEY,
    secretAccessKey: AWS_SECRETACCESSKEY
  }
});

mongoose.connect(process.env.MONGODB_URI || "")
  .then(() => {
    stopAllContainers().then(() => {
      mongoose.connection.close()
      process.exit()
    })
  })
  .catch(e => {
    console.log("Error connecting to mongodb")
    throw (e)
  })
async function stopAllContainers(): Promise<void> {
  try {
    // Step 1: List all running tasks in the cluster
    const listTasksCommand = new ListTasksCommand({
      cluster: AWS_CLUSTER,
      desiredStatus: 'RUNNING', // Get only running tasks
    });

    const listTasksResponse = await ecs.send(listTasksCommand);
    const taskArns = listTasksResponse.taskArns;

    if (!taskArns || taskArns.length === 0) {
      console.log("No running tasks found.");
      return;
    }

    console.log(`Found ${taskArns.length} running tasks. Stopping them...`);

    // Step 2: Stop each task
    for (const taskArn of taskArns) {
      const stopTaskCommand = new StopTaskCommand({
        cluster: AWS_CLUSTER,
        task: taskArn,
      });

      try {
        const stopTaskResponse = await ecs.send(stopTaskCommand);
        console.log(`Task stopped: ${taskArn}`);
      } catch (error) {
        console.error(`Failed to stop task ${taskArn}: ${error instanceof Error ? error.message : error}`);
      }
    }

    console.log("All tasks stopped.");
  } catch (error) {
    console.error("Error stopping containers:", error instanceof Error ? error.message : error);
  }
}
