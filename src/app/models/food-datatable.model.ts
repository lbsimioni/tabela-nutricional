export class Food {
    constructor(
        public id?: number,
        private description?: string,
        public category_id?: number,
        private base_qty?: string,
        private base_unit?: number,
        private attributes?: any
    ){}
}