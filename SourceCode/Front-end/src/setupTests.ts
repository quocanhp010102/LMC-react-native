// jest-dom adds custom jest matchers for asserting on DOM nodes.
// allows you to do things like:
// expect(element).toHaveTextContent(/react/i)
// learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom';
import { createProxyMiddleware } from 'http-proxy-middleware';

export const setupProxy = (app: any) => {
  app.use(
    createProxyMiddleware(['/users', '/auth/google'], { target: 'http://localhost:3000' })
  );
};