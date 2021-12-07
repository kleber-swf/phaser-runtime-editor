export class IdUtil {
	public static genHexId(): string { return (Math.floor(Math.random() * 1000000)).toString(16); }
	public static genIntId(): number { return Math.floor(Math.random() * Number.MAX_SAFE_INTEGER); }
}
