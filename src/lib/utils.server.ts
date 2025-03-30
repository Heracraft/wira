import "server-only";

export function generateOTP(length: number): string {
	let otp = "";
	for (let i = 0; i < length; i++) {
		otp += Math.floor(Math.random() * 10); // Generates digits 0-9
	}
	return otp;
}

export function transformDynamoDBresults(data:any) {
    const transformedData:any = {};

    for (let key in data) {
		if (data[key].S !== undefined) {
            transformedData[key] = data[key].S;
        } else if (data[key].N !== undefined) {
            transformedData[key] = Number(data[key].N);
        } else if (data[key].L !== undefined) {
            transformedData[key] = data[key].L; // Assuming list format remains the same
        }
    }

    return transformedData;
}
export const isDev = process.env.NODE_ENV === 'development';
