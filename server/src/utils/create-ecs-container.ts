import { 
  RunTaskCommand, 
  DescribeTasksCommand, 
  waitUntilTasksRunning 
} from "@aws-sdk/client-ecs";

import { 
  DescribeNetworkInterfacesCommand 
} from "@aws-sdk/client-ec2";
import { AWS_CLUSTER, AWS_SECURITYGROUPS, AWS_SUBNETS, ec2Client, ecsClient } from "..";



export async function runTaskAndGetPublicIP(task: string): Promise<string> { 
  try {
    // Step 1: Run the ECS task
    const runTaskCommand = new RunTaskCommand({
      cluster: AWS_CLUSTER,
      taskDefinition: task,
      launchType: 'FARGATE',
      networkConfiguration: {
        awsvpcConfiguration: {
          subnets: AWS_SUBNETS,
          securityGroups: AWS_SECURITYGROUPS,
          assignPublicIp: 'ENABLED',
        },
      },
    });

    const taskResponse = await ecsClient.send(runTaskCommand);

    if (!taskResponse.tasks || taskResponse.tasks.length === 0) {
      throw new Error(`Task failed to start: ${JSON.stringify(taskResponse.failures)}`);
    }

    const taskArn = taskResponse.tasks[0].taskArn;

    if (!taskArn) {
      throw new Error('Task ARN is undefined.');
    }

    console.log(`Task started with ARN: ${taskArn}`);

    // Step 2: Wait for the task to be in the running state
    await waitUntilTasksRunning(
      { client: ecsClient, maxWaitTime: 120 }, // Add maxWaitTime in seconds
      { cluster: AWS_CLUSTER, tasks: [taskArn] }
    );
    console.log(`Task is running: ${taskArn}`);

    // Step 3: Describe the task to get the ENI ID
    const describeTasksCommand = new DescribeTasksCommand({
      cluster: AWS_CLUSTER,
      tasks: [taskArn],
    });

    let describeTasksResponse = await ecsClient.send(describeTasksCommand);

    // Retry if tasks array is empty
    const maxRetries = 5;
    let retries = 0;
    while ((!describeTasksResponse.tasks || describeTasksResponse.tasks.length === 0) && retries < maxRetries) {
      console.log(`Retrying task description... (${retries + 1}/${maxRetries})`);
      await new Promise((resolve) => setTimeout(resolve, 3000)); // Wait for 3 seconds
      describeTasksResponse = await ecsClient.send(describeTasksCommand);
      retries++;
    }

    if (!describeTasksResponse.tasks || describeTasksResponse.tasks.length === 0) {
      throw new Error(`Failed to retrieve task details after ${maxRetries} retries.`);
    }

    const eniId = describeTasksResponse.tasks[0].attachments?.[0]?.details?.find(
      (detail) => detail.name === 'networkInterfaceId'
    )?.value;

    if (!eniId) {
      throw new Error(`Failed to retrieve ENI ID from task: ${JSON.stringify(describeTasksResponse.tasks)}`);
    }

    console.log(`ENI ID: ${eniId}`);

    // Step 4: Get the public IP address from the ENI
    const describeEniCommand = new DescribeNetworkInterfacesCommand({
      NetworkInterfaceIds: [eniId],
    });

    const describeEniResponse = await ec2Client.send(describeEniCommand);
    const publicIp = describeEniResponse.NetworkInterfaces?.[0]?.Association?.PublicIp;

    if (!publicIp) {
      throw new Error(`Failed to retrieve Public IP from ENI: ${eniId}`);
    }

    console.log(`Public IP: ${publicIp}`);
    return publicIp;

  } catch (error) {
    console.error(`Error: ${error instanceof Error ? error.message : error}`);
    throw error;
  }
}
