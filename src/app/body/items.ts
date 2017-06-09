export class Item {
	private checked: boolean;
	private disabled: boolean;
	private label: string;
	private id: number;
	constructor(label: string) {
		this.label = label;
		this.checked = false;
		this.disabled = false;
	}
	getLabel(): string {
		return this.label;
	}
	getState(): boolean {
		return this.checked;
	}
	changeState(): boolean {
		this.checked = !this.checked;
		return this.checked;
	}
	changeDisabled(): boolean {
		this.disabled = !this.disabled;
		return this.disabled;
	}
	isDisabled(): boolean {
		return this.disabled;
	}
}
export class ItemGroup {
	private items: Array<Item>;
	constructor(item: Array<string>) {
		this.items = [];
		for (const singleItem of item) {
			this.items.push(new Item(singleItem));
		}
	}
	changeState(j: number) {
		this.items.forEach((item, index) => {
			if ( index !== j ) {
				item.changeDisabled();
			} else {
				item.changeState();
			}
		});
	}
	getLabels(): Array<string> {
		const list: Array<string> = [];
		for (const item of this.items) {
			if ( item.getState() ) {
				list.push(item.getLabel());
			}
		};
		if (list.length !== 1) {
			throw new RangeError('Wrong number of items selected');
		}
		return list;
	}

	get(i: number): Item {
		if (i < 0 || i >= this.items.length) {
			throw new RangeError('Currently out of bound');
		}
		return this.items[i];
	}
	getItems(): Array<Item> {
		return this.items;
	}
}
export class Items {
	private groups: Array<ItemGroup>;
	private originalItems: Array<string>;
	private mustShuffle: boolean;
	constructor(items: Array<string>, shuffle: boolean) {
		this.originalItems = items;
		this.mustShuffle = shuffle;
		this.init();
	}
	init() {
		const items = this.originalItems;
		if (this.mustShuffle) {
			this.shuffle(items);
		}
		this.groups = [];
		for (let i = 0; i < items.length; i += 2) {
			this.groups.push(new ItemGroup([items[i], items[i + 1]]));
		}
	}
	changeState(i: number, j: number) {
		if (i < 0 || i >= this.groups.length) {
			throw new RangeError('Currently out of bound');
		}
		this.groups[i].changeState(j);
	}
	getLabels(): Array<string> {
		let list: Array<string> = [];

		for (const item of this.groups) {
				list = list.concat(item.getLabels());
		}
		if (list.length !== this.groups.length ) {
			throw new RangeError('Too many items selected');
		}
		return list;
	}
	get(i: number, j: number): Item {
		if (i < 0 || i >= this.groups.length) {
			throw new RangeError('Currently out of bound');
		}
		return this.groups[i].get(j);
	}
	getGroups(): Array<ItemGroup> {
		return this.groups;
	}
	size(): number {
		return this.groups.length;
	}
	shuffle(a) {
		for (let i = a.length; i; i--) {
			const j = Math.floor(Math.random() * i);
			[a[i - 1], a[j]] = [a[j], a[i - 1]];
		}
	}
}
