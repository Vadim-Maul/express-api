export class Product {
	constructor(
		public name: string,
		public price: number,
		public image: string,
		public rating: number,
		public heatLevel: number,
		public type: number,
		public description?: string,
	) {}
}
