import { CloudCliPage } from './app.po';

describe('cloud-cli App', function() {
  let page: CloudCliPage;

  beforeEach(() => {
    page = new CloudCliPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
