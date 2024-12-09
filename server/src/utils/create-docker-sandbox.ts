import axios from "axios";
import { DOCKER_VERSION, use_docker } from "..";

 

const docker = axios.create({
  socketPath: '/var/run/docker.sock',
  baseURL: 'http://localhost/v1.46',
  headers: { 'Content-Type': 'application/json' },
});
export async function createSandboxContainer(image:string):Promise<{ containerId:string, containerIP:string }> {
  if(!use_docker){
    throw Error("please set use_docker to 1 to use local docker daemon")
  }
  let containerId = null; 
  try {
    const payload = {
      Image:image
    };

    // Create the container
    const createResponse = await docker.post('/containers/create', payload);
    containerId = createResponse.data.Id;

    // Start the container
    await docker.post(`/containers/${containerId}/start`);

    // Inspect the container to get its IP address
    const inspectResponse = await docker.get(`/containers/${containerId}/json`);
    const containerIP = inspectResponse.data.NetworkSettings.IPAddress;

    return { containerId, containerIP } 

  } catch (error) {
    throw error;  
  }  
}


export async function stopAndRemoveContainer(containerId: string): Promise<void> {
  try {
    // Stop the container
    await docker.post(`/containers/${containerId}/stop`);

    // Remove the container
    await docker.delete(`/containers/${containerId}`);

    console.log(`Container with ID ${containerId} has been stopped and removed.`);
  } catch (error) {
    console.error(`Error stopping or removing container ${containerId}: ${error instanceof Error ? error.message : error}`);
    throw error;  // Rethrow the error for the caller to handle
  }
}