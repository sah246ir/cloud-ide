type CreateSandboxResponse = {
    sandbox_id?: string;  
};

export const createSandbox = async (language: string,onError:(e:string)=>void): Promise<CreateSandboxResponse| undefined> => {
    const API_URL = 'http://localhost:8000/sandbox'; // Replace with your actual API endpoint

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ language }),
        });

        if (!response.ok) {
            const error:{message:string} = await response.json(); 
            onError(error.message)
            return undefined
        }

        const data: CreateSandboxResponse = await response.json();
        console.log('Sandbox created:', data);
        return data;

    } catch (err: unknown) {  
        onError("weird error")
    }
};
 