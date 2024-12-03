export function formatISODate(isoString:string) {
    const date = new Date(isoString);

    // Extracting day, month, and year
    const day = date.getDate();
    const year = date.getFullYear();
    
    // Month names
    const months = [
        "January", "February", "March", "April", "May", "June", 
        "July", "August", "September", "October", "November", "December"
    ];
    const month = months[date.getMonth()];

    // Adding ordinal suffix to the day
    const getOrdinalSuffix = (day:number) => {
        if (day > 3 && day < 21) return 'th'; // covers 11th to 20th
        switch (day % 10) {
            case 1: return 'st';
            case 2: return 'nd';
            case 3: return 'rd';
            default: return 'th';
        }
    };

    return `${day}${getOrdinalSuffix(day)} ${month} ${year}`;
}

