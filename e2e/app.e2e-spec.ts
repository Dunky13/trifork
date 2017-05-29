import { TriforkPage } from './app.po';

describe('trifork App', () => {
  let page: TriforkPage;

  beforeEach(() => {
    page = new TriforkPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
