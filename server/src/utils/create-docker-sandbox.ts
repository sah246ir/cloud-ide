import axios from "axios";
import { DOCKER_VERSION } from "..";

 
const docker = axios.create({
  socketPath: '/var/run/docker.sock',
  baseURL: 'http://localhost/'+DOCKER_VERSION,
  headers: { 'Content-Type': 'application/json' },
});

export async function createSandboxContainer(image:string):Promise<{ containerId:string, containerIP:string }> {
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
