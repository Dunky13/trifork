import { Items } from './items';

describe('Survey choices', () => {
	it('requires exactly one selection in each pair', () => {
		const items = new Items(['First', 'Second', 'Third', 'Fourth'], false);
		expect(() => items.getLabels()).toThrowError(RangeError);
		items.changeState(0, 0);
		items.changeState(1, 1);
		expect(items.getLabels()).toEqual(['First', 'Fourth']);
	});

	it('allows deselection and restores the sibling choice', () => {
		const items = new Items(['First', 'Second'], false);
		items.changeState(0, 0);
		expect(items.get(0, 1).isDisabled()).toBe(true);
		items.changeState(0, 0);
		expect(items.get(0, 1).isDisabled()).toBe(false);
		expect(items.get(0, 0).getState()).toBe(false);
	});
});
