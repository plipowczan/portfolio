# Advanced Test

## Form Submission with POM

`LoginPage.js`:
```javascript
export class LoginPage {
  constructor(page) {
    this.page = page;
    this.username = page.getByLabel('Username');
    this.password = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
  }

  async login(user, pass) {
    await this.username.fill(user);
    await this.password.fill(pass);
    await this.submitButton.click();
  }
}
```

`login.spec.js`:
```javascript
import { test, expect } from '@playwright/test';
import { LoginPage } from './LoginPage';

test('user can login', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await page.goto('/login');
  await loginPage.login('user', 'password');
  await expect(page).toHaveURL('/dashboard');
});
```
